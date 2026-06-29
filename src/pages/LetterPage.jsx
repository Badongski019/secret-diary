// src/pages/LetterPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { getLetter } from '../lib/letters';
import MusicPlayer from '../components/ui/MusicPlayer';
import LikeButton from '../components/letters/LikeButton';
import PageTransition from '../components/ui/PageTransition';
import FloatingHearts from '../components/ui/FloatingHearts';

export default function LetterPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [letter, setLetter]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [imgOpen, setImgOpen] = useState(false);

  useEffect(() => {
    getLetter(id)
      .then(setLetter)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
        <div className="h-8 w-40 rounded-lg shimmer" />
        <div className="h-64 rounded-2xl shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
        <div className="h-4 w-1/2 rounded shimmer" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="font-script text-2xl text-petal-500">Letter not found 💔</p>
        <Link to="/" className="text-sm font-sans text-dusty underline">Go back home</Link>
      </div>
    );
  }

  const dateStr = letter.date
    ? format(new Date(letter.date), 'MMMM d, yyyy')
    : '';

  return (
    <PageTransition>
      <FloatingHearts count={6} interval={4000} />

      {/* Lightbox */}
      <AnimatePresence>
        {imgOpen && letter.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImgOpen(false)}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={letter.image}
              alt="Letter photo"
              className="max-w-full max-h-full rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-dusty hover:text-wine transition-colors font-sans text-sm mb-6"
        >
          <ArrowLeft size={16} /> Back to letters
        </button>

        {/* ── Unfolding paper ─────────────────────────────────────────── */}
        <motion.article
          initial={{ opacity: 0, scaleY: 0.6, y: 30 }}
          animate={{ opacity: 1, scaleY: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }}
          className="paper-texture rounded-3xl shadow-letter border border-rose/20 overflow-hidden"
          style={{ transformOrigin: 'top center' }}
        >
          {/* Header band */}
          <div className="bg-gradient-to-r from-petal-200/60 to-rose/40 px-6 py-5 border-b border-rose/20">
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-script text-2xl sm:text-3xl text-wine font-bold leading-tight">
                {letter.title}
              </h1>
              <div className="flex items-center gap-1.5 text-xs font-sans text-dusty shrink-0 mt-1">
                <Calendar size={13} />
                {dateStr}
              </div>
            </div>
          </div>

          {/* Image */}
          {letter.image && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative cursor-zoom-in"
              onClick={() => setImgOpen(true)}
            >
              <img
                src={letter.image}
                alt="Letter photo"
                className="w-full object-cover max-h-72 sm:max-h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              <div className="absolute bottom-2 right-2 bg-black/30 rounded-full p-1.5">
                <ImageIcon size={14} className="text-white" />
              </div>
            </motion.div>
          )}

          {/* Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="px-6 py-6 letter-lines"
          >
            <div
              className="font-sans text-[15px] leading-[28px] text-[#4a2c3a] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: letter.content }}
            />
          </motion.div>

          {/* Music player */}
          {letter.music && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="px-6 pb-6"
            >
              <MusicPlayer src={letter.music} title={letter.musicTitle || 'Our Song'} />
            </motion.div>
          )}

          {/* Footer */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <LikeButton />
            <p className="font-script text-lg text-petal-400">with love 💗</p>
          </div>
        </motion.article>
      </div>
    </PageTransition>
  );
}
