import images from "../../data/images";
import { motion as Motion } from "framer-motion";
import GlitchScene from "./HoverImageGlitch";

export default function IndexGallery() {
  return (
    <div
      className="w-[1400px] flex flex-wrap justify-between items-start gap-32"
      style={{ marginTop: "4rem" }}
    >
      {images?.slice(5, 19).map((image, i) => (
        <Motion.div
          key={i}
          className="image-hover relative flex items-center justify-center overflow-hidden cursor-pointer hover:-skew-y-12 transition-all duration-500 ease-in-out"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.37, 0, 0.63, 1] },
          }}
        >
          <Motion.img
            src={image.src}
            alt={image.src}
            className="max-w-64 max-h-42 object-contain hover:scale-105 hover:-skew-y-12 transition-all duration-500 ease-in-out origin-center"
            initial={{ scaleY: 0.8 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.37, 0, 0.63, 1],
            }}
            style={{ transformOrigin: "right" }}
          />
          <Motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{
              duration: 0.6,
                delay: i * 0.1,
              ease: [0.37, 0, 0.63, 1],
            }}
            className="absolute top-0 left-0 w-full h-full bg-white z-10 origin-top"
          />
        </Motion.div>
      ))}
    </div>
  );
}
