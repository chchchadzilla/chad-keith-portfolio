import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MousePosition {
  x: number;
  y: number;
}

interface Background3DProps {
  mousePosition: MousePosition;
}

// Particle Field Component
const ParticleField: React.FC<{ mousePosition: MousePosition }> = ({ mousePosition }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  
  // Generate particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y  
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
    }
    return positions;
  }, []);

  // Animation loop
  useFrame((state) => {
    if (pointsRef.current) {
      // Rotate based on time
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      
      // Mouse interaction - convert mouse to normalized coordinates
      const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
      const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;
      
      // Subtle mouse following
      pointsRef.current.rotation.y += mouseX * 0.001;
      pointsRef.current.rotation.x += mouseY * 0.001;
    }
  });

  return (
    <Points ref={pointsRef} positions={particlePositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#dc2626" // Chad red
        size={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

// Floating Red Particles Only
const FloatingGeometry: React.FC<{ mousePosition: MousePosition }> = ({ mousePosition }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      
      // Mouse interaction
      const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
      const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;
      
      meshRef.current.rotation.y += mouseX * 0.002;
      meshRef.current.position.x = mouseX * 2;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial
          args={[{ color: '#dc2626', transparent: true, opacity: 0.4 }]}
        />
      </mesh>
    </Float>
  );
};

// Additional Geometric Elements - ONLY RED DOTS/PARTICLES
const GeometricElements: React.FC = () => {
  return (
    <>
      {/* Additional Red Particle Clusters */}
      {Array.from({ length: 15 }, (_, i) => (
        <Float
          key={i}
          speed={0.3 + Math.random() * 1}
          rotationIntensity={0.05}
          floatIntensity={0.2}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 40
            ]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              args={[{ 
                color: '#dc2626', 
                transparent: true, 
                opacity: 0.8
              }]}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

// Camera Controller
const CameraController: React.FC<{ mousePosition: MousePosition }> = ({ mousePosition }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Subtle camera movement based on mouse
    const mouseX = (mousePosition.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mousePosition.y / window.innerHeight) * 2 + 1;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseX * 2, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseY * 2, 0.02);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// Main Background3D Component
const Background3D: React.FC<Background3DProps> = ({ mousePosition }) => {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{
          position: [0, 0, 10],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#dc2626" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
        
        {/* Camera Controller */}
        <CameraController mousePosition={mousePosition} />
        
        {/* 3D Elements */}
        <ParticleField mousePosition={mousePosition} />
        <FloatingGeometry mousePosition={mousePosition} />
        <GeometricElements />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#000000', 10, 50]} />
      </Canvas>
    </div>
  );
};

export default Background3D;