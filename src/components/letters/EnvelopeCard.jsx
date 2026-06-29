// src/components/letters/EnvelopeCard.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Heart } from 'lucide-react';

export default function EnvelopeCard({ letter }) {
  const [opening, setOpening] = useState(false);
  const navigate = useNavigate();

  const dateStr = letter.date
    ? format(new Date(letter.date), 'MMM d, yyyy')
    : '';

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    setTimeout(() => navigate(`/letter/${letter.id}`), 850);
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="cursor-pointer"
      onClick={handleOpen}
    >
      <div className={`relative select-none ${opening ? 'envelope-open' : ''}`}
           style={{ width: '100%', maxWidth: 220, margin: '0 auto' }}>

        {/* Envelope body */}
        <div className="rounded-xl overflow-hidden shadow-envelope"
             style={{ aspectRatio: '1.45/1', position: 'relative' }}>

          {/* Body fill */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream-100 to-cream-200 paper-texture" />

          {/* Bottom triangle fold lines */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(242,196,208,0.35) 50%),
                         linear-gradient(225deg, transparent 50%, rgba(242,196,208,0.35) 50%)`,
          }} />

          {/* Left/right triangle */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full" style={{
              background: 'linear-gradient(to bottom right, rgba(245,225,232,0.4) 50%, transparent 50%)',
            }} />
            <div className="w-1/2 h-full" style={{
              background: 'linear-gradient(to bottom left, rgba(245,225,232,0.4) 50%, transparent 50%)',
            }} />
          </div>

          {/* Flap */}
          <motion.div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '52%',
              background: 'linear-gradient(to bottom, #f9e4ec, #f2c4d0)',
              clipPath: 'polygon(0 0, 100% 0, 50% 78%)',
              transformOrigin: 'top center',
              zIndex: 3,
            }}
            animate={opening
              ? { rotateX: -180, opacity: [1, 1, 0] }
              : { rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Seal */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ top: '38%' }}
            animate={opening ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <div className="w-8 h-8 rounded-full bg-petal-400 flex items-center justify-center shadow-petal">
              <Heart size={14} className="text-white fill-white" />
            </div>
          </motion.div>

          {/* Content peek when open */}
          <AnimatePresence>
            {opening && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute inset-x-3 bottom-2 top-[30%] bg-ivory rounded-t-lg border border-rose/30 flex items-center justify-center z-20"
              >
                <span className="font-script text-petal-400 text-xs">opening…</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card footer */}
        <div className="mt-2.5 px-1">
          <p className="font-serif text-sm font-semibold text-wine truncate leading-tight">
            {letter.title}
          </p>
          <p className="font-sans text-xs text-dusty mt-0.5">{dateStr}</p>
        </div>
      </div>
    </motion.div>
  );
}
