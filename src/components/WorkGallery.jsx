import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import groupImagesByProject from "../utils/groupImagesByProject";
import imageData from "../data/images.json";
import { motion } from "framer-motion";

const projects = {
  1: "Renginiai",
  2: "Portretai",
  3: "Diskotekos",
  4: "Veiksmas",
  5: "Koncertai",
};

export default function WorkGallery() {
//   const previewImgRef = useRef(null);
  const indicatorRef = useRef(null);
  const projectRefs = useRef([]);
  const nameRefs = useRef([]);
  const imageRefs = useRef([]);
  const lenisRef = useRef(null);

  const [previewSrc, setPreviewSrc] = useState("/images/1.jpg");
  const [currentDigits, setCurrentDigits] = useState(["0", "1"]);

  const [aspectRatio, setAspectRatio] = useState(16 / 9); // default ratio
  const imgRef = useRef(null);

  const handleImageLoad = () => {
    const img = imgRef.current;
    if (img) {
    gsap.fromTo(
      img,
      { opacity: 0.5, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
    );

    setAspectRatio(img.naturalWidth / img.naturalHeight);
  }
};

  // Set max height (e.g. 50vh - 2em) and compute width based on aspect ratio
  // clamp width max to 40vw
  const maxHeight = window.innerHeight * 0.8 - 75; // approx 50vh - 2em (32px)
  const computedWidth = Math.min(
    maxHeight * aspectRatio,
    window.innerWidth * 0.4
  );

  //   const imagesPerProject = 4;
  const groupedImages = groupImagesByProject(imageData, projects);
  const projectNames = Object.values(projects);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 750));
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(".progress_bar", {
          scaleY: self.progress,
          ease: "power2.out",
        });
      },
    });

    imageRefs.current.flat().forEach((img) => {
      ScrollTrigger.create({
        trigger: img,
        start: "top 10px",
        end: "top 250px",
        onEnter: () => setPreviewSrc(img.src),
        onEnterBack: () => setPreviewSrc(img.src),
      });
    });

    const step = 60;
    projectRefs.current.forEach((projectEl, i) => {
      ScrollTrigger.create({
        trigger: projectEl,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
          const digits = String(i + 1)
            .padStart(2, "0")
            .split("");
          setCurrentDigits(digits);

          const [firstEl, secondEl] = [
            document.querySelector(".first_digit"),
            document.querySelector(".second_digit"),
          ];
          gsap.fromTo(
            firstEl,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 }
          );
          gsap.fromTo(
            secondEl,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, delay: 0.05 }
          );

          gsap.to(indicatorRef.current, {
            top: `${i * step}px`,
            duration: 0.3,
          });

          nameRefs.current.forEach((ref, j) =>
            ref.classList.toggle("text-white", j === i)
          );
          nameRefs.current.forEach((ref, j) =>
            ref.classList.toggle("text-neutral-600", j !== i)
          );
        },
        onLeaveBack: () => {
          const prevIndex = Math.max(i - 1, 0);
          const digits = String(prevIndex + 1)
            .padStart(2, "0")
            .split("");
          setCurrentDigits(digits);

          const [firstEl, secondEl] = [
            document.querySelector(".first_digit"),
            document.querySelector(".second_digit"),
          ];
          gsap.fromTo(
            firstEl,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3 }
          );
          gsap.fromTo(
            secondEl,
            { y: -40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, delay: 0.05 }
          );

          gsap.to(indicatorRef.current, {
            top: `${(i - 1) * step}px`,
            duration: 0.2,
          });

          nameRefs.current.forEach((ref, j) =>
            ref.classList.toggle("text-white", j === i - 1)
          );
          nameRefs.current.forEach((ref, j) =>
            ref.classList.toggle("text-neutral-600", j !== i - 1)
          );
        },
      });
    });
  }, []);

  return (
    <>
      {/* Digits on left center */}
      <div className="fixed left-12 top-40  -translate-y-1/2 z-10 pointer-events-none">
        <h2 className="text-5xl font-semibold tracking-wider">
          <div className="flex gap-1">
            <span className="first_digit">{currentDigits[0]}</span>
            <span className="second_digit">{currentDigits[1]}_</span>
          </div>
        </h2>
      </div>
      <div className="text-black">555</div>
      {/* Projects */}
      <div className="grid grid-cols-[200px_minmax(900px,_1fr)_100px] gap-4">
        <div className="flex flex-col items-center gap-[20em]"
            style={{ marginTop: "100px" }}
        >
          {projectNames.map((projectName, i) => (
            <div
              className="flex"
              key={projectName}
              ref={(el) => (projectRefs.current[i] = el)}
            >
              <div className="flex flex-col gap-4 min-h-screen">
                {groupedImages[projectName]?.map((img, j) => (
                  <div
                    className="flex-1 max-w-[300px] min-w-[300px] shadow-md min-h-[300px] shadow-black cursor-pointer hover:scale-103 transition-all duration-300 ease-[cubic-bezier(0.37, 0, 0.63, 1] hover:shadow-xl"
                    key={j}
                  >
                    <img
                      src={img.src}
                      alt={img.name}
                      onClick={() => setPreviewSrc(img.src)}
                      className="w-full h-full object-cover opacity-90"
                      ref={(el) => {
                        if (!imageRefs.current[i]) imageRefs.current[i] = [];
                        imageRefs.current[i][j] = el;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Project names + indicator bar */}
        <div className="fixed top-1/2 left-[40%] w-[320px] cursor-pointer">
          <div
            className="absolute top-0 left-[-12px] w-[320px] h-[60px] flex justify-center items-center z-[-1]"
            ref={indicatorRef}
          >
            <div className="w-full h-[60px] bg-black" />
          </div>
          {projectNames.map((name, i) => (
            <div
              className={`h-[60px] flex items-center ${
                i === 0 ? "text-white" : "text-neutral-600"
              }`}
              key={i}
              ref={(el) => (nameRefs.current[i] = el)}
              onClick={() => {
                const target = projectRefs.current[i];
                if (target && lenisRef.current) {
                  lenisRef.current.scrollTo(target, {
                    offset: -100,
                    duration: 1,
                    easing: (t) => t * (2 - t),
                  });
                }
              }}
            >
              <p className="text-4xl font-medium tracking-wider uppercase">
                0{i + 1}_{name}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          className="fixed bottom-16 right-8 flex justify-center items-center opacity-95 "
          style={{
            width: computedWidth,
            height: maxHeight,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6}}
        >
          <img
            ref={imgRef}
            src={previewSrc}
            alt="Preview"
            className="max-w-full max-h-full object-contain shadow-md shadow-black"
            onLoad={handleImageLoad}
          />
        </motion.div>
      </div>
      <div className="bg-gray-800 absolute bottom-0 z-[100] w-full h-[350px]">ass</div>  
    </>
  );
}
