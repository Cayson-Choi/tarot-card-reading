import { motion } from 'framer-motion';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { useLanguage } from '../i18n/LanguageContext';

export default function BackButton({ onClick }) {
  const { t } = useLanguage();

  return (
    <motion.button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 flex items-center gap-1 pl-2 pr-3.5 py-2
                 rounded-full bg-white/10 backdrop-blur-md border border-white/15
                 text-white/70 text-xs font-medium
                 hover:bg-white/20 hover:text-white/90
                 active:scale-95 transition-all duration-200"
      style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      whileTap={{ scale: 0.92 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HiOutlineChevronLeft className="text-sm text-amber-400/80" />
      <span>{t.back}</span>
    </motion.button>
  );
}
