import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SpreadLayout from './SpreadLayout';

export default function TarotTable({
  cards,
  spread,
  flippedIds,
  onFlip,
  allFlipped,
  flippedCount,
  totalCards,
  question,
  onRequestAI,
}) {
  const { lang, t } = useLanguage();

  return (
    <motion.div
      className="min-h-dvh flex flex-col items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question display */}
      {question && (
        <motion.div
          className="mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10
                     text-xs text-white/50 max-w-xs text-center truncate"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-amber-400/60 mr-1">{t.yourQuestion}:</span>
          {question}
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-2">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>{t.cardsRevealed}</span>
          <span className="text-amber-400">{flippedCount}/{totalCards}</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
            animate={{ width: `${(flippedCount / totalCards) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Tap hint */}
      {!allFlipped && (
        <motion.p
          className="text-xs text-white/30 mb-6"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {t.tapToReveal}
        </motion.p>
      )}

      {allFlipped && <div className="mb-6" />}

      {/* Card spread */}
      <SpreadLayout
        cards={cards}
        spread={spread}
        flippedIds={flippedIds}
        onFlip={onFlip}
        lang={lang}
      />

      {/* AI Button - appears when all cards flipped */}
      <AnimatePresence>
        {allFlipped && (
          <motion.button
            className="mt-8 px-8 py-3.5 rounded-xl font-semibold text-sm
                       bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500
                       text-gray-900 shadow-lg active:scale-95"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRequestAI}
          >
            {/* Glow pulse */}
            <motion.span
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 15px rgba(251,191,36,0.3)',
                  '0 0 30px rgba(251,191,36,0.6)',
                  '0 0 15px rgba(251,191,36,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {t.getAIReading}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
