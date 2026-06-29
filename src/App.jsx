// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './lib/AuthContext';

import LoginPage      from './pages/LoginPage';
import HomePage       from './pages/HomePage';
import LetterPage     from './pages/LetterPage';
import AdminPage      from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import NotFoundPage   from './pages/NotFoundPage';
import Layout         from './components/layout/Layout';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <SplashLoader />;
  return user ? children : <Navigate to="/login" replace />;
}

function AdminProtected({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <SplashLoader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function SplashLoader() {
  return (
    <div className="fixed inset-0 romantic-bg flex items-center justify-center">
      <div className="text-5xl animate-heartbeat">💌</div>
    </div>
  );
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected lover routes */}
        <Route path="/" element={
          <Protected><Layout /></Protected>
        }>
          <Route index        element={<HomePage />} />
          <Route path="letter/:id" element={<LetterPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <AdminProtected><AdminPage /></AdminProtected>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}
