import * as React from 'react';
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useCursor, Float } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { SystemType, DiseaseType, DISEASES } from '../data';
import * as THREE from 'three';
import { calculateMaterialProps } from './materialLogic';

interface HumanBodyCanvasProps {
  activeSystem: SystemType;
  activeDisease: DiseaseType;
  selectedPartId: string | null;
  onSelectPart: (id: string | null) => void;
}

export default function HumanBodyCanvas({
  activeSystem,
  activeDisease,
  selectedPartId,
  onSelectPart
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
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2} 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 5, -10]} intensity={1.5} color="#4444ff" />
        <pointLight position={[10, -5, 5]} intensity={1} color="#ff4444" />
        <directionalLight position={[0, 10, 0]} intensity={0.5} />
        
        <Suspense fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-emerald-500 font-medium tracking-widest uppercase text-xs">Initializing Anatomy</div>
            </div>
          </Html>
        }>
          <group position={[0, -3.5, 0]}>
            <HumanBody 
              activeSystem={activeSystem} 
              activeDisease={activeDisease}
              selectedPartId={selectedPartId}
              onSelectPart={onSelectPart}
            />
            {/* ContactShadows is expensive; using lighter settings or could be disabled for low-end */}
            <ContactShadows 
              position={[0, -0.01, 0]} 
              opacity={0.6} 
              scale={12} 
              blur={2.5} 
              far={4} 
              color="#000000"
              resolution={256}
              frames={1}
            />
          </group>
          
          <Environment preset="night" />
          
          {/* Post Processing */}
          {/* Performance optimization: Disable multisampling (default is 8) and tune SSAO */}
          <EffectComposer enableNormalPass multisampling={0}>
            {/* SSAO with reduced samples and resolution for performance */}
            <SSAO 
              intensity={1.5}
              radius={0.4}
              luminanceInfluence={0.5}
              color={new THREE.Color(0x000000)}
              worldDistanceThreshold={1.0}
              worldDistanceFalloff={0.5}
              worldProximityThreshold={0.5}
              worldProximityFalloff={0.2}
              resolutionScale={0.5}
              samples={16}
            />
            <Bloom 
              intensity={0.5} 
              luminanceThreshold={0.8} 
              luminanceSmoothing={0.9} 
              mipmapBlur 
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <ToneMapping mode={THREE.ACESFilmicToneMapping} />
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
  getMaterialProps?: (id: string, baseColor: string, system: SystemType) => any;
  onPartPointerOver?: (e: any, id: string) => void;
  onPartPointerOut?: (e: any) => void;
  onPartClick?: (e: any, id: string) => void;
  materialOverrides?: any;
  activeSystem?: SystemType;
  activeDisease?: DiseaseType;
  selectedPartId?: string | null;
  onSelectPart?: (id: string | null) => void;
}

