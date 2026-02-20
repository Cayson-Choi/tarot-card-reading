import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { HiOutlineMail } from 'react-icons/hi';
import { useLanguage } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import BackButton from './BackButton';
import { captureElement, downloadCanvas } from '../utils/captureUtils';

export default function AIReadingPanel({
  reading,
  loading,
  error,
  onRetry,
  onNewReading,
  onBack,
  cards,
  spread,
  question,
}) {
  const { lang, t } = useLanguage();
  const captureRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const handleSaveImage = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const canvas = await captureElement(captureRef.current);
      downloadCanvas(canvas, 'tarot-reading.png');
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = () => {
    const cardNames = cards
      .map((c) => (lang === 'ko' ? c.nameKo : c.nameEn))
      .join(', ');

    const body = [
      question ? `${t.yourQuestion}: ${question}` : '',
      '',
      `${lang === 'ko' ? '스프레드' : 'Spread'}: ${lang === 'ko' ? spread?.nameKo : spread?.nameEn}`,
      `${lang === 'ko' ? '카드' : 'Cards'}: ${cardNames}`,
      '',
      '---',
      '',
      reading,
    ]
      .filter(Boolean)
      .join('\n');

    const subject = encodeURIComponent(t.emailSubject);
    const encodedBody = encodeURIComponent(body);
    window.open(`mailto:?subject=${subject}&body=${encodedBody}`);
  };

  return (
    <motion.div
      className="min-h-dvh flex flex-col items-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton onClick={onBack} />

      {/* Loading state - centered */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            className="flex-1 flex items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div
            key="error"
            className="flex-1 flex items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center py-8">
              <p className="text-red-400/80 text-sm mb-4">{t.aiError}</p>
              <button
                onClick={onRetry}
                className="px-6 py-2 rounded-lg bg-white/10 text-white/70 text-sm
                           hover:bg-white/20 transition-colors active:scale-95"
              >
                {t.retry}
              </button>
            </div>
          </motion.div>
        )}

        {/* Reading result - unfold animation */}
        {reading && !loading && (
          <motion.div
            key="result"
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Title */}
            <motion.h2
              className="font-serif text-xl md:text-2xl font-semibold mb-6 gold-gradient-text text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {t.aiReadingTitle}
            </motion.h2>

            {/* Visible content */}
            <div>
              {/* Question reminder */}
              {question && (
                <motion.div
                  className="mb-4 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="text-xs text-amber-400/60 mb-0.5">{t.yourQuestion}</p>
                  <p className="text-sm text-white/70">{question}</p>
                </motion.div>
              )}

              {/* Card thumbnails */}
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {cards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  >
                    <img
                      src={card.image}
                      alt={lang === 'ko' ? card.nameKo : card.nameEn}
                      className="w-12 h-[82px] md:w-16 md:h-[110px] rounded object-contain
                                 border border-white/10"
                    />
                    <span className="text-[9px] md:text-[10px] text-white/40 mt-0.5 max-w-[50px] truncate text-center">
                      {lang === 'ko' ? card.nameKo : card.nameEn}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* AI interpretation text */}
              <motion.div
                className="glass-panel rounded-2xl p-5 md:p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="prose-tarot">
                  <ReactMarkdown>{reading}</ReactMarkdown>
                </div>
              </motion.div>
            </div>

            {/* Hidden capture area - flat static version for screenshot */}
            <div
              ref={captureRef}
              style={{
                position: 'absolute',
                left: '-9999px',
                top: 0,
                backgroundColor: '#0a0e1a',
                padding: '24px',
                borderRadius: '16px',
                width: '500px',
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#e2e8f0',
              }}
            >
              {/* Title */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h2 style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {t.aiReadingTitle}
                </h2>
              </div>

              {/* Question */}
              {question && (
                <div style={{
                  marginBottom: '16px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <p style={{ fontSize: '11px', color: 'rgba(251,191,36,0.6)', marginBottom: '2px' }}>{t.yourQuestion}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{question}</p>
                </div>
              )}

              {/* Card images */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {cards.map((card) => (
                  <div key={card.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img
                      src={card.image}
                      alt={lang === 'ko' ? card.nameKo : card.nameEn}
                      style={{ width: '60px', height: '103px', objectFit: 'contain', borderRadius: '4px' }}
                      crossOrigin="anonymous"
                    />
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center', display: 'block' }}>
                      {lang === 'ko' ? card.nameKo : card.nameEn}
                    </span>
                  </div>
                ))}
              </div>

              {/* AI text as plain text */}
              <div style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'rgba(255,255,255,0.75)',
                whiteSpace: 'pre-wrap',
              }}>
                {reading}
              </div>
            </div>

            {/* Action buttons (outside capture area) */}
            <motion.div
              className="flex gap-3 items-center justify-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <button
                onClick={handleSaveImage}
                disabled={saving}
                className="flex-1 max-w-[140px] py-3 rounded-xl text-sm font-medium
                           bg-white/[0.06] backdrop-blur-md border border-white/[0.12]
                           text-white/70 transition-all duration-300
                           hover:bg-white/[0.1] hover:border-white/20 hover:text-white/90
                           active:scale-95 disabled:opacity-40"
              >
                {t.saveImage}
              </button>

              <button
                onClick={handleSendEmail}
                className="flex-1 max-w-[140px] py-3 rounded-xl text-sm font-medium
                           bg-white/[0.06] backdrop-blur-md border border-white/[0.12]
                           text-white/70 transition-all duration-300
                           hover:bg-white/[0.1] hover:border-white/20 hover:text-white/90
                           active:scale-95"
              >
                {t.sendEmail}
              </button>

              <button
                onClick={onNewReading}
                className="flex-1 max-w-[140px] py-3 rounded-xl text-sm font-medium
                           bg-white/[0.06] backdrop-blur-md border border-amber-400/25
                           text-amber-300/90 transition-all duration-300
                           hover:bg-amber-400/[0.08] hover:border-amber-400/40 hover:text-amber-200
                           active:scale-95"
              >
                {t.newReading}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
