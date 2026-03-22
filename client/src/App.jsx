import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CarProvider } from './context/CarContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import CarDetail from './pages/CarDetail';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import './index.css';

// Fix for hash navigation (#about, #contact) across pages
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      // Small delay to ensure the page has rendered if coming from another route
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <CarProvider>
      <Router>
        <ScrollToHash />
        <Routes>
          {/* Admin login — public */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin dashboard — protected by PrivateRoute */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          {/* Public site — all pages share the Navbar and Footer */}
          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cars" element={<Browse />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/confirmation" element={<Confirmation />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </CarProvider>
  );
}

export default App;
