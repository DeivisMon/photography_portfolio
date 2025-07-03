import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const CONFIG = {
  canvas: {
    width: '100vw',
    height: '100vh',
    background: 'white'
  },
  grid: {
    columns: 4,
    columnSpacing: 4,
    rowSpacing: 4
  },
  image: {
    width: 2.5,
    height: 2,
  },
  scroll: {
    speed: 0.02,
    maxSpeed: 3,
    friction: 0.85  
  },
  bending: {
    angleRange: Math.PI / 12 // Very small angle
  }
};

function ScrollItem({ scrollOffset, bendAmount, col, row, totalRows, itemId }) {
  const meshRef = useRef();
  
  const material = useMemo(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    const color = colors[itemId % colors.length];
    return new THREE.MeshStandardMaterial({ color });
  }, [itemId]);

  const { columns, columnSpacing, rowSpacing } = CONFIG.grid;
  const { angleRange } = CONFIG.bending;

  // Calculate static grid positions - these NEVER change
  const totalWidth = (columns - 1) * columnSpacing;
  const staticX = -totalWidth / 2 + col * columnSpacing;
  const staticY = row * rowSpacing;

  useFrame(() => {
    if (meshRef.current) {
      // Calculate Y position with infinite scroll
      const totalHeight = totalRows * rowSpacing;
      let y = staticY - scrollOffset;
      
      // Infinite scroll wrapping
      while (y > totalHeight / 2 + rowSpacing) {
        y -= totalHeight;
      }
      while (y < -totalHeight / 2 - rowSpacing) {
        y += totalHeight;
      }

      // Apply ONLY rotation for bending - no position changes at all
      let rotationY = 0;
      if (bendAmount > 0.01) {
        const columnOffset = col - 1; // -1, 0, 1 for columns 0, 1, 2
        rotationY = columnOffset * angleRange * bendAmount;
      }

      // Position: X and Z are ALWAYS the same, only Y changes for scroll
      meshRef.current.position.set(staticX, y, 0);
      meshRef.current.rotation.set(0, rotationY, 0);
      
      // Ensure scale is always (1,1,1)
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group ref={meshRef}>
      <mesh material={material}>
        <planeGeometry args={[CONFIG.image.width, CONFIG.image.height]} />
      </mesh>
      <Text
        position={[0, -CONFIG.image.height / 2 - 0.3, 0.01]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {`${itemId}`}
      </Text>
    </group>
  );
}

function ScrollSceneContent({ scrollOffset, bendAmount, updateScroll }) {
  const items = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      col: i % CONFIG.grid.columns,
      row: Math.floor(i / CONFIG.grid.columns)
    }));
  }, []);

  const totalRows = Math.ceil(items.length / CONFIG.grid.columns);

  useFrame((_, delta) => updateScroll(delta));

  return (
    <>
      {items.map(item => (
        <ScrollItem
          key={item.id}
          scrollOffset={scrollOffset}
          bendAmount={bendAmount}
          col={item.col}
          row={item.row}
          totalRows={totalRows}
          itemId={item.id}
        />
      ))}
      <ambientLight intensity={1} />
    </>
  );
}

export default function WarpingScrollContainer() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [bendAmount, setBendAmount] = useState(0);
  const scrollSpeed = useRef(0);
  const containerRef = useRef();

  const handleWheel = (e) => {
    scrollSpeed.current += e.deltaY * CONFIG.scroll.speed;
    scrollSpeed.current = Math.max(-CONFIG.scroll.maxSpeed, Math.min(CONFIG.scroll.maxSpeed, scrollSpeed.current));
  };

  const updateScroll = (delta) => {
    scrollSpeed.current *= CONFIG.scroll.friction;
    setScrollOffset(prev => prev + scrollSpeed.current * delta * 10);

    const speed = Math.abs(scrollSpeed.current);
    const targetBend = Math.min(1, speed / CONFIG.scroll.maxSpeed);
    setBendAmount(prev => prev * 0.9 + targetBend * 0.1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const wheelHandler = (e) => {
        e.preventDefault();
        handleWheel(e);
      };
      
      container.addEventListener('wheel', wheelHandler, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', wheelHandler);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ 
        width: CONFIG.canvas.width, 
        height: CONFIG.canvas.height, 
        background: CONFIG.canvas.background,
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
        color: 'black',
        background: 'rgba(255,255,255,0.8)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <div>Scroll Speed: {scrollSpeed.current.toFixed(3)}</div>
        <div>Bend: {bendAmount.toFixed(3)}</div>
      </div>
      <Canvas 
        camera={{ 
          position: [0, 0, 15], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        orthographic={false}
      >
        <ScrollSceneContent
          scrollOffset={scrollOffset}
          bendAmount={bendAmount}
          updateScroll={updateScroll}
        />
      </Canvas>
    </div>
  );
}