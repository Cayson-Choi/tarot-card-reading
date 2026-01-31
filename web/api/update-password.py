"""
Vercel Serverless Function - AI 비밀번호 변경
참고: 이 변경사항은 임시로 저장되며, 서버 재시작 시 초기화됩니다.
영구적으로 변경하려면 Vercel 대시보드에서 AI_PASSWORD 환경 변수를 업데이트하세요.
"""
from http.server import BaseHTTPRequestHandler
import json
import os

# 임시 비밀번호 저장 (서버 재시작 시 초기화됨)
PASSWORD_FILE = '/tmp/ai_password.txt'

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

            new_password = data.get('new_password', '').strip()

            # 비밀번호 유효성 검사
            if len(new_password) != 4 or not new_password.isdigit():
                response = {
                    'success': False,
                    'error': '비밀번호는 4자리 숫자여야 합니다.'
                }
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
                return

            # 임시 파일에 저장
            try:
                with open(PASSWORD_FILE, 'w') as f:
                    f.write(new_password)
            except Exception as e:
                print(f"Warning: Could not write to temp file: {e}")

            # 성공 응답
            response = {
                'success': True,
                'message': '비밀번호가 변경되었습니다. (임시 저장 - 서버 재시작 시 초기화됨)'
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

def get_current_password():
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
