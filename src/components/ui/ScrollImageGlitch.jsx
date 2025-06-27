import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ScrollGlitchShader } from './ScrollShader';

class ScrollGlitchMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: THREE.UniformsUtils.clone(ScrollGlitchShader.uniforms),
      vertexShader: ScrollGlitchShader.vertexShader,
      fragmentShader: ScrollGlitchShader.fragmentShader,
    });
  }
}

extend({ ScrollGlitchMaterial });

const ScrollImage = ({ imageUrl, size = 4 }) => {
  const texture = useTexture(imageUrl);
  const materialRef = useRef();
  const [scrollIntensity, setScrollIntensity] = useState(0);
  const lastScrollY = useRef(0);
  const velocityRef = useRef(0);
  const requestRef = useRef();

  // Calculate aspect ratio
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = size;
  const height = width / aspect;

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScrollY.current;
      lastScrollY.current = currentScroll;
      
      // Smooth scroll velocity calculation
      velocityRef.current = delta * 0.2 + velocityRef.current * 0.8;
      
      // Set intensity based on scroll speed
      const intensity = Math.min(Math.abs(velocityRef.current) * 0.03, 1.0);
      setScrollIntensity(intensity);
    };

    // Smooth fade-out animation
    const animate = () => {
      setScrollIntensity(prev => {
        // Quadratic ease-out for smoother fade
        return Math.max(prev - 0.03 * Math.sqrt(prev), 0);
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.scrollIntensity.value = scrollIntensity;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <scrollGlitchMaterial 
        ref={materialRef}
        uniforms-tDiffuse-value={texture}
        uniforms-bendAmount-value={2.5}
      />
    </mesh>
  );
};

export const ScrollScene = ({ imageUrl }) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ 
        width: '100%',
        height: '100vh',
        pointerEvents: 'none'
      }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <ScrollImage imageUrl={imageUrl} />
    </Canvas>
  );
};

export default ScrollScene;