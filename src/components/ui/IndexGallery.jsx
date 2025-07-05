import { useState, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence, easeInOut } from "framer-motion";
import images from "../../data/images";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GrClose } from "react-icons/gr";

export default function IndexGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [imagePositions, setImagePositions] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedIndex(null);
      setIsAnimating(false);
    }, 100);
  };

  // const handleNext = () =>
  //   setSelectedIndex((prev) => (prev + 1) % images.slice(5, 29).length);
  // const handlePrev = () =>
  //   setSelectedIndex((prev) =>
  //     (prev - 1 + images.slice(5, 29).length) % images.slice(5, 29).length
  //   );

  const displayedImages = images.slice(5, 30);

  // Calculate image positions relative to viewport center
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const viewportCenterX = window.innerWidth / 2;
      const positions = {};
      
      const imageElements = containerRef.current.querySelectorAll('[data-image-index]');
      imageElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const imageCenterX = rect.left + rect.width / 2;
        const distanceFromCenter = imageCenterX - viewportCenterX;
        
        positions[index] = {
          distanceFromCenter,
          isLeftSide: distanceFromCenter < 0,
          isRightSide: distanceFromCenter > 0,
          rect
        };
      });
      
      setImagePositions(positions);
    };

    updatePositions();
    
    // Update positions when selection changes to get current rect positions
    const timeoutId = setTimeout(updatePositions, 100);
    
    window.addEventListener('resize', updatePositions);
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timeoutId);
    };
  }, [selectedIndex]);

  const getPartingAnimation = (index, isClosing = false) => {
    const position = imagePositions[index];
    if (!position) return { opacity: isClosing ? 1 : 0, x: 0 };

    const direction = position.isLeftSide ? -1 : 1;
    const baseDistance = Math.abs(position.distanceFromCenter);
    const partingDistance = Math.max(100, baseDistance * 1);
    
    if (isClosing) {
      // Closing animation - images return from their parted positions
      return {
        x: 0,
        opacity: 1,
        transition: { 
          duration: 0.6, 
          ease: easeInOut,
          delay: Math.abs(position.distanceFromCenter) / 6000
        }
      };
    } else {
      // Opening animation - images part to sides
      return {
        x: direction * partingDistance,
        opacity: 0,
        transition: { 
          duration: 0.6, 
          ease: easeInOut,
          delay: Math.abs(position.distanceFromCenter) / 6000
        }
      };
    }
  };

  const getSelectedImageAnimation = (index, stage) => {
    const position = imagePositions[index];
    if (!position) return { scale: 1, opacity: 1, x: 0, y: 0 };

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    const currentImageCenterX = position.rect.left + position.rect.width / 2;
    const currentImageCenterY = position.rect.top + position.rect.height / 2;
    
    const deltaX = viewportCenterX - currentImageCenterX;
    const deltaY = viewportCenterY - currentImageCenterY;

    if (stage === 'moving') {
      // Stage 1: Move to center
      return {
        x: deltaX,
        y: deltaY,
        scale: 1,
        opacity: 1,
        zIndex: 1000,
        transition: { 
          duration: 0.6, 
          ease: easeInOut
        }
      };
    } else if (stage === 'scaling') {
      // Stage 2: Scale up while centered
      return {
        x: deltaX,
        y: deltaY,
        scale: 2.5,
        opacity: 1,
        zIndex: 1000,
        transition: { 
          duration: 0.6, 
          ease: easeInOut,
          delay: 0.2
        }
      };
    } else if (stage === 'closing') {
      // Closing: Scale down and return to original position
      return {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 1000,
        transition: { 
          duration: 0.6, 
          ease: easeInOut
        }
      };
    }
  };

  return (
    <Motion.div 
      ref={containerRef}
      className="relative max-w-[1800px] flex flex-wrap justify-between items-center items-start gap-x-4 gap-y-16 origin-top"
      style={{ marginTop: "100px", marginBottom: "100px" }}
      initial={{ opacity: 0, scale: 5, y: -200, }}
      animate={{ opacity: 1, scale: 1, y: 0, }}
      exit={{ opacity: 0, scale: 0.8, y: -200, }}
      transition={{ duration: 1, ease: easeInOut }}
    >
      {displayedImages.map((image, i) => {
        const isSelected = selectedIndex === i;
        // const isInactive = selectedIndex !== null && !isSelected;
        
        return (
          <Motion.div
            key={i}
            data-image-index={i}
            className={`${isSelected ? 'no-hover' : "image-hover"}  group flex items-start justify-center cursor-pointer`}
            style={{
              zIndex: isSelected ? 1000 : 1
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={
              selectedIndex === null 
                ? { opacity: 1, y: 0, scale: 1, x: 0 }
                : isSelected 
                  ? getSelectedImageAnimation(i, isAnimating ? 'closing' : 'scaling')
                  : getPartingAnimation(i, isAnimating)
            }
            // transition={{ 
            //   duration: selectedIndex === null ? 0.5 : undefined,
            //   ease: easeInOut 
            // }}
            onClick={() => !isSelected && selectedIndex === null && setSelectedIndex(i)}
          >
            <Motion.img
              src={image.src}
              alt={image.src}
              className="max-w-84 max-h-74 object-contain filter hover:grayscale-75 hover:-skew-y-12 transition-all duration-500 ease-in-out"
              style={{ 
                transformOrigin: "right",
                // filter: isInactive ? 'grayscale(100%)' : 'none'
              }}
              initial={{ scaleY: 0.96 }}
              animate={{ 
                scaleY: 1,
                // filter: isInactive ? 'grayscale(100%)' : 'none'
              }}
              transition={{ duration: 0.4 }}
            />
            
            <div className="flex flex-col items-center">
              <Motion.div 
                className={`${
                  isSelected ? 'hidden' : 'flex'}`}
                   initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4,delay: 1 }}
                  >[{i + 1}]
                  </Motion.div>
              <div
                className={`transition-all duration-500 ease-in-out text-sm ${
                  isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
                }`}
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
            {/* White reveal overlay */}
            {/* {selectedIndex === null && (
              <Motion.div
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-0 left-0 w-full h-full bg-white z-10 origin-top"
              />
            )} */}

            {/* Navigation controls - only show when selected and scaled */}
            <AnimatePresence>
              {isSelected && selectedIndex !== null && (
                <>
                  <Motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    className="close-btn absolute top-0 -right-6 flex items-center text-[0.5rem] text-black hover:text-red-400 transition-all duration-500 ease-in-out -z-1"
                    initial={{ x: -50, }}
                    animate={{ x: 0,  transition: { duration: 0.3, delay: 0.5 } }}
                    exit={{ x: -50,  transition: { duration: 0} }}
                  >
                    [<span style={{ marginRight: "0.2rem" }}>close</span>{" "}
                    <GrClose size={5} />]
                  </Motion.button>

                  {/* <Motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-1/2 top-1/2 transform -translate-x-20 text-white hover:text-blue-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  >
                    <FaChevronLeft size={24} />
                  </Motion.button>

                  <Motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute left-1/2 top-1/2 transform translate-x-4 text-white hover:text-blue-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  >
                    <FaChevronRight size={24} />
                  </Motion.button> */}
                </>
              )}
            </AnimatePresence>
          </Motion.div>
        );
      })}
    </Motion.div>
  );
}
