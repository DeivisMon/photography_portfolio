import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function BlurryCursor() {
  const circleRef = useRef(null);

  useGSAP(() => {
  const circle = circleRef.current;

  const xTo = gsap.quickTo(circle, "x", {
    duration: 0.3,
    ease: "sine.out",
  });
  const yTo = gsap.quickTo(circle, "y", {
    duration: 0.3,
    ease: "sine.out",
  });

  const moveCircle = (e) => {
    xTo(e.clientX - 10);
    yTo(e.clientY - 10);
  };

  const hideCursor = (e) => {
    if (!e.relatedTarget) {
      gsap.to(circle, {
        opacity: 0,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  };

  const showCursor = () => {
    gsap.to(circle, {
      opacity: 0.8,
      duration: 0.2,
      ease: "power1.out",
    });
  };

  window.addEventListener("mousemove", moveCircle);
  window.addEventListener("mouseout", hideCursor); 
  window.addEventListener("mouseover", showCursor); 

  return () => {
    window.removeEventListener("mousemove", moveCircle);
    window.removeEventListener("mouseout", hideCursor);
    window.removeEventListener("mouseover", showCursor);
  };
});


  return (
    <div
      ref={circleRef}
      className="pointer-events-none fixed top-0 left-0 w-3 h-3 rounded-full bg-black shadow-md transition-opacity blur-[2px] z-1000"
    />
  );
}
