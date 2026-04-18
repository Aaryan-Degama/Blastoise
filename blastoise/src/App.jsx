import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import Cursor from "./components/Cursor";
import Dashboard  from "./pages/Dashboard";
import Collection from "./pages/Collection";
import TierList   from "./pages/TierList";
import Search     from "./pages/Search";
import Settings   from "./pages/Settings";
import "./styles/globals.css";

gsap.registerPlugin(ScrollTrigger);

function PageWrapper({ children }) {
  const location = useLocation();
  const wrapRef  = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.killAll();
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [location.pathname]);

  return <div ref={wrapRef}>{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/"           element={<Dashboard />}  />
          <Route path="/collection" element={<Collection />} />
          <Route path="/tierlist"   element={<TierList />}   />
          <Route path="/search"     element={<Search />}     />
          <Route path="/settings"   element={<Settings />}   />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  );
}
