import PagesAnimations from "../components/layout/PagesAnimations";
import IndexGallery from "../components/ui/IndexGallery";
import { motion as Motion } from "framer-motion";

const slide = {
    initial: { y: -10 },
    animate: { y: 0, transition: { duration: 0.4, ease: [0.69, -0.3, 0.69, 0.8] } },
    exit: {
      y: 60,
      transition: { duration: 0.3,  ease: [0.69, -0.3, 0.69, 0.8] },
    },
  };

export default function Home() {
  return (
    <PagesAnimations>
        <Motion.div variants={slide} className="h-full w-full flex flex-col items-center">
          <IndexGallery />
        </Motion.div>
    </PagesAnimations>
  )
}
