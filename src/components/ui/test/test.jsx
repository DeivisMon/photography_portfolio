import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScreenWipe() {
  const containerRef = useRef(null);

  useEffect(() => {
    const divs = gsap.utils.toArray(containerRef.current.children).reverse(); // Right to left

    const tl = gsap.timeline();

    divs.forEach((div, i) => {
      tl.to(
        div,
        {
          scaleX: 0,
          duration: 0.2 + i * 0.1, // progressively slower
          ease: "power2.inOut",
        },
        i * 0.05 // slight stagger
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={containerRef}
        className="flex w-full h-full overflow-hidden"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full bg-black border"
            style={{
              width: "8.33%", // 100% / 12
              transformOrigin: "right",
            }}
          />
        ))}
      </div>
    </div>
  );
}
