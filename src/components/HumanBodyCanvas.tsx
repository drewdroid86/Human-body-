import * as React from 'react';
import { Suspense, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useCursor, Float } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { SystemType, DiseaseType } from '../models/anatomy';
import * as THREE from 'three';
import { calculateMaterialProps } from './materialLogic';

interface HumanBodyCanvasProps {
  activeSystem: SystemType;
  activeDisease: DiseaseType;
  selectedPartId: string | null;
  onSelectPart: (id: string | null) => void;
  showShell: boolean;
}

export default function HumanBodyCanvas({
  activeSystem,
  activeDisease,
  selectedPartId,
  onSelectPart,
  showShell
}: HumanBodyCanvasProps) {
  return (
    <div className="w-full h-full bg-zinc-950">
      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: 40 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <color attach="background" args={['#050505']} />

        <ambientLight intensity={0.3} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.4}
          penumbra={0.8}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 5, -10]} intensity={1.2} color="#4a90e2" />
        <pointLight position={[10, -5, 5]} intensity={0.8} color="#e24a4a" />
        <directionalLight position={[0, 10, 0]} intensity={0.6} color="#ffffff" />
        <directionalLight position={[0, -10, 0]} intensity={0.3} color="#87ceeb" />

        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-emerald-500 font-medium tracking-widest uppercase text-xs">Initializing Anatomy</div>
            </div>
          </Html>
        }>
          <group position={[0, -3.5, 0]}>
            <AnatomyModel
              activeSystem={activeSystem}
              activeDisease={activeDisease}
              selectedPartId={selectedPartId}
              onSelectPart={onSelectPart}
              showShell={showShell}
            />
            <ContactShadows
              position={[0, -0.01, 0]}
              opacity={0.7}
              scale={14}
              blur={3}
              far={6}
              color="#000000"
              resolution={512}
              frames={1}
            />
          </group>

          <Environment preset="night" />

          <EffectComposer enableNormalPass multisampling={4}>
            <SSAO
              intensity={1.2}
              radius={0.5}
              luminanceInfluence={0.6}
              color={new THREE.Color(0x000000)}
              worldDistanceThreshold={1.5}
              worldDistanceFalloff={0.8}
              worldProximityThreshold={0.3}
              worldProximityFalloff={0.5}
              resolutionScale={0.8}
              samples={21}
            />
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.8}
              mipmapBlur
              kernelSize={3}
            />
            <Noise opacity={0.015} />
            <Vignette eskil={false} offset={0.15} darkness={1.2} />
            <ToneMapping mode={THREE.ACESFilmicToneMapping} resolution={256} />
          </EffectComposer>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          target={[0, 3.5, 0]}
          makeDefault
          autoRotate={!selectedPartId && activeSystem === 'all' && activeDisease === 'none'}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

interface BodyPartProps extends Omit<React.ComponentProps<'mesh'>, 'id'> {
  id: string;
  system: SystemType;
  baseColor: string;
  getMaterialProps: (id: string, baseColor: string, system: SystemType) => any;
  onPartPointerOver: (e: any, id: string) => void;
  onPartPointerOut: (e: any) => void;
  onPartClick: (e: any, id: string) => void;
  materialOverrides?: any;
}

const BodyPart = React.memo(React.forwardRef<THREE.Mesh, BodyPartProps>(({
  id,
  system,
  baseColor,
  getMaterialProps,
  onPartPointerOver,
  onPartPointerOut,
  onPartClick,
  materialOverrides = {},
  children,
  ...meshProps
}, ref) => {
  const materialProps = getMaterialProps(id, baseColor, system);

  return (
    <mesh
      ref={ref}
      onPointerOver={(e) => onPartPointerOver(e, id)}
      onPointerOut={onPartPointerOut}
      onClick={(e) => onPartClick(e, id)}
      castShadow
      {...meshProps}
    >
      {children}
      <meshPhysicalMaterial
        {...materialProps}
        {...materialOverrides}
      />
    </mesh>
  );
}));
BodyPart.displayName = 'BodyPart';

