import { useRef } from "react";
import { useCursor } from "../hooks/useCursor";
import { useNavHover } from "../hooks/useNavHover";
import { useImageHover } from "../hooks/useImageHover";

export default function BlurryCursor() {
  const cursorRef = useRef(null);
  const defaultSize = 12;

  useCursor(cursorRef, defaultSize);
  useNavHover(cursorRef, defaultSize);
  useImageHover(cursorRef, defaultSize);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[1000] flex items-center justify-center"
      style={{
        width: defaultSize,
        height: defaultSize,
        borderRadius: "999px",
        backgroundColor: "rgba(255, 255, 255, 0)",
        border: "2px solid white",
        mixBlendMode: "difference",
        willChange: "transform, width, height, background-color",
      }}
    >
      <span
        className="cursor-text pointer-events-none"
        style={{
          opacity: 0,
          transition: "opacity 0.2s ease",
          color: "black",
          fontSize: "12px",
        }}
      >
        View
      </span>
    </div>
  );
}
