import { useEffect, useRef } from 'react';

const Loader = () => {
  const headerImgRef = useRef(null);
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Load GSAP
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.0/gsap.min.js';
    script.onload = () => {
      const { gsap } = window;
      
      // Create timeline
      let t1 = gsap.timeline();

      t1.from(".imsrk", {
        opacity: 0,
        xPercent: -100,
        delay: 0.5,
        duration: 1,
        ease: "power1.out",
        yoyo: true,
      });
      
      t1.from(
        ".dot",
        {
          opacity: 0,
          yPercent: 100,
          delay: 0.5,
          repeatDelay: 1,
          duration: 1,
          ease: "power1.out",
        },
        0.01
      );

      t1.to(".dot", {
        x: 20,
        duration: 1,
        ease: "power1.out",
      });

      t1.to(".dot", {
        x: -10,
        duration: 0.5,
        ease: "power1.out",
      });

      t1.to(".imsrk", {
        opacity: 0,
        xPercent: -100,
        duration: 1,
        ease: "power1.out",
        yoyo: true,
      });

      t1.to(
        ".dot",
        {
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        },
        3
      );

      t1.to(
        ".cover",
        {
          xPercent: -100,
          duration: 1,
          ease: "power1.out",
        },
        3
      );

      t1.to(
        ".cover-2",
        {
          xPercent: -100,
          duration: 1,
          ease: "power1.out",
        },
        3.2
      );

      t1.to(
        ".cover-3",
        {
          xPercent: -100,
          duration: 1,
          ease: "power1.out",
        },
        3.4
      );

      t1.to(
        ".cover-4",
        {
          xPercent: -100,
          duration: 1,
          ease: "power1.out",
        },
        3.6
      );

      t1.from(
        ".imsrk2",
        {
          xPercent: -100,
          duration: 1,
          ease: "power1.out",
          opacity: 0,
        },
        3.8
      );

      t1.from(".cover-5", {
        yPercent: -100,
        duration: 1,
        ease: "power1.out",
        delay: 0.4,
      });

      t1.from(".logo", {
        xPercent: -100,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
      });

      t1.from(
        ".item",
        {
          xPercent: 100,
          opacity: 0,
          duration: 1,
          ease: "power1.out",
          stagger: {
            amount: 0.5,
            from: "left",
          },
        },
        6
      );

      t1.from(
        ".header-img",
        {
          xPercent: -100,
          opacity: 0,
          duration: 1,
          ease: "power1.out",
        },
        6.2
      );

      t1.from(
        ".heading",
        {
          xPercent: 100,
          opacity: 0,
          duration: 1,
          ease: "power1.out",
        },
        6.2
      );

      t1.from(
        ".sub-heading",
        {
          xPercent: 100,
          opacity: 0,
          duration: 1.1,
          ease: "power1.out",
        },
        6.2
      );

      t1.from(
        ".button",
        {
          yPercent: 100,
          opacity: 0,
          duration: 2,
          ease: "bounce",
        },
        6.5
      );

      // Mouse move effect
      const handleMouseMove = (e) => {
        const img = headerImgRef.current;
        if (!img) return;
        
        const xPos = e.clientX / img.clientWidth - 0.5;
        const yPos = e.clientY / img.clientHeight - 0.5;

        gsap.to(".header-img", 1, {
          rotationY: xPos * 20,
          rotationX: yPos * 20,
          ease: "power1.out",
        });

        gsap.to(".heading", 1, {
          rotationY: xPos * 20,
          rotationX: yPos * 20,
          ease: "power1.out",
        });

        gsap.to(".sub-heading", 1, {
          rotationY: xPos * 20,
          rotationX: yPos * 20,
          ease: "power1.out",
        });

        gsap.to(".button", 1, {
          rotationY: xPos * 20,
          rotationX: yPos * 20,
          ease: "power1.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden font-sans leading-relaxed">
      {/* Cover layers */}
      <div className="cover-5 absolute w-full h-screen bg-gradient-to-b from-gray-800 to-black overflow-hidden">
        {/* Header */}
        <header className="flex items-center px-4 py-5 lg:px-20 lg:py-12">
          <img 
            className="logo h-4" 
            src="https://i.imgur.com/ZFnSyPe.png" 
            alt="Logo" 
          />
          <ul className="ml-auto">
            <li className="item inline-block ml-2 lg:ml-12 text-white uppercase font-semibold text-xs lg:text-sm tracking-wider">
              Actor
            </li>
            <li className="item inline-block ml-2 lg:ml-12 text-white uppercase font-semibold text-xs lg:text-sm tracking-wider">
              Producer
            </li>
            <li className="item inline-block ml-2 lg:ml-12 text-white uppercase font-semibold text-xs lg:text-sm tracking-wider">
              Contact
            </li>
          </ul>
        </header>

        {/* Main Content */}
        <div className="container mt-5 lg:mt-24 grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="left">
            <img 
              ref={headerImgRef}
              className="header-img w-full lg:w-auto lg:h-96 xl:h-[600px] rounded-md" 
              src="https://i.imgur.com/9huul5F.png" 
              alt="Portrait" 
            />
          </div>

          <div className="right px-2 lg:px-0 -mt-24 lg:-mt-20">
            <h1 
              ref={headingRef}
              className="heading text-white text-6xl lg:text-8xl font-black inline-block font-serif leading-none"
            >
              <span className="text-4xl lg:text-5xl -tracking-wide text-gray-700">The King </span>
              <br />
              KHAN
            </h1>
            <p 
              ref={subHeadingRef}
              className="sub-heading mt-10 max-w-xl text-white opacity-50 text-lg leading-relaxed"
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
              unde dicta, repellendus consequuntur, at.
            </p>
            <a 
              ref={buttonRef}
              className="button inline-block mt-10 text-white opacity-50 border border-gray-500 px-3 py-1 rounded-md no-underline" 
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="cover-4 absolute w-full h-screen bg-gray-900"></div>
      <div className="cover-3 absolute w-full h-screen bg-gray-850"></div>
      <div className="cover-2 absolute w-full h-screen bg-gray-900"></div>
      
      <div className="cover absolute w-full h-screen bg-black">
        <div className="cover-heading absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="imsrk text-white text-4xl lg:text-5xl font-black inline-block">
            Darius Zvinklys
          </h1>
          <span className="dot text-white text-4xl lg:text-5xl font-black inline-block">
            |
          </span>
        </div>
      </div>

      <div className="imsrk2 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 text-5xl lg:text-8xl font-black -z-10 -tracking-wide leading-none">
        Photography
      </div>
    </div>
  );
};

export default Loader;