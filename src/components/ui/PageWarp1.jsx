import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Regular React component with image grid
function ImageGrid() {
  const images = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
    'https://picsum.photos/200/200?random=5',
    'https://picsum.photos/200/200?random=6',
    'https://picsum.photos/200/200?random=7',
    'https://picsum.photos/200/200?random=8',
    'https://picsum.photos/200/200?random=9'
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      padding: '40px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      width: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        margin: '0 0 20px 0',
        color: '#333',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Image Gallery
      </h2>
      {images.map((src, index) => (
        <div
          key={index}
          style={{
            aspectRatio: '1',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img
            src={src}
            alt={`Gallery item ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ))}
    </div>
  );
}

// 3D component that handles the bending
function BendableContainer() {
  const meshRef = useRef();
  const materialRef = useRef();
  const scrollY = useRef(0);
  const targetScrollY = useRef(0);
  const textureRef = useRef();

  // Create canvas texture
  const createTexture = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1024;
    canvas.height = 1024;
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Container background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.roundRect(80, 80, canvas.width - 160, canvas.height - 160, 30);
    ctx.fill();
    
    // Add shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'transparent';
    ctx.fillText('Image Gallery', canvas.width / 2, 180);
    
    // Grid simulation
    const gridSize = 3;
    const cellSize = 180;
    const spacing = 30;
    const startX = (canvas.width - (gridSize * cellSize + (gridSize - 1) * spacing)) / 2;
    const startY = 220;
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * (cellSize + spacing);
        const y = startY + row * (cellSize + spacing);
        
        // Item shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 8;
        
        // Item background
        ctx.fillStyle = colors[row * gridSize + col];
        ctx.roundRect(x, y, cellSize, cellSize, 15);
        ctx.fill();
        
        // Item number
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${row * gridSize + col + 1}`, x + cellSize / 2, y + cellSize / 2 + 10);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    return texture;
  };

  // Handle scroll
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      targetScrollY.current += e.deltaY * 0.001;
      targetScrollY.current = Math.max(-1.5, Math.min(1.5, targetScrollY.current));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Initialize
  useEffect(() => {
    const texture = createTexture();
    textureRef.current = texture;
    
    if (materialRef.current) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }
  }, []);

  useFrame(() => {
    // Smooth scroll
    scrollY.current += (targetScrollY.current - scrollY.current) * 0.1;
    
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      const positions = geometry.attributes.position;
      const positionArray = positions.array;
      
      // Reset to original positions first
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        const x = (i % 33 - 16) * 0.25; // Original x based on grid
        const y = (Math.floor(i / 33) - 16) * 0.25; // Original y based on grid
        
        positionArray[i3] = x; // x
        positionArray[i3 + 1] = y; // y
        positionArray[i3 + 2] = 0; // z
      }
      
      // Apply bending
      const bendStrength = scrollY.current;
      const radius = 4;
      
      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;
        const x = positionArray[i3];
        const y = positionArray[i3 + 1];
        
        // Calculate bend
        const angle = (x / 4) * bendStrength;
        const newX = Math.sin(angle) * (radius + y * 0.1);
        const newZ = Math.cos(angle) * (radius + y * 0.1) - radius;
        
        positionArray[i3] = newX;
        positionArray[i3 + 2] = newZ;
      }
      
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[8, 8, 32, 32]} />
        <meshLambertMaterial 
          ref={materialRef}
          map={textureRef.current}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function CylindricalBendApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        zIndex: 100,
        fontFamily: 'Arial, sans-serif',
        background: 'rgba(0,0,0,0.6)',
        padding: '15px',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Cylindrical Bend Container</h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
          🖱️ Scroll to bend the container<br/>
          🏗️ Half-cylinder surface bending<br/>
          📸 Image grid bends as one unit
        </p>
      </div>

      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 75,
          near: 0.1,
          far: 1000
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1}
        />
        <pointLight position={[-5, 0, 5]} intensity={0.6} color="#4ecdc4" />
        
        {/* Bendable container */}
        <BendableContainer />
      </Canvas>
    </div>
  );
}