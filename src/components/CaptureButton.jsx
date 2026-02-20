import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCamera } from 'react-icons/hi';
import { useLanguage } from '../i18n/LanguageContext';
import { captureElement, downloadCanvas } from '../utils/captureUtils';

export default function CaptureButton({ targetRef }) {
  const [capturing, setCapturing] = useState(false);
  const { t } = useLanguage();

  const handleCapture = async () => {
    if (!targetRef?.current || capturing) return;
    setCapturing(true);
    try {
      const canvas = await captureElement(targetRef.current);
      downloadCanvas(canvas);
    } catch (err) {
      console.error('Capture failed:', err);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <motion.button
      onClick={handleCapture}
      disabled={capturing}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl
                 bg-gradient-to-r from-purple-600 to-indigo-600
                 text-white text-sm font-medium
                 hover:from-purple-500 hover:to-indigo-500
                 active:scale-95 transition-all disabled:opacity-50"
      whileTap={{ scale: 0.95 }}
    >
      {capturing ? (
        <motion.div
          className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      ) : (
        <HiOutlineCamera className="text-base" />
      )}
      {t.saveImage}
    </motion.button>
  );
}
