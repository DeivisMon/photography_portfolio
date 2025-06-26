// WarpingScrollContainer.jsx
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { WarpedGroup } from './WarpedGroup';

const CONFIG = {
  canvas: {
    width: '100vw',
    height: '100vh',
    background: 'white',
  },
  image: {
    width: 4,
    height: 3,
  },
  scroll: {
    speed: 0.002,
    maxSpeed: 2,
    friction: 0.9,
  },
  bending: {
    radius: 8,
    angleRange: Math.PI, // full 180° max
  },
};

// Component rendered inside Canvas - controls bendAmount via scroll speed logic
function CanvasScene() {
  const scrollSpeed = useRef(0);
  const bendAmountRef = useRef(0);
  const [bendAmount, setBendAmount] = useState(0);
  const texture = useLoader(THREE.TextureLoader, 'https://picsum.photos/800/600');

  React.useEffect(() => {
    function onWheel(e) {
      scrollSpeed.current += e.deltaY * CONFIG.scroll.speed;
      scrollSpeed.current = Math.max(-CONFIG.scroll.maxSpeed, Math.min(CONFIG.scroll.maxSpeed, scrollSpeed.current));
      console.log('wheel deltaY', e.deltaY, 'scrollSpeed', scrollSpeed.current);
    }
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame(() => {
    scrollSpeed.current *= CONFIG.scroll.friction;
    const nextBend = Math.min(1, Math.abs(scrollSpeed.current) / CONFIG.scroll.maxSpeed);
    bendAmountRef.current = bendAmountRef.current * 0.9 + nextBend * 0.1;
  });

  // Throttle React state updates so UI re-renders but not every frame
  React.useEffect(() => {
    const id = setInterval(() => {
      setBendAmount(bendAmountRef.current);
    }, 30); // 30ms = ~33fps update, adjust as needed
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <WarpedGroup bendAmount={bendAmount} radius={CONFIG.bending.radius} angleRange={CONFIG.bending.angleRange}>
        <group position={[0, 0, 0]}>
          <mesh>
            <planeGeometry args={[CONFIG.image.width, CONFIG.image.height]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        </group>
      </WarpedGroup>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate dampingFactor={0.05} />
    </>
  );
}


export function WarpingScrollContainer() {
  return (
    <div style={{ width: CONFIG.canvas.width, height: CONFIG.canvas.height, background: CONFIG.canvas.background }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <CanvasScene />
      </Canvas>
    </div>
  );
}
