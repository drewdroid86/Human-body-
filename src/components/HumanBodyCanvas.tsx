import * as React from 'react';
import { Suspense, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
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
            <ContactShadows 
              position={[0, -0.01, 0]} 
              opacity={0.6} 
              scale={12} 
              blur={2.5} 
              far={4} 
              color="#000000"
            />
          </group>
          
          <Environment preset="night" />
          
          {/* Post Processing */}
          <EffectComposer enableNormalPass>
            <SSAO 
              intensity={1.5}
              radius={0.4}
              luminanceInfluence={0.5}
              color={new THREE.Color(0x000000)}
              worldDistanceThreshold={1.0}
              worldDistanceFalloff={0.5}
              worldProximityThreshold={0.5}
              worldProximityFalloff={0.2}
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

// Stylized Human Body Component
function HumanBody({ activeSystem, activeDisease, selectedPartId, onSelectPart }: HumanBodyCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useCursor(hovered !== null);

  const handlePointerOver = (e: any, id: string) => {
    e.stopPropagation();
    setHovered(id);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(null);
  };

  const handleClick = (e: any, id: string) => {
    e.stopPropagation();
    onSelectPart(id === selectedPartId ? null : id);
  };

  // Visibility logic
  const isVisible = (system: SystemType) => {
    if (activeSystem === 'all') return true;
    return activeSystem === system;
  };

  const getMaterialProps = (id: string, baseColor: string, system: SystemType) => {
    return calculateMaterialProps(
      id,
      baseColor,
      system,
      activeSystem,
      activeDisease,
      selectedPartId,
      hovered
    );
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

  return (
    <group ref={groupRef}>
      {/* --- SKELETAL SYSTEM --- */}
      <group visible={isVisible('skeletal') || activeSystem === 'all'}>
        {/* Skull */}
        <mesh 
          position={[0, 6.8, 0]} 
          onPointerOver={(e) => handlePointerOver(e, 'skull')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'skull')}
          castShadow
        >
          <sphereGeometry args={[0.65, 64, 64]} />
          <meshPhysicalMaterial {...getMaterialProps('skull', '#f8fafc', 'skeletal')} />
        </mesh>

        {/* Spine */}
        <mesh 
          position={[0, 4.6, -0.25]} 
          onPointerOver={(e) => handlePointerOver(e, 'spine')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'spine')}
          castShadow
        >
          <cylinderGeometry args={[0.18, 0.18, 2.8, 32]} />
          <meshPhysicalMaterial {...getMaterialProps('spine', '#f1f5f9', 'skeletal')} />
        </mesh>

        {/* Ribcage */}
        <mesh 
          position={[0, 5.0, 0]} 
          onPointerOver={(e) => handlePointerOver(e, 'ribcage')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'ribcage')}
          castShadow
        >
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshPhysicalMaterial {...getMaterialProps('ribcage', '#f1f5f9', 'skeletal')} wireframe={true} />
        </mesh>

        {/* Arms */}
        <group>
          <mesh 
            position={[-1.3, 4.8, 0]} rotation={[0, 0, 0.3]}
            onPointerOver={(e) => handlePointerOver(e, 'humerus')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'humerus')}
            castShadow
          >
            <cylinderGeometry args={[0.12, 0.12, 1.8, 16]} />
            <meshPhysicalMaterial {...getMaterialProps('humerus', '#f1f5f9', 'skeletal')} />
          </mesh>
          <mesh 
            position={[1.3, 4.8, 0]} rotation={[0, 0, -0.3]}
            onPointerOver={(e) => handlePointerOver(e, 'humerus')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'humerus')}
            castShadow
          >
            <cylinderGeometry args={[0.12, 0.12, 1.8, 16]} />
            <meshPhysicalMaterial {...getMaterialProps('humerus', '#f1f5f9', 'skeletal')} />
          </mesh>
        </group>

        {/* Legs */}
        <group>
          <mesh 
            position={[-0.6, 2.2, 0]}
            onPointerOver={(e) => handlePointerOver(e, 'femur')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'femur')}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.14, 2.4, 16]} />
            <meshPhysicalMaterial {...getMaterialProps('femur', '#f1f5f9', 'skeletal')} />
            {activeDisease === 'broken_bone' && (
              <mesh position={[0, 0.2, 0.18]}>
                <boxGeometry args={[0.5, 0.08, 0.08]} />
                <meshBasicMaterial color="#ff3333" />
              </mesh>
            )}
          </mesh>
          <mesh 
            position={[0.6, 2.2, 0]}
            onPointerOver={(e) => handlePointerOver(e, 'femur')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'femur')}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.14, 2.4, 16]} />
            <meshPhysicalMaterial {...getMaterialProps('femur', '#f1f5f9', 'skeletal')} />
          </mesh>
        </group>
      </group>

      {/* --- ORGANS WITH FLOAT EFFECT --- */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* --- CIRCULATORY SYSTEM --- */}
        <group visible={isVisible('circulatory') || activeSystem === 'all'}>
          <mesh 
            ref={heartRef}
            position={[0.25, 5.0, 0.3]} 
            onPointerOver={(e) => handlePointerOver(e, 'heart')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'heart')}
            castShadow
          >
            <sphereGeometry args={[0.3, 64, 64]} />
            <meshPhysicalMaterial {...getMaterialProps('heart', '#dc2626', 'circulatory')} />
          </mesh>
        </group>

        {/* --- NERVOUS SYSTEM --- */}
        <group visible={isVisible('nervous') || activeSystem === 'all'}>
          <mesh 
            position={[0, 6.8, 0.1]} 
            scale={[0.85, 0.85, 0.85]}
            onPointerOver={(e) => handlePointerOver(e, 'brain')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'brain')}
          >
            <sphereGeometry args={[0.6, 64, 64]} />
            <meshPhysicalMaterial {...getMaterialProps('brain', '#fbbf24', 'nervous')} />
          </mesh>
        </group>

        {/* --- DIGESTIVE SYSTEM --- */}
        <group visible={isVisible('digestive') || activeSystem === 'all'}>
          <mesh 
            position={[-0.25, 3.8, 0.3]} 
            rotation={[0, 0, -0.6]}
            onPointerOver={(e) => handlePointerOver(e, 'stomach')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'stomach')}
            castShadow
          >
            <capsuleGeometry args={[0.25, 0.5, 32, 32]} />
            <meshPhysicalMaterial {...getMaterialProps('stomach', '#ea580c', 'digestive')} />
          </mesh>
        </group>

        {/* --- RESPIRATORY SYSTEM --- */}
        <group visible={isVisible('respiratory') || activeSystem === 'all'}>
          <group ref={lungsRef} position={[0, 5.0, 0.2]}>
            <mesh 
              position={[-0.45, 0, 0]} 
              onPointerOver={(e) => handlePointerOver(e, 'lungs')}
              onPointerOut={handlePointerOut}
              onClick={(e) => handleClick(e, 'lungs')}
              castShadow
            >
              <capsuleGeometry args={[0.3, 0.6, 32, 32]} />
              <meshPhysicalMaterial {...getMaterialProps('lungs', '#db2777', 'respiratory')} />
            </mesh>
            <mesh 
              position={[0.45, 0, 0]} 
              onPointerOver={(e) => handlePointerOver(e, 'lungs')}
              onPointerOut={handlePointerOut}
              onClick={(e) => handleClick(e, 'lungs')}
              castShadow
            >
              <capsuleGeometry args={[0.3, 0.6, 32, 32]} />
              <meshPhysicalMaterial {...getMaterialProps('lungs', '#db2777', 'respiratory')} />
            </mesh>
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

