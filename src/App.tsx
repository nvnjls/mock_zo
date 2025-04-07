import { useState, useEffect, useRef, useCallback } from 'react';
import Content from './components/Content';
import LandingPage from './components/LandingPage';
import Navbar from './components/Nav';
import HowItWorks from './components/HowItWorks';


const App = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to section function
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element && scrollContainerRef.current) {
      // Scroll the container, not the window
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Get scroll position as a percentage (0-1)
      const scrollRatio = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);

      // Tweak this value to adjust when navbar appears (0.1 = 10% scrolled)
      const THRESHOLD = 0.105;
      setShowNavbar(scrollRatio > THRESHOLD);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      <Navbar />
      <Content />
    </div>
  );
};

export default App;