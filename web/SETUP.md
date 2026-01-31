# 타로 웹 앱 설정 가이드

## 환경 변수 설정

AI 해석 기능과 관리자 패널을 사용하려면 Vercel에 다음 환경 변수를 설정해야 합니다:

### 필수 환경 변수

1. **ADMIN_PASSWORD** (관리자 비밀번호)
   - 기본값: `1016`
   - 용도: 관리자 패널 접근용

2. **AI_PASSWORD** (AI 해석 비밀번호)
   - 기본값: `1004`
   - 용도: AI 해석 기능 사용 권한

3. **GROQ_API_KEY** (이미 설정됨)
   - 용도: Groq API 호출용

## Vercel 대시보드를 통한 설정

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 (web)
3. Settings → Environment Variables 메뉴로 이동
4. 다음 변수들을 추가:
   - Name: `ADMIN_PASSWORD`, Value: `1016`, Environments: Production
   - Name: `AI_PASSWORD`, Value: `1004`, Environments: Production
5. 저장 후 프로젝트 재배포

## CLI를 통한 설정

```bash
cd web

# ADMIN_PASSWORD 설정
echo -e "1016\ny\nProduction\nn\nn" | vercel env add ADMIN_PASSWORD

# AI_PASSWORD 설정
echo -e "1004\ny\nProduction\nn\nn" | vercel env add AI_PASSWORD

# 재배포
vercel --prod
```

## 비밀번호 변경 방법

### AI 비밀번호 변경 (웹 UI 통해)

1. 웹사이트 우측 상단의 ⚙️ 버튼 클릭
2. 관리자 비밀번호 입력 (1016)
3. 새 AI 비밀번호 입력 (4자리 숫자)
4. "비밀번호 변경" 클릭

**참고**: 웹 UI를 통한 변경은 임시로 저장되며, 서버 재시작 시 환경 변수의 기본값으로 초기화됩니다. 영구적으로 변경하려면 Vercel 대시보드에서 `AI_PASSWORD` 환경 변수를 직접 수정하세요.

### 관리자 비밀번호 변경 (Vercel 대시보드)

1. Vercel 대시보드 → Settings → Environment Variables
2. `ADMIN_PASSWORD` 찾아서 Edit 클릭
3. 새 값 입력 후 저장
4. 프로젝트 재배포

## 기능 설명

### 사용자 AI 해석 기능

- 카드를 1장 이상 뽑은 후 "🔮 AI 해설" 버튼 클릭
- 4자리 비밀번호 입력
- 비밀번호가 맞으면 AI가 카드를 해석
- 비밀번호를 모르는 경우 010-7433-1947로 문자

### 관리자 패널

- 우측 상단 ⚙️ 버튼 클릭
- 관리자 비밀번호 입력
- 현재 AI 비밀번호 확인 및 변경 가능

## 보안 참고사항

- 관리자 비밀번호는 절대 공개하지 마세요
- AI 비밀번호는 정기적으로 변경하는 것을 권장합니다
- 모든 비밀번호는 4자리 숫자여야 합니다
