"""
AI 해석 기능 테스트
"""
import sys
import io
from ai_interpreter import TarotAIInterpreter

# Windows 콘솔 인코딩 설정
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# AI 인터프리터 생성
interpreter = TarotAIInterpreter()

# 연결 테스트
print("Ollama 연결 테스트...")
if interpreter.test_connection():
    print("[OK] Ollama 연결 성공!")
else:
    print("[ERROR] Ollama 연결 실패!")
    exit(1)

# 샘플 리딩
print("\n샘플 리딩 해석 생성 중...")
sample_cards = [
    {"position": "과거", "card": "0. 바보 카드"},
    {"position": "현재", "card": "1. 마법사 카드"},
    {"position": "미래", "card": "21. 세계 카드"}
]

interpretation = interpreter.interpret_reading("쓰리 카드", sample_cards)
print("\n" + "="*60)
print("AI 해석 결과:")
print("="*60)
print(interpretation)
print("="*60)
