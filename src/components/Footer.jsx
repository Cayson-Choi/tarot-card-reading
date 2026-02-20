import { useLanguage } from '../i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 py-6 text-center">
      <div className="mx-auto w-32 h-px mb-4 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <p className="text-xs text-white/30 font-light tracking-wider">
        {t.copyright}
      </p>
    </footer>
  );
}
