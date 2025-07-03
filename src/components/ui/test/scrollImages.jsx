import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CONFIG = {
  canvas: {
    width: '100vw',
    height: '100vh',
    background: 'white'
  },
  grid: {
    columns: 3,
    rows: 10,
    spacing: 3,
    width: 8
  },
  item: {
    width: 2.5,
    height: 2,
    depth: 0.1
  },
  scroll: {
    speed: 0.05,
    maxBend: Math.PI / 2 // 90 degrees max bend
  }
};

function BendingPlane({ scrollY, children }) {
  const groupRef = useRef();
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Calculate bend amount based on scroll
    const bendAmount = THREE.MathUtils.clamp(
      scrollY * CONFIG.scroll.speed, 
      -CONFIG.scroll.maxBend, 
      CONFIG.scroll.maxBend
    );
    
    // Apply cylindrical bend to all children
    groupRef.current.children.forEach((item, i) => {
      const row = Math.floor(i / CONFIG.grid.columns);
      const col = i % CONFIG.grid.columns;
      
      // Original grid position
      const xPos = -CONFIG.grid.width/2 + col * (CONFIG.grid.width/(CONFIG.grid.columns-1));
      const yPos = row * CONFIG.grid.spacing - (CONFIG.grid.rows * CONFIG.grid.spacing)/2;
      
      // Cylindrical transformation
      const radius = 5;
      const angle = bendAmount * (yPos / (CONFIG.grid.rows * CONFIG.grid.spacing));
      
      // New position
      item.position.x = xPos;
      item.position.y = yPos;
      item.position.z = -Math.cos(angle) * radius + radius;
      
      // Apply rotation to face center
      item.rotation.x = angle;
      
      // Scale based on position to simulate perspective
      const scale = 1 - Math.abs(angle) * 0.3;
      item.scale.set(scale, scale, scale);
    });
  });

  return <group ref={groupRef}>{children}</group>;
}

// This component must be defined INSIDE the Canvas component
const ScrollItem = ({ imageUrl, text, index }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const meshRef = useRef();
  
  return (
    <group ref={meshRef}>
      <mesh>
        <boxGeometry args={[CONFIG.item.width, CONFIG.item.height, CONFIG.item.depth]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Text
        position={[0, -CONFIG.item.height/2 - 0.2, CONFIG.item.depth/2 + 0.01]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

function InfiniteScrollScene() {
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(0);
  const targetScroll = useRef(0);
  
  // Generate items
  const items = useMemo(() => {
    return Array.from({ length: CONFIG.grid.columns * CONFIG.grid.rows }, (_, i) => ({
      id: i,
      imageUrl: `https://picsum.photos/400/300?random=${i+1}`,
      text: `Item ${i+1}`
    }));
  }, []);

  // Handle wheel events
  const handleWheel = (e) => {
    targetScroll.current += e.deltaY * 0.01;
  };

  return (
    <div 
      style={{ 
        width: CONFIG.canvas.width, 
        height: CONFIG.canvas.height, 
        background: CONFIG.canvas.background,
        overflow: 'hidden'
      }}
      onWheel={handleWheel}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ScrollContent items={items} scrollRef={scrollRef} targetScroll={targetScroll} setScrollY={setScrollY} />
      </Canvas>
    </div>
  );
}

// New component that contains all the Canvas-specific logic
function ScrollContent({ items, scrollRef, targetScroll, setScrollY }) {
  // Smooth scroll animation
  useFrame(() => {
    scrollRef.current += (targetScroll.current - scrollRef.current) * 0.1;
    setScrollY(scrollRef.current);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      <BendingPlane scrollY={scrollRef.current}>
        {items.map((item) => (
          <ScrollItem 
            key={item.id} 
            imageUrl={item.imageUrl} 
            text={item.text} 
            index={item.id} 
          />
        ))}
      </BendingPlane>
      
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI/4}
        maxPolarAngle={Math.PI/1.5}
      />
    </>
  );
}

export default InfiniteScrollScene;