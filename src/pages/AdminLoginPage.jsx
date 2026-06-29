// src/pages/AdminLoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function AdminLoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { adminLogin, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) navigate('/admin', { replace: true });
  }, [user, isAdmin, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="glass rounded-3xl p-8 shadow-envelope border border-rose/30">
          <div className="flex flex-col items-center mb-7">
            <ShieldCheck size={40} className="text-petal-500 mb-3" />
            <h1 className="font-serif text-2xl text-wine font-bold">Admin Access</h1>
            <p className="font-sans text-xs text-dusty mt-1">Secret diary control panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin email"
              className="w-full px-4 py-3 rounded-xl border border-rose/40 bg-white/60 font-sans text-wine placeholder:text-dusty/50 focus:ring-2 focus:ring-petal-300 transition-all"
              required
            />
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-rose/40 bg-white/60 font-sans text-wine placeholder:text-dusty/50 focus:ring-2 focus:ring-petal-300 transition-all"
                required
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dusty">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-sm text-petal-600 font-sans text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-sans font-semibold text-white
                bg-gradient-to-r from-petal-400 to-petal-600 shadow-petal
                disabled:opacity-50 transition-all hover:shadow-envelope"
            >
              {loading ? 'Authenticating…' : 'Enter Panel'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
