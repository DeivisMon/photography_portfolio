import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { GlitchShader } from '../../shaders/GlitchShader';
import images from '../../data/images'; 

// Shader Material
class GlitchMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: THREE.UniformsUtils.clone(GlitchShader.uniforms),
      vertexShader: GlitchShader.vertexShader,
      fragmentShader: GlitchShader.fragmentShader,
    });
  }
}
extend({ GlitchMaterial });
console.log("images", images.map(i => i.src))
const GlitchImage = ({ imageUrl, position = [0, 0, 0], size = 2 }) => {
  const texture = useLoader(TextureLoader, imageUrl);
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [effectActive, setEffectActive] = useState(false);

  useEffect(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    if (hovered) setEffectActive(true);
  }, [hovered]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.intensity.value = effectActive
        ? Math.min(materialRef.current.uniforms.intensity.value + 0.1, 0.75)
        : Math.max(materialRef.current.uniforms.intensity.value - 0.02, 0.0);

      if (effectActive && materialRef.current.uniforms.intensity.value >= 0.75) {
        setEffectActive(false);
      }
    }
  });

  const aspect = texture.image.width / texture.image.height;
  const width = size;
  const height = width / aspect;

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[width, height]} />
      <glitchMaterial ref={materialRef} uniforms-tDiffuse-value={texture} />
    </mesh>
  );
};

const GlitchGalleryCanvas = () => {
  // Arrange images in rows
  const spacing = 3;
  const rowLength = 4;

  return (
    <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        {images.slice(0, 12).map((img, i) => {
          const row = Math.floor(i / rowLength);
          const col = i % rowLength;
          const x = col * spacing - (rowLength * spacing) / 2 + spacing / 2;
          const y = -(row * spacing);
          return <GlitchImage key={i} imageUrl={img.src} position={[x, y, 0]} />;
        })}
      </Suspense>
    </Canvas>
  );
};

export default GlitchGalleryCanvas;
