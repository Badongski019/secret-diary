// src/components/letters/LikeButton.jsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

let _hid = 0;

export default function LikeButton() {
  const [liked,  setLiked]  = useState(false);
  const [count,  setCount]  = useState(0);
  const [hearts, setHearts] = useState([]);
  const ref = useRef(null);

  function handleLike() {
    setLiked(true);
    setCount((c) => c + 1);

    // Spawn a burst of floating hearts
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id:  ++_hid,
      x:   (Math.random() - 0.5) * 80,
      rot: (Math.random() - 0.5) * 30,
    }));
    setHearts((h) => [...h, ...burst]);
    setTimeout(() => setHearts((h) => h.filter((x) => !burst.find((b) => b.id === x.id))), 1600);
  }

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: 0, x: h.x, opacity: 1, scale: 0.8, rotate: h.rot }}
            animate={{ y: -90, opacity: 0, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute pointer-events-none text-petal-400 text-lg"
            style={{ bottom: '100%' }}
          >
            💗
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleLike}
        whileTap={{ scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm font-medium transition-colors
          ${liked
            ? 'bg-petal-100 text-petal-600 border border-petal-200'
            : 'glass border border-rose/40 text-dusty hover:border-petal-300 hover:text-petal-500'}`}
      >
        <motion.div
          animate={liked ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Heart
            size={18}
            className={liked ? 'fill-petal-500 text-petal-500' : ''}
          />
        </motion.div>
        {liked ? `${count} loves` : 'Send love'}
      </motion.button>
    </div>
  );
}
