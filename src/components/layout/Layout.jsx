// src/components/layout/Layout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, BookHeart, Music } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useMusic } from '../../lib/MusicContext';
import MusicPlayer from '../ui/MusicPlayer';
import { useState } from 'react';

export default function Layout() {
  const { logout } = useAuth();
  const music = useMusic();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen romantic-bg flex flex-col">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40">
        <div className="glass border-b border-rose/30 px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookHeart size={22} className="text-petal-500" />
            <span className="font-script text-xl text-wine font-semibold tracking-wide hidden sm:block">
              Our Secret Diary
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Global mini music button */}
            <button
              onClick={() => setShowPlayer((v) => !v)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                ${music.playing
                  ? 'bg-petal-100 text-petal-500 shadow-petal'
                  : 'text-dusty hover:text-petal-500'}`}
            >
              <Music size={18} className={music.playing ? 'animate-pulse-soft' : ''} />
            </button>

            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-full flex items-center justify-center text-dusty hover:text-wine hover:bg-rose/20 transition-all"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>

        {/* Expandable global music player */}
        {showPlayer && music.src && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass border-b border-rose/20 px-4 py-3"
          >
            <MusicPlayer src={music.src} title={music.title} />
          </motion.div>
        )}
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-6 text-center text-xs text-dusty font-sans">
        Made with 💗 just for you
      </footer>
    </div>
  );
}
