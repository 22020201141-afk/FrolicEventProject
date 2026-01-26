import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Home from './pages/Home';
import MyEvents from './pages/MyEvents';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Institutes from './pages/Institutes';
import Results from './pages/Results';
import About from './pages/About';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventManagement from './pages/admin/EventManagement';
import UserManagement from './pages/admin/UserManagement';
import CoordinatorManagement from './pages/admin/CoordinatorManagement';
import ResultManagement from './pages/admin/ResultManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import InstituteManagement from './pages/admin/InstituteManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import ModernDashboard from './pages/admin/ModernDashboard';
import { isAuthenticated, logout as authLogout, getUser } from './utils/auth';
import { ToastProvider } from './components/admin/ToastContainer';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth on app load: if token exists but user not in storage, fetch profile
  useEffect(() => {
    // Mark auth initialization as in-progress so pages can show a loading state if needed
    window.__authInitialized = false;

    console.log('Auth init - token:', localStorage.getItem('token'));
    console.log('Auth init - user (local):', getUser());

    const initAuth = async () => {
      try {
        if (isAuthenticated() && !getUser()) {
          console.log('Token exists but no user in localStorage - fetching profile');
          const res = await (await import('./utils/api')).authAPI.getProfile();
          const user = res.data;
          if (user) {
            (await import('./utils/auth')).setUser(user);
            console.log('Fetched profile successfully:', user);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile during auth init', err);
        // If token invalid, clear it
        (await import('./utils/auth')).setAuthToken(null);
      } finally {
        // Initialization finished (either profile fetched or token absent/invalid)
        window.__authInitialized = true;
      }
    };

    // If there's no token at all, mark initialization as finished immediately
    if (!isAuthenticated()) {
      window.__authInitialized = true;
    }

    initAuth();
  }, []);

  const handleLoginSuccess = () => {
    if (getUser()?.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleRegisterSuccess = () => {
    navigate('/');
  };

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <ToastProvider>
      {!isAuthPage && !isAdminPage && <NavBar onNavigate={navigate} />}
      <Routes>
        <Route path="/" element={<Home onNavigate={navigate} />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/institutes" element={<Institutes />} />
        <Route path="/results" element={<Results />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onNavigateToRegister={() => navigate('/register')} onNavigateToForgotPassword={() => navigate('/forgot-password')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onNavigateToLogin={() => navigate('/login')} onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword onNavigateToLogin={() => navigate('/login')} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile onNavigate={navigate} onLogout={handleLogout} />} />
        </Route>

        {/* Public Routes */}
        <Route path="/my-events" element={<MyEvents />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="" element={<AdminLayout />}>
            <Route path="dashboard" element={<ModernDashboard />} />
            <Route path="institutes" element={<InstituteManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="coordinators" element={<CoordinatorManagement />} />
            <Route path="results" element={<ResultManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
          </Route>
        </Route>

      </Routes>
      {!isAuthPage && !isAdminPage && <Footer onNavigate={navigate} />}
    </ToastProvider>
  );
}

export default App;