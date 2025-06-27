import images from "../../data/images";
import { motion as Motion } from "framer-motion";
import GlitchScene from "./HoverImageGlitch";

export default function IndexGallery() {
  return (
    <div
      className="max-w-[1800px] flex flex-wrap justify-between items-start gap-x-4 gap-y-16"
      style={{ marginTop: "6rem", marginBottom: "6rem" }}
    >
      {images?.slice(5, 14).map((image, i) => (
        <Motion.div
          key={i}
          className="image-hover group relative flex items-start justify-center overflow-hidden cursor-pointer hover:-skew-y-12 transition-all duration-500 ease-in-out"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.69, -0.3, 0.69, 0.8] },
          }}
        >
          <Motion.img
            src={image.src}
            alt={image.src}
            className="max-w-78 max-h-74 object-contain filter hover:grayscale-75 hover:scale-105 hover:-skew-y-12 transition-all duration-500 ease-in-out origin-center"
            initial={{ scaleY: 0.96 }}
            animate={{ scaleY: 1 }}
            transition={{
              duration: 0.4,
              ease: [0.69, -0.3, 0.69, 0.8],
            }}
            style={{ transformOrigin: "right" }}
          />
          {/* <GlitchScene imageUrl={image.src} /> */}
          <div className="flex flex-col items-center">
            <div style={{   }}>{`[${i + 1}]`}</div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-sm"
                style={{ marginLeft: "0.1rem", writingMode: "vertical-lr" }}
            >
              <span>{`>`} {image.projectType} - {image.date} - {image.place}</span>
            </div>
          </div>
          <Motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{
              duration: 0.4,
                // delay: i * 0.1,
              ease: [0.69, -0.3, 0.69, 0.8],
            }}
            className="absolute top-0 left-0 w-full h-full bg-white z-10 origin-top"
          />
        </Motion.div>
      ))}
    </div>
  );
}