const BodyPart = React.forwardRef<THREE.Mesh, BodyPartProps>(({
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
  return (
    <mesh
      ref={ref}
      onPointerOver={onPartPointerOver ? (e) => onPartPointerOver(e, id) : undefined}
      onPointerOut={onPartPointerOut}
      onClick={onPartClick ? (e) => onPartClick(e, id) : undefined}
      castShadow
      {...meshProps}
    >
      {children}
      {getMaterialProps && (
        <meshPhysicalMaterial
          {...getMaterialProps(id, baseColor, system)}
          {...materialOverrides}
        />
      )}
    </mesh>
  );
});
BodyPart.displayName = 'BodyPart';

// BodyPart is already defined above, but we have a nested redeclaration
function BodyPartInner({
  id,
  system,
  baseColor,
  activeSystem,
  activeDisease,
  selectedPartId,
  onSelectPart,
  children
}: BodyPartProps) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelectPart(id === selectedPartId ? null : id);
  };

  const getMaterialProps = (id: string, baseColor: string, system: SystemType) => {
    const isSelected = selectedPartId === id;
    const isHovered = hovered;
    const isAffected = activeDisease !== 'none' && DISEASES[activeDisease].affectedParts.includes(id);
    
    let color = new THREE.Color(baseColor);
    let emissive = new THREE.Color(0x000000);
    let opacity = 1;
    let transparent = false;
    let roughness = 0.3;
    let metalness = 0.1;
    let transmission = 0;
    let thickness = 0;

    // Organic look for organs
    if (system !== 'skeletal') {
      roughness = 0.2;
      transmission = 0.1;
      thickness = 0.5;
    }

    // Dim non-selected parts if something is selected
    if (selectedPartId && !isSelected) {
      opacity = 0.15;
      transparent = true;
    }

    // Highlight hovered
    if (isHovered && !isSelected) {
      emissive.setHex(0x222222);
      metalness = 0.3;
    }

    // Highlight selected
    if (isSelected) {
      emissive.setHex(0x333333);
      color.lerp(new THREE.Color(0xffffff), 0.3);
      metalness = 0.4;
      roughness = 0.1;
    }

    // Disease effects
    if (isAffected) {
      if (activeDisease === 'heart_attack') {
        color.setHex(0x330000);
        emissive.setHex(0x110000);
        roughness = 0.8;
      } else if (activeDisease === 'broken_bone') {
        color.setHex(0xffcccc);
        emissive.setHex(0x330000);
      } else if (activeDisease === 'common_cold') {
        color.setHex(0x66aa66);
        emissive.setHex(0x001100);
        transmission = 0.3;
      }
    }

    // Ghost effect for other systems when one is active
    if (activeSystem !== 'all' && activeSystem !== system) {
      opacity = 0.05;
      transparent = true;
      color.setHex(0x444444);
    }

    return { 
      color, 
      emissive, 
      opacity, 
      transparent, 
      roughness, 
      metalness, 
      transmission, 
      thickness,
      envMapIntensity: 1.5,
      clearcoat: system === 'skeletal' ? 0.5 : 0.2,
      clearcoatRoughness: 0.1
    };
  };

  // Visibility logic
  const isVisible = (system: SystemType) => {
    if (activeSystem === 'all') return true;
    return activeSystem === system;
  };

  // Animation logic
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

  const commonProps = {
    activeSystem,
    activeDisease,
    selectedPartId,
    onSelectPart
  };

  return (
    <group>
      {/* --- SKELETAL SYSTEM --- */}
      <group visible={isVisible('skeletal') || activeSystem === 'all'}>
        {/* Skull */}
        <BodyPartInner
          id="skull"
          system="skeletal"
          baseColor="#f8fafc"
          position={[0, 6.8, 0]}
          getMaterialProps={getMaterialProps}
          onPartPointerOver={handlePointerOver}
          onPartPointerOut={handlePointerOut}
          onPartClick={handleClick}
        >
          <sphereGeometry args={[0.65, 64, 64]} />
        </BodyPartInner>

        {/* Spine */}
        <BodyPartInner
          id="spine"
          system="skeletal"
          baseColor="#f1f5f9"
          position={[0, 4.6, -0.25]}
          getMaterialProps={getMaterialProps}
          onPartPointerOver={handlePointerOver}
          onPartPointerOut={handlePointerOut}
          onPartClick={handleClick}
        >
          <cylinderGeometry args={[0.18, 0.18, 2.8, 32]} />
        </BodyPartInner>

        {/* Ribcage */}
        <BodyPartInner
          id="ribcage"
          system="skeletal"
          baseColor="#f1f5f9"
          position={[0, 5.0, 0]}
          getMaterialProps={getMaterialProps}
          onPartPointerOver={handlePointerOver}
          onPartPointerOut={handlePointerOut}
          onPartClick={handleClick}
          materialOverrides={{ wireframe: true }}
        >
          <sphereGeometry args={[0.9, 32, 32]} />
        </BodyPartInner>

        {/* Arms */}
        <group>
          <BodyPartInner
            id="humerus"
            system="skeletal"
            baseColor="#f1f5f9"
            position={[-1.3, 4.8, 0]}
            rotation={[0, 0, 0.3]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.12, 0.12, 1.8, 16]} />
          </BodyPartInner>
          <BodyPartInner
            id="humerus"
            system="skeletal"
            baseColor="#f1f5f9"
            position={[1.3, 4.8, 0]}
            rotation={[0, 0, -0.3]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.12, 0.12, 1.8, 16]} />
          </BodyPartInner>
        </group>

        {/* Legs */}
        <group>
          <BodyPartInner
            id="femur"
            system="skeletal"
            baseColor="#f1f5f9"
            position={[-0.6, 2.2, 0]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.18, 0.14, 2.4, 16]} />
            {activeDisease === 'broken_bone' && (
              <mesh position={[0, 0.2, 0.18]}>
                <boxGeometry args={[0.5, 0.08, 0.08]} />
                <meshBasicMaterial color="#ff3333" />
              </mesh>
            )}
          </BodyPartInner>
          <BodyPartInner
            id="femur"
            system="skeletal"
            baseColor="#f1f5f9"
            position={[0.6, 2.2, 0]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <cylinderGeometry args={[0.18, 0.14, 2.4, 16]} />
          </BodyPartInner>
        </group>
      </group>

      {/* --- ORGANS WITH FLOAT EFFECT --- */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* --- CIRCULATORY SYSTEM --- */}
        <group visible={isVisible('circulatory') || activeSystem === 'all'}>
          <BodyPartInner
            ref={heartRef}
            id="heart"
            system="circulatory"
            baseColor="#dc2626"
            position={[0.25, 5.0, 0.3]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <sphereGeometry args={[0.3, 64, 64]} />
          </BodyPartInner>
        </group>

        {/* --- NERVOUS SYSTEM --- */}
        <group visible={isVisible('nervous') || activeSystem === 'all'}>
          <BodyPartInner
            id="brain"
            system="nervous"
            baseColor="#fbbf24"
            position={[0, 6.8, 0.1]}
            scale={[0.85, 0.85, 0.85]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <sphereGeometry args={[0.6, 64, 64]} />
          </BodyPartInner>
        </group>

        {/* --- DIGESTIVE SYSTEM --- */}
        <group visible={isVisible('digestive') || activeSystem === 'all'}>
          <BodyPartInner
            id="stomach"
            system="digestive"
            baseColor="#ea580c"
            position={[-0.25, 3.8, 0.3]}
            rotation={[0, 0, -0.6]}
            getMaterialProps={getMaterialProps}
            onPartPointerOver={handlePointerOver}
            onPartPointerOut={handlePointerOut}
            onPartClick={handleClick}
          >
            <capsuleGeometry args={[0.25, 0.5, 32, 32]} />
          </BodyPartInner>
        </group>

        {/* --- RESPIRATORY SYSTEM --- */}
        <group visible={isVisible('respiratory') || activeSystem === 'all'}>
          <group ref={lungsRef} position={[0, 5.0, 0.2]}>
            <BodyPartInner
              id="lungs"
              system="respiratory"
              baseColor="#db2777"
              position={[-0.45, 0, 0]}
              getMaterialProps={getMaterialProps}
              onPartPointerOver={handlePointerOver}
              onPartPointerOut={handlePointerOut}
              onPartClick={handleClick}
            >
              <capsuleGeometry args={[0.3, 0.6, 32, 32]} />
            </BodyPartInner>
            <BodyPartInner
              id="lungs"
              system="respiratory"
              baseColor="#db2777"
              position={[0.45, 0, 0]}
              getMaterialProps={getMaterialProps}
              onPartPointerOver={handlePointerOver}
              onPartPointerOut={handlePointerOut}
              onPartClick={handleClick}
            >
              <capsuleGeometry args={[0.3, 0.6, 32, 32]} />
            </BodyPartInner>
          </group>
        </group>
      </Float>

      {/* Outer Body Shell (Ghosted) */}
      {activeSystem !== 'all' && (
        <mesh position={[0, 4.2, 0]}>
          <capsuleGeometry args={[1.3, 3.8, 32, 32]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.03} 
            depthWrite={false} 
            roughness={0}
            metalness={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Stylized Human Body Component
function HumanBody({ activeSystem, activeDisease, selectedPartId, onSelectPart }: HumanBodyCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return <BodyPartInner
    id="body"
    system="skeletal"
    baseColor="#ffffff"
    activeSystem={activeSystem}
    activeDisease={activeDisease}
    selectedPartId={selectedPartId}
    onSelectPart={onSelectPart}
  />;
}
