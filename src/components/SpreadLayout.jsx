import { motion } from 'framer-motion';
import TarotCard from './TarotCard';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function SpreadLayout({ cards, spread, flippedIds, onFlip, lang }) {
  const positions = lang === 'ko' ? spread.positionsKo : spread.positionsEn;
  const count = cards.length;

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 md:gap-4 w-full max-w-5xl mx-auto px-2
                 md:flex-nowrap"
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
