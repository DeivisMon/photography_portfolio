import { useState, useEffect, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import images from "../../data/images";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrClose } from "react-icons/gr";

export default function IndexGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const galleryRef = useRef(null); // Ref to the gallery container

  const handleClose = () => setSelectedIndex(null);
  const handleNext = () =>
    setSelectedIndex((prev) => (prev + 1) % images.slice(5, 29).length);
  const handlePrev = () =>
    setSelectedIndex((prev) =>
      (prev - 1 + images.slice(5, 29).length) % images.slice(5, 29).length
    );

  const displayedImages = images.slice(5, 29);

  return (
    <div
      ref={galleryRef} // Assign the ref
      className="relative max-w-[1800px] flex flex-wrap justify-center items-center gap-x-4 gap-y-16" // Centered for better effect
      style={{ marginTop: "100px", marginBottom: "100px" }}
    >
      {displayedImages.map((image, i) => {
        const isSelected = selectedIndex === i;
        const isInactive = selectedIndex !== null && !isSelected;

        // Calculate direction for inactive images
        let direction = 0; // 0 for no translation, 1 for right, -1 for left
        if (isInactive && selectedIndex !== null) {
          direction = i < selectedIndex ? -1 : 1; // If index is less, it's to the left, else to the right
        }

        return (
          <Motion.div // AnimatePresence around each item is not needed for layout animations
            key={image.src + i} // Use a more unique key if image src can repeat
            layout // Enable layout animations
            className="image-hover group flex items-start justify-center overflow-hidden cursor-pointer"
            style={{
              position: selectedIndex === null ? "relative" : "absolute", // Keep relative when unselected, absolute when another is selected
              zIndex: isSelected ? 20 : isInactive ? 1 : 10, // Higher z-index for selected, lower for inactive
              pointerEvents: isInactive ? "none" : "auto", // Disable pointer events for inactive
              // If you want them to be visually present but untappable, remove pointerEvents: 'none'
            }}
            initial={{ opacity: 0, y: 10, scale: 1 }} // Initial state for all images
            animate={
              isSelected
                ? {
                    opacity: 1,
                    scale: 1.2, // Scale up when selected
                    x: 0, // Ensure it's centered horizontally relative to its layout position
                    y: 0, // Ensure it's centered vertically relative to its layout position
                    transition: {
                      duration: 0.6,
                      ease: [0.69, -0.3, 0.69, 0.8],
                    },
                  }
                : isInactive
                ? {
                    opacity: 0,
                    scale: 0.7, // Scale down slightly when inactive
                    x: direction * 300, // Translate based on direction (300px can be adjusted)
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.69, -0.3, 0.69, 0.8],
                    },
                  }
                : {
                    // Default state when not selected and not inactive (i.e., when no image is selected)
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: [0.69, -0.3, 0.69, 0.8],
                    },
                  }
            }
            // `exit` is typically used for components being unmounted from AnimatePresence.
            // Since we are keeping them mounted and just changing their style, `exit` might not be the primary way.
            // However, if you *do* want to unmount them when inactive, you'd wrap them in AnimatePresence
            // and use the `exit` prop. For this effect, we're keeping them mounted.
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
                  {">"} {image.projectType} - {image.date} - {image.place}
                </span>
              </div>
            </div>
            {/* This overlay seems to be for a reveal effect on initial load.
                You might want to reconsider its animation or remove it if it
                conflicts with the new animations.
            <Motion.div
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 w-full h-full bg-white z-10 origin-top"
            />
            */}
          </Motion.div>
        );
      })}

      {/* Focused image in fullscreen */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Motion.div
            key="fullscreen"
            className="fixed top-0 left-0 w-screen bg-white mix-blend-normal flex items-center justify-center z-[100]" // Increased z-index
            style={{ minHeight: "calc(100vh - 60px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Motion.img
              key={displayedImages[selectedIndex].src + "fullscreen"} // Unique key for fullscreen image
              src={displayedImages[selectedIndex].src}
              alt=""
              className="relative max-w-[80vw] max-h-[80vh] object-contain z-[101]" // Z-index higher than container
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />

            {/* Controls */}
            <Motion.button
              onClick={handleClose}
              className="absolute flex items-center top-6 right-6 text-black hover:text-red-400 transition-all duration-500 ease-in-out"
              style={{ margin: "3rem" }}
              initial={{ x: 100, opacity: 0 }} // Animate from right
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: [0.69, -0.3, 0.69, 0.8], delay: 0.2 },
              }}
              exit={{ opacity: 0, x: 100 }} // Animate out to right
            >
              [<span style={{ marginRight: "0.2rem" }}>close</span>{" "}
              <GrClose size={16} />]
            </Motion.button>

            <Motion.button
              onClick={handlePrev}
              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-black hover:text-blue-300"
              initial={{ x: -100, opacity: 0 }} // Animate from left
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: [0.69, -0.3, 0.69, 0.8], delay: 0.2 },
              }}
              exit={{ opacity: 0, x: -100 }} // Animate out to left
            >
              <FaChevronLeft size={32} />
            </Motion.button>

            <Motion.button
              onClick={handleNext}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-black hover:text-blue-300"
              initial={{ x: 100, opacity: 0 }} // Animate from right
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: [0.69, -0.3, 0.69, 0.8], delay: 0.2 },
              }}
              exit={{ opacity: 0, x: 100 }} // Animate out to right
            >
              <FaChevronRight size={32} />
            </Motion.button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}