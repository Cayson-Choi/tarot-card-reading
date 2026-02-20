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
  const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1';

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const isKo = lang === 'ko';

  const cardList = cards
    .map((c, i) => {
      const name = isKo ? c.nameKo : c.nameEn;
      const pos = c.position || `${i + 1}`;
      return `- ${pos}: ${name}`;
    })
    .join('\n');

  const systemPrompt = isKo
    ? `당신은 전문 타로 리더입니다. 깊은 통찰력과 따뜻한 공감 능력으로 카드를 해석합니다.
마크다운 형식으로 답변하세요. 각 카드를 개별적으로 해석한 후, 전체 흐름을 종합하고, 실질적인 조언을 제공하세요.
카드 이름에는 **굵게** 표시하세요. 전체 해석은 자연스럽고 이해하기 쉬운 한국어로 작성하세요.`
    : `You are an expert tarot reader with deep insight and warm empathy.
Respond in markdown format. Interpret each card individually, then provide an overall flow synthesis and practical advice.
Use **bold** for card names. Write in clear, natural English.`;

  const userMessage = isKo
    ? `스프레드: ${spread || '자유 배치'}
${question ? `질문: ${question}` : '질문 없음 (일반 리딩)'}

뽑은 카드:
${cardList}

각 카드의 의미를 포지션에 맞게 해석하고, 카드들의 전체적인 흐름과 메시지를 종합해 주세요. 마지막에 실질적인 조언을 해 주세요.`
    : `Spread: ${spread || 'Free Layout'}
${question ? `Question: ${question}` : 'No question (general reading)'}

Drawn cards:
${cardList}

Interpret each card according to its position, synthesize the overall flow and message, and provide practical advice at the end.`;

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
        max_tokens: 2000,
        temperature: 0.8,
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
