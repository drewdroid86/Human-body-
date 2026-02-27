import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useCursor } from '@react-three/drei';
import { SystemType, DiseaseType, BODY_PARTS } from '../data';
import * as THREE from 'three';

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
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={
          <Html center>
            <div className="text-zinc-400 animate-pulse">Loading Model...</div>
          </Html>
        }>
          <group position={[0, -3, 0]}>
            <HumanBody 
              activeSystem={activeSystem} 
              activeDisease={activeDisease}
              selectedPartId={selectedPartId}
              onSelectPart={onSelectPart}
            />
            <ContactShadows position={[0, -0.1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          </group>
        </Suspense>
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          minDistance={3} 
          maxDistance={15}
          target={[0, 3, 0]}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}

// Stylized Human Body Component
function HumanBody({ activeSystem, activeDisease, selectedPartId, onSelectPart }: HumanBodyCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);

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
    const isSelected = selectedPartId === id;
    const isHovered = hovered === id;
    const isAffected = activeDisease !== 'none' && DISEASES[activeDisease].affectedParts.includes(id);
    
    let color = new THREE.Color(baseColor);
    let emissive = new THREE.Color(0x000000);
    let opacity = 1;
    let transparent = false;

    // Dim non-selected parts if something is selected
    if (selectedPartId && !isSelected) {
      opacity = 0.3;
      transparent = true;
    }

    // Highlight hovered
    if (isHovered && !isSelected) {
      emissive.setHex(0x333333);
    }

    // Highlight selected
    if (isSelected) {
      emissive.setHex(0x444444);
      color.lerp(new THREE.Color(0xffffff), 0.2);
    }

    // Disease effects
    if (isAffected) {
      if (activeDisease === 'heart_attack') {
        color.setHex(0x4a0000); // Dark red
        emissive.setHex(0x220000);
      } else if (activeDisease === 'broken_bone') {
        color.setHex(0xffaaaa); // Reddish tint
        emissive.setHex(0x440000);
      } else if (activeDisease === 'common_cold') {
        color.setHex(0x88cc88); // Sickly green
        emissive.setHex(0x002200);
      }
    }

    // Ghost effect for other systems when one is active
    if (activeSystem !== 'all' && activeSystem !== system) {
      opacity = 0.1;
      transparent = true;
      color.setHex(0x888888);
    }

    return { color, emissive, opacity, transparent, roughness: 0.4, metalness: 0.1 };
  };

  // Animation logic
  const heartRef = useRef<THREE.Mesh>(null);
  const lungsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (heartRef.current) {
      if (activeDisease === 'heart_attack') {
        // Irregular, weak beating
        const scale = 1 + Math.sin(time * 15) * 0.02 * Math.random();
        heartRef.current.scale.set(scale, scale, scale);
      } else {
        // Normal beating
        const scale = 1 + Math.sin(time * 5) * 0.05;
        heartRef.current.scale.set(scale, scale, scale);
      }
    }

    if (lungsRef.current) {
      if (activeDisease === 'common_cold') {
        // Shallow, rapid breathing
        const scale = 1 + Math.sin(time * 3) * 0.02;
        lungsRef.current.scale.set(scale, scale, scale);
      } else {
        // Normal breathing
        const scale = 1 + Math.sin(time * 2) * 0.05;
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
          position={[0, 6.5, 0]} 
          onPointerOver={(e) => handlePointerOver(e, 'skull')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'skull')}
          castShadow
        >
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial {...getMaterialProps('skull', '#e2e8f0', 'skeletal')} />
        </mesh>

        {/* Spine */}
        <mesh 
          position={[0, 4.5, -0.2]} 
          onPointerOver={(e) => handlePointerOver(e, 'spine')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'spine')}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.15, 2.5, 16]} />
          <meshStandardMaterial {...getMaterialProps('spine', '#e2e8f0', 'skeletal')} />
        </mesh>

        {/* Ribcage */}
        <mesh 
          position={[0, 4.8, 0]} 
          onPointerOver={(e) => handlePointerOver(e, 'ribcage')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'ribcage')}
          castShadow
        >
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial {...getMaterialProps('ribcage', '#e2e8f0', 'skeletal')} wireframe={true} />
        </mesh>

        {/* Left Humerus */}
        <mesh 
          position={[-1.2, 4.5, 0]} rotation={[0, 0, 0.2]}
          onPointerOver={(e) => handlePointerOver(e, 'humerus')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'humerus')}
          castShadow
        >
          <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
          <meshStandardMaterial {...getMaterialProps('humerus', '#e2e8f0', 'skeletal')} />
        </mesh>

        {/* Right Humerus */}
        <mesh 
          position={[1.2, 4.5, 0]} rotation={[0, 0, -0.2]}
          onPointerOver={(e) => handlePointerOver(e, 'humerus')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'humerus')}
          castShadow
        >
          <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />
          <meshStandardMaterial {...getMaterialProps('humerus', '#e2e8f0', 'skeletal')} />
        </mesh>

        {/* Left Femur */}
        <mesh 
          position={[-0.5, 2, 0]}
          onPointerOver={(e) => handlePointerOver(e, 'femur')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'femur')}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.12, 2, 16]} />
          <meshStandardMaterial {...getMaterialProps('femur', '#e2e8f0', 'skeletal')} />
          
          {/* Fracture visual for broken bone */}
          {activeDisease === 'broken_bone' && (
            <mesh position={[0, 0, 0.16]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshBasicMaterial color="#ff0000" />
            </mesh>
          )}
        </mesh>

        {/* Right Femur */}
        <mesh 
          position={[0.5, 2, 0]}
          onPointerOver={(e) => handlePointerOver(e, 'femur')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'femur')}
          castShadow
        >
          <cylinderGeometry args={[0.15, 0.12, 2, 16]} />
          <meshStandardMaterial {...getMaterialProps('femur', '#e2e8f0', 'skeletal')} />
        </mesh>
      </group>

      {/* --- CIRCULATORY SYSTEM --- */}
      <group visible={isVisible('circulatory') || activeSystem === 'all'}>
        {/* Heart */}
        <mesh 
          ref={heartRef}
          position={[0.2, 4.8, 0.2]} 
          onPointerOver={(e) => handlePointerOver(e, 'heart')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'heart')}
          castShadow
        >
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial {...getMaterialProps('heart', '#ef4444', 'circulatory')} />
        </mesh>
        
        {/* Abstract Veins/Arteries (only visible when circulatory is isolated) */}
        {activeSystem === 'circulatory' && (
          <group>
            {/* Aorta */}
            <mesh position={[0, 4.5, 0.1]}>
              <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            {/* Vena Cava */}
            <mesh position={[-0.1, 4.5, 0.1]}>
              <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
              <meshStandardMaterial color="#3b82f6" />
            </mesh>
          </group>
        )}
      </group>

      {/* --- NERVOUS SYSTEM --- */}
      <group visible={isVisible('nervous') || activeSystem === 'all'}>
        {/* Brain */}
        <mesh 
          position={[0, 6.5, 0]} 
          scale={[0.8, 0.8, 0.8]}
          onPointerOver={(e) => handlePointerOver(e, 'brain')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'brain')}
        >
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial {...getMaterialProps('brain', '#fde047', 'nervous')} />
        </mesh>
      </group>

      {/* --- DIGESTIVE SYSTEM --- */}
      <group visible={isVisible('digestive') || activeSystem === 'all'}>
        {/* Stomach */}
        <mesh 
          position={[-0.2, 3.8, 0.2]} 
          rotation={[0, 0, -0.5]}
          onPointerOver={(e) => handlePointerOver(e, 'stomach')}
          onPointerOut={handlePointerOut}
          onClick={(e) => handleClick(e, 'stomach')}
          castShadow
        >
          <capsuleGeometry args={[0.2, 0.4, 16, 16]} />
          <meshStandardMaterial {...getMaterialProps('stomach', '#fb923c', 'digestive')} />
        </mesh>
      </group>

      {/* --- RESPIRATORY SYSTEM --- */}
      <group visible={isVisible('respiratory') || activeSystem === 'all'}>
        {/* Lungs */}
        <group ref={lungsRef} position={[0, 4.8, 0.1]}>
          {/* Left Lung */}
          <mesh 
            position={[-0.4, 0, 0]} 
            onPointerOver={(e) => handlePointerOver(e, 'lungs')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'lungs')}
            castShadow
          >
            <capsuleGeometry args={[0.25, 0.5, 16, 16]} />
            <meshStandardMaterial {...getMaterialProps('lungs', '#f472b6', 'respiratory')} />
          </mesh>
          {/* Right Lung */}
          <mesh 
            position={[0.4, 0, 0]} 
            onPointerOver={(e) => handlePointerOver(e, 'lungs')}
            onPointerOut={handlePointerOut}
            onClick={(e) => handleClick(e, 'lungs')}
            castShadow
          >
            <capsuleGeometry args={[0.25, 0.5, 16, 16]} />
            <meshStandardMaterial {...getMaterialProps('lungs', '#f472b6', 'respiratory')} />
          </mesh>
        </group>
      </group>

      {/* Outer Body Shell (Ghosted) */}
      {activeSystem !== 'all' && (
        <mesh position={[0, 4.2, 0]} transparent opacity={0.05}>
          <capsuleGeometry args={[1.2, 3.5, 32, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
