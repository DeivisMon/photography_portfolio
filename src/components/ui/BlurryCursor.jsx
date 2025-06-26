import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function BlurryCursor() {
  const cursorRef = useRef(null);
  const defaultSize = 12;

  useEffect(() => {
  const cursor = cursorRef.current;

  const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "sine.out" });
  const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "sine.out" });

  const move = (e) => {
    xTo(e.clientX - cursor.offsetWidth / 2);
    yTo(e.clientY - cursor.offsetHeight / 2);
  };

  const hide = () => gsap.to(cursor, { opacity: 0 });
  const show = () => gsap.to(cursor, { opacity: 0.8 });

  let hoverTween = null;

  const handleHover = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();

    console.log('bounds', bounds.height, bounds.width);
    

    if (hoverTween) hoverTween.kill();

    hoverTween = gsap.to(cursor, {
      width: 40,
      height: 40,
      borderRadius: "50%",
      // x: bounds.left,
      // y: bounds.top,
      // backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "2px solid rgb(255, 255, 255)",
      backdropFilter: "blur(1px)",  
      filter: "blur(0)",
      ease: "bounce.in",
      duration: 0.3,
    });
  };

  const handleLeave = () => {
    if (hoverTween) hoverTween.kill();

    hoverTween = gsap.to(cursor, {
      width: defaultSize,
      height: defaultSize,
      // backgroundColor: "transparent",
      borderRadius: "50%",
      filter: "blur(1px)",
      backdropFilter: "blur(0)",
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      border: "1px solid rgb(255, 255, 255)",
      ease: "bounce.in",
      duration: 0.15,
    });
  };

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseout", hide);
  window.addEventListener("mouseover", show);

  const bindNavItems = () => {
    const navItems = document.querySelectorAll(".nav-list, .social-icons");
    if (navItems.length === 0) {
      requestAnimationFrame(bindNavItems);
      return;
    }

    navItems.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });
  };

  bindNavItems();

  return () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseout", hide);
    window.removeEventListener("mouseover", show);

    document.querySelectorAll(".nav-list, .social-icons").forEach((el) => {
      el.removeEventListener("mouseenter", handleHover);
      el.removeEventListener("mouseleave", handleLeave);
    });

    if (hoverTween) hoverTween.kill();
  };
}, []);


  return (
    <div
      ref={cursorRef}
      className="pointer-events-none blur-[1px] shadow-2xl fixed top-0 left-0 z-[1000]"
      style={{
        width: defaultSize,
        height: defaultSize,
        borderRadius: "999px",
        backgroundColor: "rgba(255, 255, 255, 0)",
        border: "2px solid white",
        mixBlendMode: "difference", 
        willChange: "transform, width, height, border-radius, background-color",
      }}
    />
  );
}
