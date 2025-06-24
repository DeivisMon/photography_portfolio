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
      height: bounds.height+8,
      borderRadius: "50%",
      // x: bounds.left,
      // y: bounds.top,
      backgroundColor: "white",
      borderBottom: "4px solid rgb(255, 255, 255)",
      filter: "blur(0)",
      ease: "expo.out",
      duration: 0.3,
    });
  };

  const handleLeave = () => {
    if (hoverTween) hoverTween.kill();

    hoverTween = gsap.to(cursor, {
      width: defaultSize,
      height: defaultSize,
      borderRadius: "999px",
      backgroundColor: "rgb(255, 255, 255)",
      border: "2px solid transparent",
      ease: "expo.out",
      duration: 0.15,
    });
  };

  window.addEventListener("mousemove", move);
  window.addEventListener("mouseout", hide);
  window.addEventListener("mouseover", show);

  const bindNavItems = () => {
    const navItems = document.querySelectorAll(".nav-list");
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

    document.querySelectorAll(".nav-list").forEach((el) => {
      el.removeEventListener("mouseenter", handleHover);
      el.removeEventListener("mouseleave", handleLeave);
    });

    if (hoverTween) hoverTween.kill();
  };
}, []);


  return (
    <div
      ref={cursorRef}
      className="pointer-events-none blur-[2px] shadow-lg fixed top-0 left-0 z-[1000]"
      style={{
        width: defaultSize,
        height: defaultSize,
        borderRadius: "999px",
        backgroundColor: "rgb(255, 255, 255)",
        border: "2px solid transparent",
        mixBlendMode: "difference", 
        willChange: "transform, width, height, border-radius, background-color",
      }}
    />
  );
}
