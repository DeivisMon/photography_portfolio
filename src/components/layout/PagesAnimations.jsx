import { motion as Motion } from "framer-motion";
export default function PagesAnimations({children}) {
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
    y: -40, // subtle movement instead of top
    transition: { duration: 1, ease: [0.85, 0, 0.15, 1] },
  },
};


  const slide = {
  initial: { y: "100vh" },
  animate: { y: "100vh" },
  exit: {
    y: 60, // instead of `top: "60px"`
    transition: { duration: 1, ease: [0.85, 0, 0.15, 1] },
  },
};


  const zoomOut = {
  initial: { y: 0, scale: 1, opacity: 1 },
  animate: { y: 0, scale: 1, opacity: 1 },
  exit: {
    y: -100,
    scale: 0.9,
    opacity: 0.8,
    transition: { duration: 1, ease: [0.85, 0, 0.15, 1] },
  },
};


  return (
    <div className="bg-black overflow-hidden">
      <Motion.div
        {...Animate(slide)}
        className="fixed top-0 left-0 bg-white min-w-full z-1"
        style={{ minHeight: "calc(100vh - 60px)" }}
        >
      </Motion.div>
      <Motion.div {...Animate(zoomOut)} 
        className="relative"
        style={{ minHeight: "calc(100vh - 60px)" }}  
      >
        <Motion.div
          {...Animate(oppacity)}
          className="relative flex items-center justify-center bg-white"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          {children}
        </Motion.div>
      </Motion.div>
    </div>
  );
}
