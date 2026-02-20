import { motion } from 'framer-motion';
import TarotCard from './TarotCard';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function SpreadLayout({ cards, spread, flippedIds, onFlip, lang }) {
  const positions = lang === 'ko' ? spread.positionsKo : spread.positionsEn;
  const count = cards.length;

  // Mobile: responsive grid, Desktop: special layouts for some spreads
  const getGridClass = () => {
    if (count === 1) return 'flex justify-center';
    if (count === 2) return 'flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8';
    if (count === 3) return 'grid grid-cols-3 gap-2 md:gap-6 justify-items-center';
    if (count <= 5) return 'grid grid-cols-3 gap-2 md:gap-4 justify-items-center';
    if (count <= 7) return 'grid grid-cols-3 gap-2 md:gap-4 justify-items-center';
    return 'grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4 justify-items-center';
  };

  return (
    <motion.div
      className={`${getGridClass()} w-full max-w-3xl mx-auto px-2`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card, i) => (
        <TarotCard
          key={card.id}
          card={card}
          isFlipped={flippedIds.has(card.id)}
          onFlip={onFlip}
          positionLabel={positions && positions[i] ? positions[i] : `${i + 1}`}
          index={i}
        />
      ))}
    </motion.div>
  );
}
