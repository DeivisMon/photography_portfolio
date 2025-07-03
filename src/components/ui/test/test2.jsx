import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CONFIG = {
  canvas: { width: '100vw', height: '100vh', background: 'white' },
  grid: { columns: 3, columnSpacing: 3, rowSpacing: 3 },
  image: { width: 2.5, height: 2 },
  bending: { radius: 8, maxAngle: Math.PI / 2 },
  scroll: { speed: 0.002, maxSpeed: 0.05, friction: 0.95 },
};

function ScrollItem({ imageUrl, text, position, bendAmount }) {
  const meshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useFrame(() => {
    if (!meshRef.current) return;

    // Interpolate bending: if bendAmount=0, flat grid; if bendAmount>0, bent cylinder
    const angle =
      ((position[0] + ((CONFIG.grid.columns - 1) * CONFIG.grid.columnSpacing) / 2) /
        ((CONFIG.grid.columns - 1) * CONFIG.grid.columnSpacing)) *
      CONFIG.bending.maxAngle *
      bendAmount;

    const radius = CONFIG.bending.radius;
    const warpedX = Math.sin(angle) * radius;
    const warpedZ = Math.cos(angle) * radius - radius;

    // Set position: bent X and Z, original Y (vertical)
    meshRef.current.position.set(warpedX, position[1], warpedZ);
    meshRef.current.rotation.y = -angle;

    // Optional fade on edges
    const opacity = 1 - Math.abs(angle) / CONFIG.bending.maxAngle;
    if (meshRef.current.material) {
      meshRef.current.material.opacity = Math.max(0.3, opacity);
      meshRef.current.material.transparent = true;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <planeGeometry args={[CONFIG.image.width, CONFIG.image.height]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {text && (
        <Text position={[0, -CONFIG.image.height / 2 - 0.2, 0.01]} fontSize={0.2} color="black" anchorX="center" anchorY="middle">
          {text}
        </Text>
      )}
    </group>
  );
}

function Gallery({ scrollPos }) {
  const items = useMemo(() => {
    const urls = Array.from({ length: 30 }, (_, i) => `https://picsum.photos/400/300?random=${i + 1}`);
    return urls.map((url, i) => {
      const col = i % CONFIG.grid.columns;
      const row = Math.floor(i / CONFIG.grid.columns);
      const x = col * CONFIG.grid.columnSpacing - ((CONFIG.grid.columns - 1) * CONFIG.grid.columnSpacing) / 2;
      const y = -row * CONFIG.grid.rowSpacing;
      return { id: i, imageUrl: url, text: `Item ${i + 1}`, position: [x, y, 0] };
    });
  }, []);

  // Bend amount goes from 0 to 1 based on scroll speed (or position)
  // Here, simple mapping: max bending only if scroll speed is big
  const bendAmount = Math.min(1, Math.abs(scrollPos) * 0.05);

  return (
    <group>
      {items.map(({ id, imageUrl, text, position }) => (
        <ScrollItem key={id} imageUrl={imageUrl} text={text} position={position} bendAmount={bendAmount} />
      ))}
    </group>
  );
}

function ScrollUpdater({ onScrollUpdate }) {
  const scrollSpeed = useRef(0);

  useFrame((state, delta) => {
    scrollSpeed.current *= CONFIG.scroll.friction;
    onScrollUpdate((pos) => pos + scrollSpeed.current * delta * 10);
  });

  React.useEffect(() => {
    const handleWheel = (e) => {
      scrollSpeed.current += e.deltaY * CONFIG.scroll.speed;
      scrollSpeed.current = Math.max(-CONFIG.scroll.maxSpeed, Math.min(CONFIG.scroll.maxSpeed, scrollSpeed.current));
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return null;
}

export default function CylindricalGallery() {
  const [scrollPos, setScrollPos] = useState(0);

  return (
    <div style={{ width: CONFIG.canvas.width, height: CONFIG.canvas.height, background: CONFIG.canvas.background }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Gallery scrollPos={scrollPos} />
        <ScrollUpdater onScrollUpdate={setScrollPos} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}
