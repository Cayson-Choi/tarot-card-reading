// 78 Tarot Cards - Major Arcana (22) + Minor Arcana (56)
const majorArcana = [
  { id: 0, nameKo: '바보', nameEn: 'The Fool', image: '/cards/0. 바보 카드.jpg', arcana: 'major' },
  { id: 1, nameKo: '마법사', nameEn: 'The Magician', image: '/cards/1. 마법사 카드.jpg', arcana: 'major' },
  { id: 2, nameKo: '여사제', nameEn: 'The High Priestess', image: '/cards/2. 여사제 카드.jpg', arcana: 'major' },
  { id: 3, nameKo: '여황제', nameEn: 'The Empress', image: '/cards/3. 여황제 카드.jpg', arcana: 'major' },
  { id: 4, nameKo: '황제', nameEn: 'The Emperor', image: '/cards/4. 황제 카드.jpg', arcana: 'major' },
  { id: 5, nameKo: '교황', nameEn: 'The Hierophant', image: '/cards/5. 교황 카드.jpg', arcana: 'major' },
  { id: 6, nameKo: '연인', nameEn: 'The Lovers', image: '/cards/6. 연인 카드.jpg', arcana: 'major' },
  { id: 7, nameKo: '전차', nameEn: 'The Chariot', image: '/cards/7. 전차 카드.jpg', arcana: 'major' },
  { id: 8, nameKo: '힘', nameEn: 'Strength', image: '/cards/8. 힘 카드.jpg', arcana: 'major' },
  { id: 9, nameKo: '은둔자', nameEn: 'The Hermit', image: '/cards/9. 은둔자 카드.jpg', arcana: 'major' },
  { id: 10, nameKo: '운명의 수레바퀴', nameEn: 'Wheel of Fortune', image: '/cards/10. 운명의 수레바퀴.jpg', arcana: 'major' },
  { id: 11, nameKo: '정의', nameEn: 'Justice', image: '/cards/11. 정의 카드.jpg', arcana: 'major' },
  { id: 12, nameKo: '행맨', nameEn: 'The Hanged Man', image: '/cards/12. 행맨 카드.jpg', arcana: 'major' },
  { id: 13, nameKo: '죽음', nameEn: 'Death', image: '/cards/13. 죽음 카드.jpg', arcana: 'major' },
  { id: 14, nameKo: '절제', nameEn: 'Temperance', image: '/cards/14. 절제 카드.jpg', arcana: 'major' },
  { id: 15, nameKo: '악마', nameEn: 'The Devil', image: '/cards/15. 악마 카드.jpg', arcana: 'major' },
  { id: 16, nameKo: '타워', nameEn: 'The Tower', image: '/cards/16. 타워 카드.jpg', arcana: 'major' },
  { id: 17, nameKo: '별', nameEn: 'The Star', image: '/cards/17. 별 카드.jpg', arcana: 'major' },
  { id: 18, nameKo: '달', nameEn: 'The Moon', image: '/cards/18. 달 카드.jpg', arcana: 'major' },
  { id: 19, nameKo: '태양', nameEn: 'The Sun', image: '/cards/19. 태양 카드.jpg', arcana: 'major' },
  { id: 20, nameKo: '심판', nameEn: 'Judgement', image: '/cards/20. 심판 카드.jpg', arcana: 'major' },
  { id: 21, nameKo: '세계', nameEn: 'The World', image: '/cards/21. 세계 카드.jpg', arcana: 'major' },
];

function minorSuit(suit, suitEn, startId) {
  const nums = [
    { nameKo: `${suit} 에이스`, nameEn: `Ace of ${suitEn}`, file: `${suit} 에이스.jpg` },
    ...Array.from({ length: 9 }, (_, i) => ({
      nameKo: `${suit} ${i + 2}`,
      nameEn: `${i + 2} of ${suitEn}`,
      file: `${suit}${i + 2}.jpg`,
    })),
    { nameKo: `${suit} 페이지`, nameEn: `Page of ${suitEn}`, file: `${suit} 페이지.jpg` },
    { nameKo: `${suit} 나이트`, nameEn: `Knight of ${suitEn}`, file: `${suit} 나이트.jpg` },
    { nameKo: `${suit} 퀸`, nameEn: `Queen of ${suitEn}`, file: `${suit} 퀸.jpg` },
    { nameKo: `${suit} 킹`, nameEn: `King of ${suitEn}`, file: `${suit} 킹.jpg` },
  ];
  return nums.map((c, i) => ({
    id: startId + i,
    nameKo: c.nameKo,
    nameEn: c.nameEn,
    image: `/cards/${c.file}`,
    arcana: 'minor',
    suit: suitEn.toLowerCase(),
  }));
}

const wands = minorSuit('완드', 'Wands', 22);
const cups = minorSuit('컵', 'Cups', 36);
const swords = minorSuit('소드', 'Swords', 50);
const pentacles = minorSuit('펜타클', 'Pentacles', 64);

export const allCards = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
];

export const CARD_BACK = '/cardback/cardback.png';
