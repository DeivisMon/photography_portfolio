import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation,} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loader from "./components/layout/Loader";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import BlurryCursor from "./components/ui/BlurryCursor";

function AnimatedPages() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  return (
    <>
      {!isLoaded && (
        <AnimatePresence>
          <Loader onComplete={() => setIsLoaded(true)} />
        </AnimatePresence>
      )}
      {isLoaded && (
        <>
          <Header />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedPages />
      <BlurryCursor />
    </Router>
  );
}