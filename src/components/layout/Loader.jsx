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

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.from(slidingTextLeftRef.current, {
        opacity: 0,
        xPercent: -100,
        delay: 0.5,
        duration: 0.8,
        ease: "power1.out",
        yoyo: true,
      });

      tl.from(lineRef.current, {
        opacity: 0,
        yPercent: 100,
        delay: 0.2,
        // repeatDelay: 0.5,
        duration: 0.5,
        ease: "power1.out",
      });

      tl.from(slidingTextRightRef.current, {
          xPercent: 100,
          duration: 0.7,
          ease: "power1.out",
          opacity: 0,
        },
        "<"
      );

      tl.to(slidingTextRightRef.current, {
        xPercent: 0,
        duration: 0.5,
        ease: "power1.out",
        opacity: 1,
      });

      tl.to(lineRef.current, {
        x: 13,
        duration: 0.5,
        ease: "power1.out",
      });

      tl.to(lineRef.current, {
        x: -13,
        duration: 0.3,
        ease: "power1.out",
      });

      tl.to(slidingTextLeftRef.current, {
        opacity: 0,
        xPercent: -100,
        duration: 1,
        ease: "power1.out",
        yoyo: true,
      });

      tl.to(slidingTextRightRef.current, {
          xPercent: 100,
          duration: 1,
          ease: "power1.out",
          opacity: 0,
        },
        "<"
      );

      tl.to(lineRef.current, {
          xPercent: -100,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
        },
        "<"
      );

      tl.to(".slider-1", {
          xPercent: -100,
          duration: 0.8,
          // opacity: 0.2,
          ease: "expo.out",
        },
        "<+=0.1"
      );

      tl.to(".slider-2", {
          xPercent: -100,
          duration: 0.8,
          // opacity: 0.3,
          ease: "power1.out",
        },
        "<+=0.2"
      );

      tl.to(".slider-3", {
          xPercent: -100,
          duration: 0.8,
          // opacity: 0.4,
          ease: "power1.out",
        },
        "<+=0.3"
      );

      tl.to(".slider-4", {
          xPercent: -100,
          duration: 0.6,
          // opacity: 0.8,
          ease: "power1.out",
        },
        "<+=0.4"
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden leading-relaxed"
    >
      <div className="slider-4 absolute w-full h-screen bg-gray-900"></div>
      <div className="slider-3 absolute w-full h-screen bg-gray-850"></div>
      <div className="slider-2 absolute w-full h-screen bg-gray-900"></div>
      <div className="slider-1 absolute w-full h-screen bg-black">
        <div className="slider-heading flex flex-col items-center justify-end absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="backdrop-blur-[1px] flex gap-2">
            <h1
              ref={slidingTextLeftRef}
              className="text-white text-5xl font-black uppercase"
            >
              Darius Žvinklys
            </h1>
            <span
              ref={lineRef}
              className="text-white text-5xl font-black"
            >
              |
            </span>
            <span
              ref={slidingTextRightRef}
              className="text-gray-700 text-5xl font-black uppercase"
            >
              Photography
            </span>
          </div>
          <div className="absolute top-1/2 h-[500px] w-[500px] transform -translate-y-1/2 -z-10 opacity-20">
            <SvgCamera />
          </div>
        </div>
      </div>
    </div>
  );
}
