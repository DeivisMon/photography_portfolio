import images from "../../data/images";
import { motion as Motion } from "framer-motion";
import GlitchScene from "./HoverImageGlitch";

export default function IndexGallery() {
  return (
    <div
      className="w-[1400px] flex flex-wrap justify-between items-start gap-16"
      style={{ marginTop: "4rem" }}
    >
      {images?.slice(0, 13).map((image, i) => (
        <Motion.div
          key={i}
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, y: 200 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, delay: 0.5, ease: [0.37, 0, 0.63, 1] },
          }}
        >
          <Motion.img
            src={image}
            alt={image}
            className="w-max-64 h-max-42 object-contain"
            initial={{ scaleX: 0.8 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 1,
              ease: [0.37, 0, 0.63, 1],
            }}
            style={{ transformOrigin: "right" }}
          />
          <Motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{
              duration: 1,
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
