import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Link, useLocation } from "react-router-dom";
import AnimatedLinkText from "../ui/AnimatedLinkText";
import SocialIcons from "../ui/SocialIcons";

gsap.registerPlugin(useGSAP);

export default function Header() {
  const containerRef = useRef(null);
  const underlineRef = useRef(null);
  const navItemRefs = useRef({});
  const [activeTab, setActiveTab] = useState("/");
  // const [hoveredTab, setHoveredTab] = useState(null);
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Work", to: "/work" },
    { label: "Contact", to: "/contact" },
  ];

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".name", {
        yPercent: -200,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1)",
      });

      tl.from(
        ".nav-list",
        {
          yPercent: 100,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1)",
        },
        "<"
      );

      tl.from(
        ".nav-item",
        {
          yPercent: -100,
          opacity: 0,
          delay: 0.2,
          duration: 0.6,
          ease: "back.out(1)",
          stagger: {
            amount: 0.3,
            from: "left",
          },
        },
        "<+=0.4"
      );

      tl.from(
        ".photography",
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1)",
        },
        "<+=0.2"
      );
    },
    { scope: containerRef }
  );

  // Update on route change
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const moveUnderlineTo = (tabPath) => {
    const targetEl = navItemRefs.current[tabPath];
    if (targetEl && underlineRef.current) {
      const { offsetLeft, offsetWidth } = targetEl;
      gsap.to(underlineRef.current, {
        left: offsetLeft + 5,
        width: offsetWidth - 10,
        duration: 0.2,
        ease: "expo.out",
      });
    }
  };

  useEffect(() => {
    moveUnderlineTo(activeTab);
  }, [activeTab]);

  // useEffect(() => {
  //   if (hoveredTab) {
  //     moveUnderlineTo(hoveredTab);
  //   }
  // }, [hoveredTab]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full backdrop-blur-[2px] bg-white z-50"
    >
      <header className="flex justify-between px-8 py-8 lg:px-20 relative">
        <div className="name flex-2 font-semibold py-8 tracking-wider uppercase pointer-events-none">
          <span className="text-lg lg:text-2xl font-medium">
            Darius Žvinklys
          </span>{" "}
          <span className="text-lg lg:text-2xl font-medium">|</span>{" "}
          <div className="photography inline-block text-gray-800 text-2xl font-light">
            Photography
          </div>
        </div>

        <ul
          className="nav-list flex justify-center flex-1 space-x-6 relative"
          data-cursor-target
          onMouseLeave={() => moveUnderlineTo(activeTab)}
        >
          {/* Animated Underline */}
          <div
            ref={underlineRef}
            className="absolute bottom-0 h-[2px] bg-black transition-all"
            style={{ left: 0, width: 0 }}
          />

          {navItems.map(({ label, to }) => (
            <li
              key={label}
              ref={(el) => (navItemRefs.current[to] = el)}
              className={`nav-item inline-flex items-center justify-center min-w-[80px] uppercase font-semibold text-xs lg:text-sm relative pb-1 cursor-pointer`}
            >
              <Link to={to}>
                <AnimatedLinkText text={label} />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-end flex-2">
          <SocialIcons />
        </div>
      </header>
    </div>
  );
}
