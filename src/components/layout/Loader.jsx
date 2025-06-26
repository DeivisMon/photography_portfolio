import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SvgCamera from "../ui/SvgCamera";

gsap.registerPlugin(useGSAP);

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const slidingTextLeftRef = useRef(null);
  const slidingTextRightRef = useRef(null);
  const lineRef = useRef(null);
  const cameraRef = useRef(null);
  const wipeContainerRef = useRef(null);

  useGSAP(
    () => {
      const mainTL = gsap.timeline();

      mainTL.from(slidingTextLeftRef.current, {
        opacity: 0,
        xPercent: -100,
        duration: 0.8,
        delay: 0.3,
      });

      mainTL.from(lineRef.current, {
        opacity: 0,
        yPercent: 100,
        duration: 0.4,
      });

      mainTL.from(
        slidingTextRightRef.current,
        {
          xPercent: 100,
          duration: 0.7,
          opacity: 0,
        },
        "<"
      );

      mainTL.to(lineRef.current, { x: 13, duration: 0.3 });
      mainTL.to(lineRef.current, { x: -13, duration: 0.2 });

      mainTL.to(slidingTextLeftRef.current, {
        opacity: 0,
        xPercent: -100,
        duration: 0.5,
      });

      mainTL.to(
        slidingTextRightRef.current,
        {
          xPercent: 100,
          opacity: 0,
          duration: 0.5,
        },
        "<"
      );

      mainTL.to(
        lineRef.current,
        {
          xPercent: -100,
          opacity: 0,
          duration: 0.5,
        },
        "<"
      );

      mainTL.to(
        cameraRef.current,
        {
          scale: 3,
          opacity: 0.01,
          duration: 0.8,
          ease: "expo.out",
        },
        "<"
      );

      mainTL.to(".slider-1", {
        opacity: 0,
        duration: 0,
        ease: "expo.out",
      });

      mainTL.set(wipeContainerRef.current, { autoAlpha: 1 }, "<");

      mainTL.call(() => {
        const bars = gsap.utils
          .toArray(wipeContainerRef.current.children)
          .reverse();

        gsap.set(wipeContainerRef.current, { autoAlpha: 1 });

        const wipeTL = gsap.timeline({
          onComplete: () => {
            gsap.set(wipeContainerRef.current, { autoAlpha: 0 });
            onComplete?.();
          },
        });

        bars.forEach((bar, i) => {
          wipeTL.to(
            bar,
            {
              scaleX: 0,
              duration: 0.2 + i * 0.1,
              opacity: 0.5,
              ease: "power2.inOut",
            },
            i * 0.05
          );
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Main Slider */}
      <div className="slider-1 absolute w-full h-screen bg-black z-20">
        <div className="slider-heading flex flex-col items-center justify-end absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="backdrop-blur-[1px] flex gap-2">
            <h1
              ref={slidingTextLeftRef}
              className="text-white text-5xl font-black font-light"
            >
              DARIUS ŽVINKLYS
            </h1>
            <span
              ref={lineRef}
              className="text-white text-5xl font-black font-light"
            >
              |
            </span>
            <span
              ref={slidingTextRightRef}
              className="text-gray-700 text-5xl font-black font-light"
            >
              PHOTOGRAPHY
            </span>
          </div>
          <div
            ref={cameraRef}
            className="absolute top-1/2 h-[500px] w-[500px] transform -translate-y-1/2 -z-10 opacity-20"
          >
            <SvgCamera />
          </div>
        </div>
      </div>

      {/* Wipe screen */}
      <div
        ref={wipeContainerRef}
        className="fixed inset-0 z-50 pointer-events-none flex"
        style={{ opacity: 0 }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full bg-black"
            style={{
              width: "8.33%",
              transformOrigin: "left",
            }}
          />
        ))}
      </div>
    </div>
  );
}
