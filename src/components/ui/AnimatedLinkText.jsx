import { motion as TextMotion } from "framer-motion";

const DURATION = 0.18;
const STAGGER = 0.025;

export default function AnimatedLinkText({ text }) {
  return (
    <TextMotion.span
      initial="initial"
      whileHover="hover"
      className="relative inline-block cursor-pointer overflow-hidden"
    >
      {/* top letters */}
      <span className="block">
        {text.split("").map((letter, index) => (
          <TextMotion.span
            key={`top-${index}`}
            variants={{
              initial: { y: 0 },
              hover: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * index,
            }}
            className="inline-block"
          >
            {letter}
          </TextMotion.span>
        ))}
      </span>

      {/* bottom letters on hover  */}
      <span className="absolute inset-0 block">
        {text.split("").map((letter, index) => (
          <TextMotion.span
            key={`bottom-${index}`}
            variants={{
              initial: { y: "100%" },
              hover: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER * index,
            }}
            className="inline-block"
          >
            {letter}
          </TextMotion.span>
        ))}
      </span>
    </TextMotion.span>
  );
}
