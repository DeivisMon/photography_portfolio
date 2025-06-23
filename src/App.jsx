import "./App.css";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Loader from "./components/Loader1";
// import Test from './components/Test'
// import Test1 from './components/Test1'
// import Links from './components/Test2'

function AnimatedPages() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <>
        <Header />
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        </>
      )}
    </AnimatePresence>
  );
}
export default function App() {
  return (
    <>
      <Router>
        <AnimatedPages />
      </Router>
    </>
  );
}
