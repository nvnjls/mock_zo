import { useState, useEffect, useRef, useCallback } from 'react';
import Content from './StaticComponents/Content';
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom';
import StudentDashboard from './DynamicPages/StudentDashboard';
import Onboarding from './DynamicPages/Onboarding';
import AdminPanel from './Admin/AdminPanel';
import AdminRoute from './Admin/AdminRoute';
import AdminLogin from './Admin/AdminLogin';

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
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Content />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        {/* Optional direct login page */}
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* Default: send unknown routes to /NotFound for now */}
        <Route path="*" element={<Navigate to="/NotFound" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
