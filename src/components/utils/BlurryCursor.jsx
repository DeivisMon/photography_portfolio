import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function BlurryCursor() {
  const circleRef = useRef(null);

  useGSAP(
    () => {
    const circle = circleRef.current;

    const moveCircle = (e) => {
      gsap.to(circle, {
        x: e.clientX - 12,
        y: e.clientY - 14,
        duration: 0.1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCircle);

    return () => {
      window.removeEventListener("mousemove", moveCircle);
    };
  },);

  return (
    <div
      ref={circleRef}
      className="pointer-events-none fixed top-0 left-0 w-4 h-4 rounded-full bg-black shadow-md opacity-80 blur-[2px] z-50"
    />
  );
}
