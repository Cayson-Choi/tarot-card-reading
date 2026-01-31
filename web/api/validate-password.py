"""
Vercel Serverless Function - AI 비밀번호 검증
"""
from http.server import BaseHTTPRequestHandler
import json
import os

# 임시 비밀번호 파일 경로
PASSWORD_FILE = '/tmp/ai_password.txt'

def get_current_ai_password():
    """현재 AI 비밀번호 가져오기 (임시 파일 -> 환경 변수 순)"""
    # 먼저 임시 파일 확인
    if os.path.exists(PASSWORD_FILE):
        try:
            with open(PASSWORD_FILE, 'r') as f:
                return f.read().strip()
        except:
            pass

    # 임시 파일이 없으면 환경 변수 사용
    return os.environ.get('AI_PASSWORD', '1004').strip()

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

            user_password = data.get('password', '').strip()

            # 현재 AI 비밀번호 가져오기 (임시 파일 또는 환경 변수)
            ai_password = get_current_ai_password()

            # 비밀번호 검증
            is_valid = (user_password == ai_password)

            # 응답 반환
            response = {
                'valid': is_valid
            }
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

        except Exception as e:
            error_response = {
                'valid': False,
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
