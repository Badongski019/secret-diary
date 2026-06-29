// src/pages/LoginPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Heart, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import FloatingHearts from "../components/ui/FloatingHearts";

function GradientOrbs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle,#ffc2d1 0%,transparent 70%)",
        }}
      />

      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle,#ffd6a5 0%,transparent 70%)",
        }}
      />

      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity }}
        className="absolute top-1/3 -right-16 w-56 h-56 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle,#ffb3c6 0%,transparent 70%)",
        }}
      />
    </div>
  );
}

export default function LoginPage() {

  const navigate = useNavigate();

  const { loverLogin, user } = useAuth();

  const [callsign, setCallsign] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const pressTimer = useRef(null);
  function startAdminPress() {
    pressTimer.current = setTimeout(() => {
      navigate("/admin/login");
    }, 3000);
  }
  function stopAdminPress() {
    clearTimeout(pressTimer.current);
  }

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user]);

  function startAdminPress() {
    pressTimer.current = setTimeout(() => {
      navigate("/admin/login");
    }, 3000);
  }

  function stopAdminPress() {
    clearTimeout(pressTimer.current);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!callsign.trim()) return;

    setLoading(true);
    setError("");

    try {
      await loverLogin(callsign);

      navigate("/", { replace: true });

    } catch (err) {

      setError(err.message);

      setShaking(true);

      setTimeout(() => {
        setShaking(false);
      }, 500);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4 relative overflow-hidden">
      <GradientOrbs />
      <FloatingHearts count={18} interval={1500} />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Card */}
        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass rounded-3xl p-8 shadow-envelope border border-rose/30"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-4"
            >
              💌
            </motion.div>
            <h1 className="font-script text-3xl text-wine font-bold">Our Secret Diary</h1>
            <p className="font-sans text-sm text-dusty mt-1 text-center italic">
              a place where every memory becomes a forever letter
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-serif text-sm font-medium text-wine mb-2">
                What is our callsign? 🌸
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={callsign}
                  onChange={(e) => { setCallsign(e.target.value); setError(''); }}
                  placeholder="whisper it here…"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-rose/40 bg-white/60 font-sans text-wine placeholder:text-dusty/50 focus:ring-2 focus:ring-petal-300 focus:border-petal-300 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dusty hover:text-wine transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-petal-600 font-sans text-center py-1"
                >
                  {error} 💔
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || !callsign.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-sans font-semibold text-white
                         bg-gradient-to-r from-petal-400 to-petal-600
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-petal hover:shadow-envelope transition-all
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Heart size={18} className="fill-white" />
                </motion.div>
              ) : (
                <>
                  <Lock size={16} />
                  Enter our diary
                </>
              )}
            </motion.button>
          </form>

          {/* Decoration */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-center text-xs text-dusty/60 font-sans">
              ✨ only you can open this ✨
            </p>

            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart
                size={15}
                className="text-rose-300 hover:text-rose-500 cursor-pointer transition-all"

                onMouseDown={startAdminPress}
                onMouseUp={stopAdminPress}
                onMouseLeave={stopAdminPress}

                onTouchStart={startAdminPress}
                onTouchEnd={stopAdminPress}
              />
            </motion.div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
