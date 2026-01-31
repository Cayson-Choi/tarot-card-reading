"""
Vercel Serverless Function - Hugging Face API를 사용한 타로 카드 해석
"""
from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.error
import os

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

            # 프롬프트 생성
            prompt = self.create_prompt(spread_name, cards)

            # Hugging Face API 호출
            interpretation = self.call_huggingface_api(prompt)

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

    def create_prompt(self, spread_name, cards):
        """타로 리딩 프롬프트 생성"""
        cards_info = "\n".join([
            f"- {card['position']}: {card['card']}"
            for card in cards
        ])

        return f"""당신은 전문 타로 리더입니다. 다음 타로 카드 리딩을 해석해주세요.

**스프레드**: {spread_name}

**뽑은 카드**:
{cards_info}

각 카드의 의미와 위치를 고려하여, 전체적인 흐름과 메시지를 한국어로 상세하게 해석해주세요.
각 카드의 의미를 설명하고, 카드들이 함께 전달하는 전체적인 메시지와 조언을 제공해주세요.

해석은 따뜻하고 긍정적인 톤으로 작성하되, 현실적이고 실용적인 조언을 포함해주세요."""

    def call_huggingface_api(self, prompt):
        """Hugging Face Inference API 호출"""
        # 환경 변수에서 API 키 가져오기
        api_key = os.environ.get('HUGGINGFACE_API_KEY')
        if not api_key:
            raise ValueError('HUGGINGFACE_API_KEY 환경 변수가 설정되지 않았습니다')

        # Hugging Face 모델 선택
        # 무료 티어에서 사용 가능한 한국어 지원 모델
        model = "meta-llama/Meta-Llama-3-8B-Instruct"

        api_url = f"https://api-inference.huggingface.co/models/{model}"

        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        payload = {
            'inputs': prompt,
            'parameters': {
                'max_new_tokens': 1000,
                'temperature': 0.7,
                'top_p': 0.9,
                'do_sample': True
            }
        }

        req = urllib.request.Request(
            api_url,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )

        try:
            with urllib.request.urlopen(req, timeout=60) as response:
                result = json.loads(response.read().decode('utf-8'))

                # 응답 형식 처리
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get('generated_text', '')
                elif isinstance(result, dict):
                    return result.get('generated_text', str(result))
                else:
                    return str(result)

        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            raise Exception(f'Hugging Face API 오류: {e.code} - {error_body}')
        except Exception as e:
            raise Exception(f'API 호출 실패: {str(e)}')
