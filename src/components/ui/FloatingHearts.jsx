// src/components/ui/FloatingHearts.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HEART_CHARS = ['💗', '💕', '💖', '💓', '💝', '🌸', '✨'];

function Heart({ id, x, size, delay, char, onDone }) {
  return (
    <motion.div
      key={id}
      initial={{ y: '100vh', x: `${x}vw`, opacity: 0, scale: 0.5 }}
      animate={{ y: '-10vh', opacity: [0, 0.7, 0.7, 0], scale: [0.5, 1, 1, 0.8] }}
      transition={{ duration: 8 + Math.random() * 4, delay, ease: 'easeOut' }}
      onAnimationComplete={onDone}
      style={{ position: 'fixed', bottom: 0, fontSize: size, pointerEvents: 'none', zIndex: 0 }}
    >
      {char}
    </motion.div>
  );
}

let _id = 0;

export default function FloatingHearts({ count = 12, interval = 1200 }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i >= count) { clearInterval(timer); return; }
      setHearts((h) => [...h, {
        id:    ++_id,
        x:     Math.random() * 95,
        size:  `${14 + Math.random() * 18}px`,
        delay: 0,
        char:  HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
      }]);
      i++;
    }, interval);
    return () => clearInterval(timer);
  }, [count, interval]);

  return (
    <div aria-hidden className="pointer-events-none">
      {hearts.map((h) => (
        <Heart key={h.id} {...h} onDone={() =>
          setHearts((prev) => prev.filter((x) => x.id !== h.id))
        } />
      ))}
    </div>
  );
}
