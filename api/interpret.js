export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cards, spread, question, lang } = req.body;

  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return res.status(400).json({ error: 'Cards are required' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const isKo = lang === 'ko';
  const outputLang = isKo ? 'Korean' : 'English';

  const cardList = cards
    .map((c, i) => {
      const name = `${c.nameEn} (${c.nameKo})`;
      const pos = c.position || `Card ${i + 1}`;
      return `- Position [${pos}]: ${name}`;
    })
    .join('\n');

  const systemPrompt = `You are a professional tarot master specialized in Rider-Waite tarot interpretation with deep intuitive insight and warm empathy.

INPUT FORMAT:
- You will receive card names with their spread positions as text.
- Each card includes its English and Korean name, and its position in the spread.

INTERPRETATION STRUCTURE — follow these steps in order:

STEP 1: Individual Card Meaning
For each card:
- Traditional Rider-Waite meaning based on classical symbolism
- Key symbolic elements (imagery, colors, numerology, astrological associations)
- Emotional and psychological meaning
- Practical real-world implication in the querent's life

STEP 2: Spread Context & Card Interactions
- How each card influences the others based on their positions
- Energy flow and narrative arc across the spread
- Dominant patterns: recurring suits, elements, numbers, or archetypes

STEP 3: Situation Analysis
- Current situation as revealed by the cards
- Hidden factors or subconscious influences
- Likely outcome trajectory if the current path continues

STEP 4: Practical Advice
- Actionable, concrete guidance the querent can apply immediately
- Specific steps or mindset shifts to consider
- Avoid vague spiritual platitudes — be direct and helpful

FORMATTING RULES:
- Use **bold** for all card names.
- Use markdown headers (##) for each section.
- Keep paragraphs concise but insightful.
- Be specific and concrete — avoid generic horoscope-style interpretation.
- Base all interpretations strictly on classical Rider-Waite symbolism.

CRITICAL: Respond entirely in ${outputLang}.`;

  const userMessage = `Spread type: ${spread || 'Free Layout'}
${question ? `Querent's question: "${question}"` : 'No specific question — provide a general life reading.'}

Cards drawn (in spread order):
${cardList}

Please provide a complete, structured tarot reading.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 2500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenRouter error:', errText);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || '';

    // Remove DeepSeek R1 <think> tags
    text = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    return res.status(200).json({ reading: text });
  } catch (err) {
    console.error('Interpret error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
