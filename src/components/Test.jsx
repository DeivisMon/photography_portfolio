import { useEffect, useRef } from "react";
import { gsap } from "gsap";


export default function FancyGsapSequence() {
  const boxRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(boxRefs.current[0], {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: "power1.out",
      })
        .from(
          boxRefs.current[1],
          {
            x: -200,
            opacity: 0,
            duration: 1.0,
            ease: "back.out(1.7)",
          },
          "+=0.2"
        )
        .from(
          boxRefs.current[2],
          {
            rotation: 720,
            scale: 0,
            opacity: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          },
          "+=0.1"
        )
        .from(
          boxRefs.current[3],
          {
            y: -150,
            opacity: 0,
            duration: 0.9,
            ease: "bounce.out",
          },
          "+=0.1"
        )
        .to(
          boxRefs.current[1],
          {
            x: 200,
            opacity: 0,
            duration: 1.0,
            ease: "back.in(1.7)",
          })
          .to(
          boxRefs.current[1],
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "back.in(1)",
          },
          "+=0.2"
        )
        .from(
          boxRefs.current[4],
          {
            x: 200,
            skewX: 30,
            opacity: 0,
            duration: 1.1,
            ease: "circ.out",
          },
          "+=0.2"
        );
    });

    return () => ctx.revert(); 
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 gap-6 px-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (boxRefs.current[i] = el)}
          className="w-48 h-20 bg-indigo-600 text-white flex items-center justify-center rounded-lg shadow-md text-xl"
        >
          Element {i + 1}
        </div>
      ))}
    </div>
  );
}