function AnatomyModel({
  activeSystem,
  activeDisease,
  selectedPartId,
  onSelectPart,
  showShell
}: HumanBodyCanvasProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  useCursor(!!hoveredPart);

  const handlePointerOver = React.useCallback((e: any, partId: string) => {
    e.stopPropagation();
    setHoveredPart(partId);
  }, []);

  const handlePointerOut = React.useCallback((e: any) => {
    e.stopPropagation();
    setHoveredPart(null);
  }, []);

  const handleClick = React.useCallback((e: any, partId: string) => {
    e.stopPropagation();
    onSelectPart(partId === selectedPartId ? null : partId);
  }, [selectedPartId, onSelectPart]);

  const getPartMaterialProps = React.useCallback((partId: string, partBaseColor: string, partSystem: SystemType) => {
    return calculateMaterialProps(
      partId,
      partBaseColor,
      partSystem,
      activeSystem,
      activeDisease,
      selectedPartId,
      hoveredPart
    );
  }, [activeSystem, activeDisease, selectedPartId, hoveredPart]);

  const isVisible = (system: SystemType) => {
    if (activeSystem === 'all') return true;
    if (activeSystem === 'skeletal' && system === 'skeletal') return true;
    return activeSystem === system;
  };

  const heartRef = useRef<THREE.Mesh>(null);
  const lungsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (heartRef.current) {
      if (activeDisease === 'heart_attack') {
        const scale = 1 + Math.sin(time * 18) * 0.015 * Math.random();
        heartRef.current.scale.set(scale, scale, scale);
      } else {
        const scale = 1 + Math.sin(time * 4.5) * 0.06;
        heartRef.current.scale.set(scale, scale, scale);
      }
    }

    if (lungsRef.current) {
      if (activeDisease === 'common_cold') {
        const scale = 1 + Math.sin(time * 3.5) * 0.02;
        lungsRef.current.scale.set(scale, scale, scale);
      } else {
        const scale = 1 + Math.sin(time * 1.8) * 0.07;
        lungsRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group>
      {/* SKELETAL SYSTEM */}
      <group visible={isVisible('skeletal')}>
        <BodyPart
          id="skull" system="skeletal" baseColor="#f8fafc" position={[0, 6.8, 0]}
          getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
        >
          <sphereGeometry args={[0.65, 64, 64]} />
          {/* Add more detailed skull features */}
          <mesh position={[0, 0.1, 0.4]}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <meshPhysicalMaterial color="#f1f5f9" roughness={0.8} metalness={0.1} />
          </mesh>
        </BodyPart>

        <BodyPart
          id="spine" system="skeletal" baseColor="#f1f5f9" position={[0, 4.6, -0.25]}
          getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
        >
          <cylinderGeometry args={[0.18, 0.18, 2.8, 32]} />
        </BodyPart>

        {/* Individual vertebrae for more detail */}
        {Array.from({ length: 7 }, (_, i) => (
          <BodyPart
            key={`vertebra-${i}`}
            id="spine" system="skeletal" baseColor="#e2e8f0" position={[0, 3.2 + i * 0.35, -0.25]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
          </BodyPart>
        ))}

        <BodyPart
          id="ribcage" system="skeletal" baseColor="#f1f5f9" position={[0, 5.0, 0]}
          getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
        >
          <sphereGeometry args={[0.9, 32, 32]} />
        </BodyPart>

        {/* Individual ribs for more detail */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * Math.PI) / 6;
          const radius = 0.8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          return (
            <BodyPart
              key={`rib-${i}`}
              id="ribcage" system="skeletal" baseColor="#e2e8f0" position={[x, 5.0 + Math.sin(angle) * 0.2, z]}
              rotation={[0, angle, Math.PI / 6]}
              getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
            >
              <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
            </BodyPart>
          );
        })}

        <group>
          <BodyPart
            id="humerus_l" system="skeletal" baseColor="#f1f5f9" position={[-1.3, 4.8, 0]} rotation={[0, 0, 0.3]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.12, 0.12, 1.8, 16]} />
          </BodyPart>
          <BodyPart
            id="humerus_r" system="skeletal" baseColor="#f1f5f9" position={[1.3, 4.8, 0]} rotation={[0, 0, -0.3]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.12, 0.12, 1.8, 16]} />
          </BodyPart>
        </group>

        <group>
          <BodyPart
            id="femur_l" system="skeletal" baseColor="#f1f5f9" position={[-0.6, 2.2, 0]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.18, 0.14, 2.4, 16]} />
            {activeDisease === 'broken_bone' && (
              <mesh position={[0, 0.2, 0.18]}>
                <boxGeometry args={[0.5, 0.08, 0.08]} />
                <meshBasicMaterial color="#ff3333" />
              </mesh>
            )}
          </BodyPart>
          <BodyPart
            id="femur_r" system="skeletal" baseColor="#f1f5f9" position={[0.6, 2.2, 0]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.18, 0.14, 2.4, 16]} />
          </BodyPart>
        </group>
      </group>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* CIRCULATORY SYSTEM */}
        <group visible={isVisible('circulatory')}>
          <BodyPart
            ref={heartRef} id="heart" system="circulatory" baseColor="#dc2626" position={[0.25, 5.0, 0.3]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <sphereGeometry args={[0.3, 64, 64]} />
          </BodyPart>
        </group>

        {/* NERVOUS SYSTEM */}
        <group visible={isVisible('nervous')}>
          <BodyPart
            id="brain" system="nervous" baseColor="#fbbf24" position={[0, 6.8, 0.1]} scale={[0.85, 0.85, 0.85]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <sphereGeometry args={[0.6, 64, 64]} />
          </BodyPart>
        </group>

        {/* DIGESTIVE SYSTEM */}
        <group visible={isVisible('digestive')}>
          <BodyPart
            id="stomach" system="digestive" baseColor="#ea580c" position={[-0.25, 3.8, 0.3]} rotation={[0, 0, -0.6]}
            getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
          >
            <capsuleGeometry args={[0.25, 0.5, 32, 32]} />
          </BodyPart>
        </group>

        {/* RESPIRATORY SYSTEM */}
        <group visible={isVisible('respiratory')}>
          <group ref={lungsRef} position={[0, 5.0, 0.2]}>
            <BodyPart
              id="lungs" system="respiratory" baseColor="#db2777" position={[-0.45, 0, 0]}
              getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
            >
              <capsuleGeometry args={[0.3, 0.6, 32, 32]} />
            </BodyPart>
            <BodyPart
              id="lungs" system="respiratory" baseColor="#db2777" position={[0.45, 0, 0]}
              getMaterialProps={getPartMaterialProps} onPartPointerOver={handlePointerOver} onPartPointerOut={handlePointerOut} onPartClick={handleClick}
            >
              <capsuleGeometry args={[0.3, 0.6, 32, 32]} />
            </BodyPart>
          </group>
        </group>
      </Float>

      {/* Body Shell */}
      <group visible={showShell}>
        <mesh position={[0, 4.2, 0]}>
          <capsuleGeometry args={[1.3, 3.8, 32, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.08}
            depthWrite={false}
            roughness={0.1}
            metalness={0.8}
            transmission={0.3}
            thickness={0.5}
            envMapIntensity={2.0}
          />
        </mesh>
        {/* Add subtle inner glow */}
        <mesh position={[0, 4.2, 0]}>
          <capsuleGeometry args={[1.25, 3.6, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.02}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </group>
  );
}
