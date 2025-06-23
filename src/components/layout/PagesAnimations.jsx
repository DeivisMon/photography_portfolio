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
      top: "60px",
      opacity: 0.5,
      transition: { duration: 1, ease: [0.83, 0, 0.17, 1] },
    },
  };

  const slide = {
    initial: { top: "100vh" },
    animate: { top: "100vh" },
    exit: {
      top: "60px",
      transition: { duration: 1, ease: [0.83, 0, 0.17, 1] },
    },
  };

  const zoomOut = {
    initial: { y: 0, scale: 1, opacity: 1 },
    animate: { y: 0, scale: 1, opacity: 1 },
    exit: {
      top: "60px",
      y: -100,
      scale: 0.9,
      opacity: 0.5,
      transition: { duration: 1, ease: [0.83, 0.2, 0.17, 1] },
    },
  };

  return (
    <div className="bg-gray-900">
      <Motion.div
        {...Animate(slide)}
        className="fixed top-0 left-0 bg-white no-repeat bg-no-repeat bg-size-[1200px_800px] bg-bottom min-w-full min-h-full">
      </Motion.div>
      <Motion.div {...Animate(zoomOut)} className="relative">
        <Motion.div
          {...Animate(oppacity)}
          className="relative flex items-center justify-center bg-white bg-no-repeat bg-size-[2000px_600px] norepeat bg-bottom "
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          {children}
        </Motion.div>
      </Motion.div>
    </div>
  );
}
