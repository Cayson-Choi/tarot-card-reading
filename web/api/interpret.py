"""
Vercel Serverless Function - Groq API를 사용한 타로 카드 해석
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from groq import Groq

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # CORS 헤더 설정
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

            # 요청 데이터 파싱
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            spread_name = data.get('spread_name', '')
            cards = data.get('cards', [])
            question = data.get('question', '')

            # 프롬프트 생성
            prompt = self.create_prompt(spread_name, cards, question)

            # Groq API 호출
            interpretation = self.call_groq_api(prompt)

            # 응답 반환
            response = {
                'success': True,
                'interpretation': interpretation
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            error_response = {
                'success': False,
                'error': str(e)
            }
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        # CORS preflight 요청 처리
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def create_prompt(self, spread_name, cards, question=''):
        """타로 리딩 프롬프트 생성"""
        cards_info = "\n".join([
            f"- {card['position']}: {card['card']}"
            for card in cards
        ])

        # 질문이 있는 경우 프롬프트에 포함
        question_section = ''
        if question:
            question_section = f"\n**질문/주제**: {question}\n"

        return f"""당신은 전문 타로 리더입니다. 다음 타로 카드 리딩을 해석해주세요.
{question_section}
**스프레드**: {spread_name}

**뽑은 카드**:
{cards_info}

각 카드의 의미와 위치를 고려하여, 전체적인 흐름과 메시지를 한국어로 상세하게 해석해주세요.
{f"특히 질문하신 '{question}'에 대한 답변을 중심으로 해석해주세요." if question else "각 카드의 의미를 설명하고, 카드들이 함께 전달하는 전체적인 메시지와 조언을 제공해주세요."}

해석은 따뜻하고 긍정적인 톤으로 작성하되, 현실적이고 실용적인 조언을 포함해주세요."""

    def call_groq_api(self, prompt):
        """Groq API 호출"""
        # 환경 변수에서 API 키 가져오기
        api_key = os.environ.get('GROQ_API_KEY', '')

        # 명시적으로 문자열로 변환 (바이트일 경우 대비)
        if isinstance(api_key, bytes):
            api_key = api_key.decode('utf-8')
        api_key = str(api_key).strip()

        if not api_key:
            raise ValueError('GROQ_API_KEY 환경 변수가 설정되지 않았습니다')

        try:
            # Groq 클라이언트 생성
            client = Groq(api_key=api_key)

            # Chat completion 호출
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",  # 최신 모델, 무료, 한국어 지원 우수
                temperature=0.7,
                max_tokens=1000,
                top_p=0.9
            )

            return chat_completion.choices[0].message.content

        except Exception as e:
            raise Exception(f'API 호출 실패: {str(e)}')
