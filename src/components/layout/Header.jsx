import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import AnimatedLinkText from "../AnimatedLinkText";

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
        ".nav-item",
        {
          xPercent: 100,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1)",
          stagger: {
            amount: 0.2,
            from: "left",
          },
        },
        "<"
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <header className="flex justify-between px-8 py-8 lg:px-20">
        <div className="name text-black font-semibold text-lg lg:text-2xl py-8 tracking-wider uppercase">
          Darius Žvinklys
        </div>
        <ul className="flex space-x-6">
          {[
            { label: "Home", to: "/" },
            { label: "Work", to: "/work" },
            { label: "Contact", to: "/contact" },
          ].map(({ label, to }) => (
            <li key={label} className="nav-item min-w-[80px] uppercase font-semibold text-xs lg:text-sm">
              <Link to={to}>
                <AnimatedLinkText text={label} />
              </Link>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}
