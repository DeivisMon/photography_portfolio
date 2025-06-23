import { useState } from "react";
import { motion as Motion } from "motion/react";

const chars = "!@#$%^&*()_+-=[]{}<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({ text }) {
  const [charStates, setCharStates] = useState(() => text.split(""));

  const handleHover = () => {
    const maxCount = 8;

    text.split("").forEach((char, index) => {
      let count = 0;
      
      if (char === " ") return;

      const scrambleChar = () => {
        setCharStates((prev) =>
          prev.map((prevChar, i) => {
            if (i !== index) return prevChar;
            return count < maxCount
              ? chars[Math.floor(Math.random() * chars.length)]
              : text[i];
          })
        );

        count++;
        if (count < maxCount) {
          setTimeout(scrambleChar, Math.floor(Math.random() * 40));
        }
      };

      setTimeout(scrambleChar, Math.random() * 200);
    });
  };

  return (
    <Motion.span
      initial={{ opacity: 0,}}
      animate={{ opacity: 1, }}
      transition={{ duration: 0.8, delay: 5, ease: "easeInOut" }}
      onAnimationComplete={handleHover}
      onMouseEnter={handleHover}
      className="inline-block gap-[0.05em] cursor-pointer"
    >
      {charStates.map((char, i) => (
        <span key={i} data-text={text[i]}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Motion.span>
  );
}
