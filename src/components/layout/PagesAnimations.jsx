import { motion as Motion } from "framer-motion";
export default function PagesAnimations({ children }) {
  const Animate = (variants) => {
    return {
      initial: "initial",
      animate: "animate",
      exit: "exit",
      variants,
    };
  };

  const oppacity = {
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { duration: 1 } },
    exit: {
      opacity: 0.8,
      y: -40,
      transition: { duration: 1, ease: [0.69, -0.3, 0.69, 0.8] },
    },
  };

  const slide = {
    initial: { y: "100vh" },
    animate: { y: "100vh" },
    exit: {
      y: 60,
      transition: { duration: 0.8, delay: 0.1, ease: [0.69, -0.3, 0.69, 0.8] },
    },
  };

  const zoomOut = {
    initial: { y: 0, scale: 1, opacity: 1 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: {
      y: -50,
      scale: 0.8,
      opacity: 0.8,
      transition: { duration: 1, ease: [0.69, -0.3, 0.69, 0.8] },
    },
  };

  return (
    <div className="bg-black overflow-hidden">
      <Motion.div
        {...Animate(slide)}
        className="fixed top-0 left-0 bg-white min-w-full z-1"
        style={{ minHeight: "calc(100vh - 60px)" }}
      ></Motion.div>
      <Motion.div
        {...Animate(zoomOut)}
        className="relative"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <Motion.div
          {...Animate(oppacity)}
          className="relative flex items-center justify-center page bg-white"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          {children}
        </Motion.div>
      </Motion.div>
    </div>
  );
}
