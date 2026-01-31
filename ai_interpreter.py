"""
AI 타로 카드 해석 모듈 (Ollama + Llama 3 사용)
"""
import json
import subprocess
from typing import List, Dict

class TarotAIInterpreter:
    def __init__(self, model="llama3.1:8b"):
        self.model = model

    def interpret_reading(self, spread_name: str, cards: List[Dict[str, str]]) -> str:
        """
        타로 카드 리딩을 AI로 해석합니다.

        Args:
            spread_name: 스프레드 이름 (예: "원 카드", "쓰리 카드")
            cards: 뽑은 카드 정보 리스트 [{"position": "과거", "card": "0. 바보 카드"}, ...]

        Returns:
            AI가 생성한 해석 텍스트
        """
        # 프롬프트 생성
        prompt = self._create_prompt(spread_name, cards)

        try:
            # Ollama API 호출
            result = subprocess.run(
                ['ollama', 'run', self.model],
                input=prompt,
                capture_output=True,
                text=True,
                encoding='utf-8',
                timeout=60
            )

            if result.returncode == 0:
                return result.stdout.strip()
            else:
                return f"AI 해석 생성 중 오류가 발생했습니다: {result.stderr}"

        except subprocess.TimeoutExpired:
            return "AI 해석 생성 시간이 초과되었습니다. 다시 시도해주세요."
        except Exception as e:
            return f"AI 해석 생성 중 오류가 발생했습니다: {str(e)}"

    def _create_prompt(self, spread_name: str, cards: List[Dict[str, str]]) -> str:
        """타로 리딩에 맞는 프롬프트 생성"""

        # 카드 정보를 문자열로 변환
        cards_info = "\n".join([
            f"- {card['position']}: {card['card']}"
            for card in cards
        ])

        prompt = f"""당신은 전문 타로 리더입니다. 다음 타로 카드 리딩을 해석해주세요.

**스프레드**: {spread_name}

**뽑은 카드**:
{cards_info}

각 카드의 의미와 위치를 고려하여, 전체적인 흐름과 메시지를 한국어로 상세하게 해석해주세요.
각 카드의 의미를 설명하고, 카드들이 함께 전달하는 전체적인 메시지와 조언을 제공해주세요.

해석은 따뜻하고 긍정적인 톤으로 작성하되, 현실적이고 실용적인 조언을 포함해주세요.
"""

        return prompt

    def test_connection(self) -> bool:
        """Ollama 연결 테스트"""
        try:
            result = subprocess.run(
                ['ollama', 'list'],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode == 0
        except:
            return False
