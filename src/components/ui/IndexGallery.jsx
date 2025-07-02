import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import images from "../../data/images";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrClose } from "react-icons/gr";

export default function IndexGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClose = () => setSelectedIndex(null);
  const handleNext = () =>
    setSelectedIndex((prev) => (prev + 1) % images.slice(5, 14).length);
  const handlePrev = () =>
    setSelectedIndex((prev) =>
      (prev - 1 + images.slice(5, 14).length) % images.slice(5, 14).length
    );

  const displayedImages = images.slice(5, 14);

  return (
    <div className="relative max-w-[1800px] flex flex-wrap justify-between items-center items-start gap-x-4 gap-y-16">
      {displayedImages.map((image, i) => {
        const isSelected = selectedIndex === i;
        const isInactive = selectedIndex !== null && !isSelected;

        return (
          <AnimatePresence key={i}>
            {selectedIndex === null || isInactive ? (
              <Motion.div
                key={i}
                layout
                className="image-hover group absolute flex items-start justify-center overflow-hidden cursor-pointer"
                style={{
                  top: isInactive ? "50%" : "auto",
                  left: isInactive ? "50%" : "auto",
                  transform: isInactive ? "translate(-50%, -50%)" : "none",
                  position: isInactive ? "absolute" : "relative",
                  zIndex: isInactive ? -10 : "auto",
                  pointerEvents: isInactive ? "none" : "auto",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isInactive
                    ? {
                        opacity: 0,
                        scale: 0.5,
                        transition: { duration: 0.8, ease: [0.69, -0.3, 0.69, 0.8], delay: 0.2 },
                      }
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.8, ease: [0.69, -0.3, 0.69, 0.8], delay: 0.2 },
                      }
                }
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSelectedIndex(i)}
              >
                <Motion.img
                  src={image.src}
                  alt={image.src}
                  className="max-w-78 max-h-74 object-contain filter hover:grayscale-75 hover:scale-105 hover:-skew-y-12 transition-all duration-500 ease-in-out origin-center"
                  initial={{ scaleY: 0.96 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: "right" }}
                />
                <div className="flex flex-col items-center">
                  <div>{`[${i + 1}]`}</div>
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out text-sm"
                    style={{
                      marginLeft: "0.1rem",
                      writingMode: "vertical-lr",
                    }}
                  >
                    <span>
                      {`>`} {image.projectType} - {image.date} - {image.place}
                    </span>
                  </div>
                </div>
                <Motion.div
                  initial={{ scaleY: 1 }}
                  animate={{ scaleY: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-0 left-0 w-full h-full bg-white z-10 origin-top"
                />
              </Motion.div>
            ) : null}
          </AnimatePresence>
        );
      })}

      {/* Focused image */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Motion.div
            key="fullscreen"
            className="fixed top-0 left-0 w-screen bg-white mix-blend-normal flex items-center justify-center z-100"
            style={{ minHeight: "calc(100vh - 60px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4 }}
          >
            <Motion.img
              key={displayedImages[selectedIndex].src}
              src={displayedImages[selectedIndex].src}
              alt=""
              className="relative max-w-[80vw] max-h-[80vh] object-contain z-100"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />

            {/* Controls */}
            <button
              onClick={handleClose}
              className="absolute flex items-center top-6 right-6 text-black hover:text-red-400 transition-all duration-500 ease-in-out"
              style={{ margin: "3rem" }}
              initial={{ x: -100, opacity: 0, }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.8, ease: [0.69, -0.3, 0.69, 0.8], delay: 0.2 } }}
              exit={{ opacity: 0 }}
            >
              [<span style={{ marginRight: "0.2rem" }}>close</span>{" "}
              <GrClose size={16} />]
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-black hover:text-blue-300"
            >
              <FaChevronLeft size={32} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-black hover:text-blue-300"
            >
              <FaChevronRight size={32} />
            </button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
