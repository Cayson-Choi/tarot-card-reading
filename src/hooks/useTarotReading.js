import { useReducer, useCallback } from 'react';
import { allCards } from '../data/cards';
import { drawCards } from '../utils/cardUtils';

const PHASES = ['intro', 'question', 'spread', 'reading', 'result'];

const initialState = {
  phase: 'intro',
  question: '',
  spread: null,
  drawnCards: [],
  flippedIds: new Set(),
  customCount: 3,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };
    case 'SET_QUESTION':
      return { ...state, question: action.payload };
    case 'SELECT_SPREAD':
      return { ...state, spread: action.payload };
    case 'SET_CUSTOM_COUNT':
      return { ...state, customCount: action.payload };
    case 'DRAW_CARDS':
      return { ...state, drawnCards: action.payload, flippedIds: new Set() };
    case 'FLIP_CARD':
      return { ...state, flippedIds: new Set([...state.flippedIds, action.payload]) };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function useTarotReading() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const goToPhase = useCallback((phase) => {
    dispatch({ type: 'SET_PHASE', payload: phase });
  }, []);

  const setQuestion = useCallback((q) => {
    dispatch({ type: 'SET_QUESTION', payload: q });
  }, []);

  const selectSpread = useCallback((spread) => {
    dispatch({ type: 'SELECT_SPREAD', payload: spread });
    const count = spread.id === 'custom' ? undefined : spread.count;
    if (count) {
      dispatch({ type: 'DRAW_CARDS', payload: drawCards(allCards, count) });
    }
    dispatch({ type: 'SET_PHASE', payload: 'reading' });
  }, []);

  const selectSpreadWithCustom = useCallback((spread, customCount) => {
    dispatch({ type: 'SELECT_SPREAD', payload: { ...spread, count: customCount } });
    dispatch({ type: 'DRAW_CARDS', payload: drawCards(allCards, customCount) });
    dispatch({ type: 'SET_PHASE', payload: 'reading' });
  }, []);

  const setCustomCount = useCallback((count) => {
    dispatch({ type: 'SET_CUSTOM_COUNT', payload: count });
  }, []);

  const flipCard = useCallback((cardId) => {
    dispatch({ type: 'FLIP_CARD', payload: cardId });
  }, []);

  const allFlipped = state.drawnCards.length > 0 &&
    state.drawnCards.every((c) => state.flippedIds.has(c.id));

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    ...state,
    goToPhase,
    setQuestion,
    selectSpread,
    selectSpreadWithCustom,
    setCustomCount,
    flipCard,
    allFlipped,
    reset,
    flippedCount: state.flippedIds.size,
    totalCards: state.drawnCards.length,
  };
}
