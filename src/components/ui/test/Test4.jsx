import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Loader() {
  const topCover = useRef(null);
  const bottomCover = useRef(null);
  const leftText = useRef(null);
  const rightText = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Step 1: Texts slide from sides to center
    tl.fromTo(
      leftText.current,
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1.2, ease: "power4.out" }
    )
      .fromTo(
        rightText.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1.2, ease: "power4.out" },
        "<"
      )

      // Step 2: Split - one up, one down
      .to(leftText.current, {
        y: 80,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.3,
      })
      .to(
        rightText.current,
        {
          y: -50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "<"
      )

      // Step 3: Open the covers (up & down)
      .to(
        topCover.current,
        {
          yPercent: -100,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.2"
      )
      .to(
        bottomCover.current,
        {
          yPercent: 100,
          duration: 1.2,
          ease: "power2.inOut",
        },
        "<"
      );
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Top Cover */}
      <div
        ref={topCover}
        className="absolute top-0 left-0 w-full h-1/2 bg-black flex items-end justify-center"
      />

      {/* Bottom Cover */}
      <div
        ref={bottomCover}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-black flex items-start justify-center"
      />

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-wrapper flex space-x-4 text-5xl font-semibold">
          <h2 ref={leftText} className="opacity-0 text-white">
            Darius Zvinklys
          </h2>
          <h2 ref={rightText} className="opacity-0 text-white/50">
            Photography
          </h2>
        </div>
      </div>
    </div>
  );
}
