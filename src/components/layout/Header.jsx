import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import AnimatedLinkText from "../ui/AnimatedLinkText";
import SocialIcons from "../ui/SocialIcons";

gsap.registerPlugin(useGSAP);

export default function Header() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".name", {
        xPercent: -100,
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
          xPercent: -100,
          opacity: 0,
          delay: 0.2,
          duration: 0.6,
          ease: "back.out(1)",
          stagger: {
            amount: 0.2,
            from: "left",
          },
        },
        "<+=0.5"
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="backdrop-blur-[2px] bg-white">
      <header className="flex justify-between px-8 py-8 lg:px-20">
        <div className="name flex-1 text-black font-semibold text-lg lg:text-2xl py-8 tracking-wider uppercase pointer-events-none">
          Darius Žvinklys
        </div>
        <ul className="nav-list flex justify-center flex-1 space-x-6"
            data-cursor-target
        >
          {[
            { label: "Home", to: "/" },
            { label: "Work", to: "/work" },
            { label: "Contact", to: "/contact" },
          ].map(({ label, to }) => (
            <li
              key={label}
              className="nav-item inline-flex items-center justify-center min-w-[80px] uppercase font-semibold text-xs lg:text-sm"
            >
              <Link to={to}>
                <AnimatedLinkText text={label} />
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-end flex-1">
          <SocialIcons /> 
        </div>
      </header>
    </div>
  );
}
