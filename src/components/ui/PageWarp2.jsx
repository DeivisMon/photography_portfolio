import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useScroll, ScrollControls, Scroll } from '@react-three/drei'
import { useRef, useEffect } from 'react'

function ImageGrid({ images }) {
  const groupRef = useRef()
  const scroll = useScroll()
  const lastScrollTime = useRef(0)
  const scrollVelocity = useRef(0)
  const targetCurvature = useRef(0)
  const currentCurvature = useRef(0)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    // Calculate scroll velocity
    const now = state.clock.getElapsedTime()
    const deltaTime = now - lastScrollTime.current
    lastScrollTime.current = now
    scrollVelocity.current = (scroll.offset - scroll.prevOffset) / deltaTime
    
    // Update target curvature based on scroll speed
    targetCurvature.current = Math.min(Math.abs(scrollVelocity.current) * 3, 1)
    
    // Smoothly interpolate to target curvature
    currentCurvature.current += (targetCurvature.current - currentCurvature.current) * 0.1
    
    // Apply curvature to grid
    const radius = 5 / Math.max(currentCurvature.current, 0.001)
    
    groupRef.current.children.forEach((child, i) => {
      const row = Math.floor(i / 3)
      const col = i % 3
      
      // Original flat grid positions
      const gridX = (col - 1) * 2.5
      const gridY = (1 - row) * 2.5
      
      if (currentCurvature.current > 0.01) {
        // Calculate cylindrical position
        const angle = gridX * currentCurvature.current
        child.position.x = Math.sin(angle) * radius
        child.position.z = -Math.cos(angle) * radius + radius
        child.position.y = gridY
        child.rotation.y = -angle
      } else {
        // Flat position
        child.position.set(gridX, gridY, 0)
        child.rotation.y = 0
      }
    })
  })
  
  return (
    <group ref={groupRef}>
      {images.map((img, i) => (
        <ImagePlane key={i} imgUrl={img} />
      ))}
    </group>
  )
}

function ImagePlane({ imgUrl }) {
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial>
        <texture attach="map" image={imgUrl} />
      </meshBasicMaterial>
    </mesh>
  )
}

export default function ScrollScene() {
  const images = [
    '/images/1.jpg', '/images/2.jpg', '/images/3.jpg', '/images/4.jpg', '/images/5.jpg', '/images/6.jpg', 
  ]
  
  return (
    <Canvas>
      <ScrollControls damping={0.1} pages={3} infinite>
        <Scroll>
          <ImageGrid images={images} />
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}