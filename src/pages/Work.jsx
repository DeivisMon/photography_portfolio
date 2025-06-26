import PagesAnimations from "../components/layout/PagesAnimations";
import WorkGallery from "../components/WorkGallery";
import { motion as Motion } from "framer-motion";

export default function Work() {
  return (
    <PagesAnimations>
      <Motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
        exit={{ opacity: 1, y: -50, transition: { duration: 0.8 } }}
      >
        <WorkGallery />
      </Motion.div>
    </PagesAnimations>
  );
}
