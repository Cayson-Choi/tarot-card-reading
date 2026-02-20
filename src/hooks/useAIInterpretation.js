import { useState, useCallback } from 'react';

export function useAIInterpretation() {
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReading = useCallback(async ({ cards, spread, question, lang }) => {
    setLoading(true);
    setError(null);
    setReading('');

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards, spread, question, lang }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setReading(data.reading);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearReading = useCallback(() => {
    setReading('');
    setError(null);
  }, []);

  return { reading, loading, error, fetchReading, clearReading };
}
