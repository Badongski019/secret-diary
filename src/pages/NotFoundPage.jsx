// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-6xl mb-6"
        >
          💔
        </motion.div>
        <h1 className="font-script text-4xl text-wine mb-2">Page not found</h1>
        <p className="font-sans text-dusty mb-6">
          This page drifted away like a love letter in the wind.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-sm font-medium text-white bg-gradient-to-r from-petal-400 to-petal-600 shadow-petal hover:shadow-envelope transition-all">
          Return home 💌
        </Link>
      </motion.div>
    </div>
  );
}
