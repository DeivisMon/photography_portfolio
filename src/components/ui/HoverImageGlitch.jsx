import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { GlitchShader } from "../shaders/GlitchShader";

// Extend custom shader as usable Three.js material
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

export const GlitchImage = ({ imageUrl, containerSize }) => {
  const texture = useTexture(imageUrl);
  const materialRef = useRef();
  const [hovered, setHover] = useState(false);
  const [effectActive, setEffectActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (texture.image) {
      // Configure texture once it’s available
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      setLoaded(true);
    }
  }, [texture]);
  // Determine image size on plane
  let width = 1;
  let height = 1;

  if (texture.image && containerSize.width && containerSize.height) {
    const imageAspect = texture.image.width / texture.image.height;
    const containerAspect = containerSize.width / containerSize.height;

    if (imageAspect >= containerAspect) {
      width = containerSize.width / 100;
      height = width / imageAspect;
    } else {
      height = containerSize.height / 100;
      width = height * imageAspect;
    }
  }

  useEffect(() => {
    if (hovered) setEffectActive(true);
  }, [hovered]);

  useFrame((state) => {
    if (!loaded || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.time.value = time;
    materialRef.current.uniforms.intensity.value = effectActive
      ? Math.min(materialRef.current.uniforms.intensity.value + 0.1, 0.75)
      : Math.max(materialRef.current.uniforms.intensity.value - 0.02, 0.0);

    if (effectActive && materialRef.current.uniforms.intensity.value >= 0.75) {
      setEffectActive(false);
    }
  });

  if (!loaded || !containerSize.width || !containerSize.height) return null;

  return (
    <mesh
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <planeGeometry args={[width, height]} />
      <glitchMaterial ref={materialRef} uniforms-tDiffuse-value={texture} />
    </mesh>
  );
};

export const GlitchScene = ({ imageUrl }) => {
  const containerRef = useRef();
  const [containerSize, setContainerSize] = useState({
    width: 300,
    height: 300,
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[300px] aspect-[4/3] overflow-hidden"
    >
      {/* <Suspense fallback={null}> */}
        <Canvas
          className="absolute inset-0"
          orthographic
          camera={{ position: [0, 0, 5], zoom: 100 }}
        >
          <Preload all />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GlitchImage imageUrl={imageUrl} containerSize={containerSize} />
        </Canvas>
      {/* </Suspense> */}
    </div>
  );
};

export default GlitchScene;
