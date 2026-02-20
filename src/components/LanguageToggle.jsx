import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 z-50 flex items-center rounded-full
                 bg-white/10 backdrop-blur-md border border-white/20
                 px-1 py-1 text-xs font-medium transition-all duration-300
                 hover:bg-white/20 safe-top-offset"
      style={{ paddingTop: 'max(0.25rem, env(safe-area-inset-top))' }}
    >
      <span
        className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
          lang === 'ko'
            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-semibold'
            : 'text-white/60'
        }`}
      >
        KO
      </span>
      <span
        className={`px-2.5 py-1 rounded-full transition-all duration-300 ${
          lang === 'en'
            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-semibold'
            : 'text-white/60'
        }`}
      >
        EN
      </span>
    </button>
  );
}
