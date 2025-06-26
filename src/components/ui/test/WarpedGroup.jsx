// WarpedGroup.jsx
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

export function WarpedGroup({ children, bendAmount = 0, radius = 8, angleRange = Math.PI }) {
  const groupRef = useRef();

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      child.userData.flatPos = child.position.clone();
    });
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach(child => {
      const flat = child.userData.flatPos;
      if (!flat) return;

      const normalizedX = flat.x / 9;
      const angle = normalizedX * angleRange * bendAmount;
      const warpedX = Math.sin(angle) * radius;
      const warpedZ = Math.cos(angle) * radius - radius;

      child.position.set(warpedX, flat.y, warpedZ);
      child.rotation.y = -angle;
    });
  });

  return <group ref={groupRef}>{children}</group>;
}
