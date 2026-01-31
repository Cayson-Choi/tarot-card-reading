// Ollama AI 타로 해석 모듈

class TarotAI {
    constructor() {
        this.ollamaUrl = 'http://localhost:11434/api/generate';
        this.model = 'llama3.1:8b';
    }

    /**
     * Ollama 연결 테스트
     */
    async testConnection() {
        try {
            const response = await fetch('http://localhost:11434/api/tags', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Ollama 연결 실패:', error);
            return false;
        }
    }

    /**
     * 타로 카드 해석 생성
     * @param {string} spreadName - 스프레드 이름
     * @param {Array} cards - 뽑은 카드 [{position: '', card: ''}, ...]
     * @returns {Promise<string>} - AI 해석 텍스트
     */
    async interpretReading(spreadName, cards) {
        // 프롬프트 생성
        const prompt = this.createPrompt(spreadName, cards);

        try {
            const response = await fetch(this.ollamaUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response;

        } catch (error) {
            console.error('AI 해석 생성 오류:', error);
            throw error;
        }
    }

    /**
     * 스트리밍 방식으로 타로 카드 해석 생성
     * @param {string} spreadName - 스프레드 이름
     * @param {Array} cards - 뽑은 카드
     * @param {Function} onChunk - 청크 수신 시 호출될 콜백
     * @returns {Promise<string>} - 전체 응답
     */
    async interpretReadingStream(spreadName, cards, onChunk) {
        const prompt = this.createPrompt(spreadName, cards);

        try {
            const response = await fetch(this.ollamaUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            fullResponse += data.response;
                            if (onChunk) {
                                onChunk(data.response);
                            }
                        }
                    } catch (e) {
                        // JSON 파싱 오류 무시
                    }
                }
            }

            return fullResponse;

        } catch (error) {
            console.error('AI 해석 생성 오류:', error);
            throw error;
        }
    }

    /**
     * 타로 리딩 프롬프트 생성
     */
    createPrompt(spreadName, cards) {
        const cardsInfo = cards.map(card =>
            `- ${card.position}: ${card.card}`
        ).join('\n');

        return `당신은 전문 타로 리더입니다. 다음 타로 카드 리딩을 해석해주세요.

**스프레드**: ${spreadName}

**뽑은 카드**:
${cardsInfo}

각 카드의 의미와 위치를 고려하여, 전체적인 흐름과 메시지를 한국어로 상세하게 해석해주세요.
각 카드의 의미를 설명하고, 카드들이 함께 전달하는 전체적인 메시지와 조언을 제공해주세요.

해석은 따뜻하고 긍정적인 톤으로 작성하되, 현실적이고 실용적인 조언을 포함해주세요.`;
    }
}

// 전역 AI 인스턴스
const tarotAI = new TarotAI();
