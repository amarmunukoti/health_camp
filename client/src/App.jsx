import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import HealthCamps from './pages/HealthCamps';
import CampDetails from './pages/CampDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import UserRegister from './pages/UserRegister';
import Entry from './pages/Entry';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from './context/UserAuthContext';
import { useAuth } from './context/AuthContext';

function App() {
  const location = useLocation();
  const { isLoggedIn: isUserLoggedIn } = useUserAuth();
  const { isLoggedIn: isAdminLoggedIn } = useAuth();

  const authPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login';
  const entryPage = location.pathname === '/';
  const hideSiteChrome = entryPage || authPage;

  const UserRoute = ({ children }) =>
    isUserLoggedIn ? children : <Navigate to="/" replace />;

  const AdminRoute = ({ children }) =>
    isAdminLoggedIn ? children : <Navigate to="/" replace />;

  return (
    <>
      {!hideSiteChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Entry />} />

        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/home" element={<UserRoute><Home /></UserRoute>} />
        <Route path="/camps" element={<UserRoute><HealthCamps /></UserRoute>} />
        <Route path="/camps/:id" element={<UserRoute><CampDetails /></UserRoute>} />
        <Route path="/about" element={<UserRoute><About /></UserRoute>} />
        <Route path="/contact" element={<UserRoute><Contact /></UserRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideSiteChrome && <Footer />}
    </>
  );
}
export default App;
