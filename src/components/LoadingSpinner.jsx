import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

export default function LoadingSpinner() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      {/* Rotating card icon */}
      <div className="relative">
        <motion.div
          className="w-16 h-24 rounded-lg border-2 border-amber-400/60 bg-gradient-to-b from-indigo-900/80 to-purple-900/80
                     flex items-center justify-center text-2xl"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ perspective: 600 }}
        >
          <span className="text-amber-400">&#10022;</span>
        </motion.div>

        {/* Orbiting particles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
            animate={{
              rotate: [i * 90, i * 90 + 360],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: '0 -30px',
            }}
          />
        ))}
      </div>

      {/* Typing text effect */}
      <motion.p
        className="text-white/70 text-sm font-light"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {t.aiLoading}
      </motion.p>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-purple-400"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
