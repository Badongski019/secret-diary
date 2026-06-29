// src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookHeart, Heart, Sparkles } from 'lucide-react';
import { getLetters } from '../lib/letters';
import EnvelopeCard from '../components/letters/EnvelopeCard';
import MusicPlayer from '../components/ui/MusicPlayer';
import PageTransition from '../components/ui/PageTransition';
import FloatingHearts from '../components/ui/FloatingHearts';

// Skeleton envelope card
function SkeletonCard() {
  return (
    <div>
      <div className="rounded-xl overflow-hidden shimmer" style={{ aspectRatio: '1.45/1' }} />
      <div className="mt-2.5 space-y-1.5 px-1">
        <div className="h-4 rounded shimmer w-3/4" />
        <div className="h-3 rounded shimmer w-1/2" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function HomePage() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLetters()
      .then(setLetters)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <FloatingHearts count={10} interval={3000} />

      <div className="max-w-4xl mx-auto px-4 py-6 pb-16">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-3"
          >
            <BookHeart size={44} className="text-petal-500 mx-auto" />
          </motion.div>
          <h1 className="font-script text-4xl sm:text-5xl text-wine font-bold leading-tight">
            Our Secret Diary
          </h1>
          <p className="font-serif italic text-dusty mt-2 text-sm sm:text-base max-w-xs mx-auto">
            A place where every memory becomes a forever letter.
          </p>
        </motion.div>

        {/* ── Global music player ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 max-w-sm mx-auto"
        >
          <MusicPlayer
            src={import.meta.env.VITE_DEFAULT_MUSIC_URL || ''}
            title={import.meta.env.VITE_DEFAULT_MUSIC_TITLE || 'Our Song'}
          />
        </motion.div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-rose/40" />
          <Heart size={16} className="text-petal-400 fill-petal-200" />
          <span className="font-script text-lg text-wine">Letters</span>
          <Heart size={16} className="text-petal-400 fill-petal-200" />
          <div className="flex-1 h-px bg-rose/40" />
        </div>

        {/* ── Gallery ───────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : letters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles size={40} className="text-petal-300 mx-auto mb-3" />
            <p className="font-script text-2xl text-dusty">No letters yet…</p>
            <p className="font-sans text-sm text-dusty/70 mt-1">
              The first one will appear here 💌
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
          >
            {letters.map((letter) => (
              <motion.div key={letter.id} variants={cardVariants}>
                <EnvelopeCard letter={letter} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
