# 🎴 타로 카드 리딩 웹 앱

순수 HTML/CSS/JavaScript로 만든 타로 카드 뽑기 웹 애플리케이션입니다.

## ✨ 주요 기능

- **5가지 스프레드**
  - 원 카드 (1장) - 오늘의 운세
  - 쓰리 카드 (3장) - 과거/현재/미래
  - 관계 스프레드 (7장) - 관계 분석
  - 켈틱 크로스 (10장) - 종합 리딩
  - 커스텀 (1~10장) - 자유 선택

- **현대적인 UI/UX**
  - 다크 블루-퍼플 테마
  - 부드러운 애니메이션
  - 그라데이션 버튼
  - 반응형 디자인

- **편의 기능**
  - 리딩 히스토리 (LocalStorage)
  - 전체화면 모드
  - 중복 방지 카드 뽑기

- **🔮 AI 해석 기능** (Hugging Face 무료 API)
  - Llama 3 기반 AI 타로 카드 해석
  - 1~10장 모든 스프레드 지원
  - 휴대폰/PC 어디서든 사용 가능
  - 완전 무료 (제한 내에서)

## 🚀 배포

### Vercel 배포
```bash
cd web
vercel --prod
```

또는 GitHub 연결 후 자동 배포

## 📁 프로젝트 구조

```
web/
├── index.html          # 메인 HTML
├── styles.css          # 스타일시트
├── app.js             # JavaScript 로직
├── ai.js              # AI 해석 모듈 (로컬용)
├── api/
│   └── interpret.py   # Vercel Serverless Function (Hugging Face API)
├── public/
│   ├── cards/         # 타로 카드 이미지 (78장)
│   └── assets/        # 카드 뒷면 이미지
├── .env.example       # 환경 변수 예시
└── vercel.json        # Vercel 설정
```

## 🎮 사용 방법

### 기본 사용
1. 스프레드 선택
2. "카드 뽑기" 버튼 클릭
3. 왼쪽부터 순서대로 카드 공개
4. 최소 1장 이상 뽑으면 "AI 해설" 버튼 활성화
5. 저장 버튼으로 히스토리에 기록

### AI 해석 기능 (배포 시 자동 작동)

**배포 전 설정:**
1. Hugging Face 계정 생성: https://huggingface.co
2. API 토큰 발급: https://huggingface.co/settings/tokens
3. Vercel 환경 변수 설정:
   ```bash
   vercel env add HUGGINGFACE_API_KEY
   ```
   발급받은 토큰 입력

**사용 방법:**
1. 카드를 최소 1장 이상 뽑기
2. "🔮 AI 해설" 버튼 클릭
3. AI가 카드를 해석합니다 (30초~1분 소요)
4. **휴대폰, PC 어디서든 작동!**
5. 3장이든, 5장이든, 10장이든 모두 해석 가능!

## 🌐 라이브 데모

**URL**: https://web-mu-virid-82.vercel.app

**AI 기능 작동 방식**:
- Hugging Face 무료 API 사용 (Llama 3 모델)
- 휴대폰, 태블릿, PC 모두 지원
- 별도 설치 불필요
- 완전 무료 (월 사용량 제한 내)

**로컬 테스트**:
로컬에서 AI 기능을 테스트하려면 Hugging Face API 키가 필요합니다

## 📄 라이선스

개인 사용 목적으로 자유롭게 사용 가능합니다.
