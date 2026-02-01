// 스프레드 정의
const SPREADS = {
    one_card: {
        name: '1장 리딩',
        count: 1,
        positions: ['핵심 메시지']
    },
    three_card: {
        name: '3장 리딩',
        count: 3,
        positions: ['과거', '현재', '미래']
    },
    relationship: {
        name: '5장 리딩',
        count: 5,
        positions: [
            '현재 상황', '근본 원인', '장애물', '잠재력', '최종 결과'
        ]
    },
    celtic_cross: {
        name: '7장 리딩',
        count: 7,
        positions: [
            '현재 상황', '과거의 영향', '미래의 가능성', '내면의 상태',
            '외부 환경', '조언', '최종 결과'
        ]
    },
    custom: {
        name: '커스텀',
        count: 0,
        positions: []
    }
};

// 카드 목록 (78장)
const ALL_CARDS = [
    '0. 바보 카드.jpg', '1. 마법사 카드.jpg', '10. 운명의 수레바퀴.jpg', '11. 정의 카드.jpg',
    '12. 행맨 카드.jpg', '13. 죽음 카드.jpg', '14. 절제 카드.jpg', '15. 악마 카드.jpg',
    '16. 타워 카드.jpg', '17. 별 카드.jpg', '18. 달 카드.jpg', '19. 태양 카드.jpg',
    '2. 여사제 카드.jpg', '20. 심판 카드.jpg', '21. 세계 카드.jpg', '3. 여황제 카드.jpg',
    '4. 황제 카드.jpg', '5. 교황 카드.jpg', '6. 연인 카드.jpg', '7. 전차 카드.jpg',
    '8. 힘 카드.jpg', '9. 은둔자 카드.jpg',
    '소드 나이트.jpg', '소드 에이스.jpg', '소드 퀸.jpg', '소드 킹.jpg', '소드 페이지.jpg',
    '소드10.jpg', '소드2.jpg', '소드3.jpg', '소드4.jpg', '소드5.jpg', '소드6.jpg',
    '소드7.jpg', '소드8.jpg', '소드9.jpg',
    '완드 나이트.jpg', '완드 에이스.jpg', '완드 퀸.jpg', '완드 킹.jpg', '완드 페이지.jpg',
    '완드10.jpg', '완드2.jpg', '완드3.jpg', '완드4.jpg', '완드5.jpg', '완드6.jpg',
    '완드7.jpg', '완드8.jpg', '완드9.jpg',
    '컵 나이트.jpg', '컵 에이스.jpg', '컵 퀸.jpg', '컵 킹.jpg', '컵 페이지.jpg',
    '컵10.jpg', '컵2.jpg', '컵3.jpg', '컵4.jpg', '컵5.jpg', '컵6.jpg',
    '컵7.jpg', '컵8.jpg', '컵9.jpg',
    '펜타클 나이트.jpg', '펜타클 에이스.jpg', '펜타클 퀸.jpg', '펜타클 킹.jpg', '펜타클 페이지.jpg',
    '펜타클10.jpg', '펜타클2.jpg', '펜타클3.jpg', '펜타클4.jpg', '펜타클5.jpg', '펜타클6.jpg',
    '펜타클7.jpg', '펜타클8.jpg', '펜타클9.jpg'
];

// 앱 상태
let currentSpread = null;
let availableCards = [];
let drawnCards = [];
let currentCardIndex = 0;
let isMuted = false;

// DOM 요소
const screens = {
    mainMenu: document.getElementById('mainMenu'),
    reading: document.getElementById('readingScreen'),
    history: document.getElementById('historyScreen')
};

// 초기화
function init() {
    // 이벤트 리스너 등록
    document.querySelectorAll('.spread-btn').forEach(btn => {
        btn.addEventListener('click', () => selectSpread(btn.dataset.spread));
    });

    document.getElementById('historyBtn').addEventListener('click', showHistory);
    document.getElementById('drawBtn').addEventListener('click', drawNextCard);
    document.getElementById('backBtn').addEventListener('click', showMainMenu);
    document.getElementById('resetBtn').addEventListener('click', resetReading);
    document.getElementById('saveBtn').addEventListener('click', saveReading);
    document.getElementById('downloadBtn').addEventListener('click', downloadCardsAsImage);
    document.getElementById('historyBackBtn').addEventListener('click', showMainMenu);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

    // 모달 버튼
    document.getElementById('customOkBtn').addEventListener('click', confirmCustomSpread);
    document.getElementById('customCancelBtn').addEventListener('click', () => {
        document.getElementById('customModal').classList.remove('active');
    });
    document.getElementById('detailCloseBtn').addEventListener('click', () => {
        document.getElementById('detailModal').classList.remove('active');
    });

    // AI 모달 버튼
    document.getElementById('aiBtn').addEventListener('click', promptAIPassword);
    document.getElementById('aiCloseBtn').addEventListener('click', () => {
        document.getElementById('aiModal').classList.remove('active');
    });

    // 비밀번호 모달 버튼
    document.getElementById('passwordOkBtn').addEventListener('click', validateAIPassword);
    document.getElementById('passwordCancelBtn').addEventListener('click', () => {
        document.getElementById('passwordModal').classList.remove('active');
        document.getElementById('passwordInput').value = '';
    });

    // 관리자 로그인 버튼
    document.getElementById('adminBtn').addEventListener('click', showAdminLogin);
    document.getElementById('adminLoginOkBtn').addEventListener('click', validateAdminPassword);
    document.getElementById('adminLoginCancelBtn').addEventListener('click', () => {
        document.getElementById('adminLoginModal').classList.remove('active');
        document.getElementById('adminPasswordInput').value = '';
    });

    // 관리자 패널 버튼
    document.getElementById('updatePasswordBtn').addEventListener('click', updateAIPassword);
    document.getElementById('adminPanelCloseBtn').addEventListener('click', () => {
        document.getElementById('adminPanelModal').classList.remove('active');
        document.getElementById('newPasswordInput').value = '';
    });

    // Enter 키로 비밀번호 입력
    document.getElementById('passwordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAIPassword();
    });
    document.getElementById('adminPasswordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validateAdminPassword();
    });
    document.getElementById('newPasswordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateAIPassword();
    });
}

// 화면 전환
function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function showMainMenu() {
    showScreen('mainMenu');
}

// 스프레드 선택
function selectSpread(spreadType) {
    if (spreadType === 'custom') {
        document.getElementById('customModal').classList.add('active');
        return;
    }

    const spread = SPREADS[spreadType];
    startReading(spread);
}

function confirmCustomSpread() {
    const count = parseInt(document.getElementById('customCount').value);
    if (count < 1 || count > 10) {
        alert('1~10 사이의 숫자를 입력하세요!');
        return;
    }

    const customSpread = {
        name: '커스텀',
        count: count,
        positions: Array.from({length: count}, (_, i) => `카드 ${i + 1}`)
    };

    document.getElementById('customModal').classList.remove('active');
    startReading(customSpread);
}

// 리딩 시작
function startReading(spread) {
    currentSpread = spread;
    currentCardIndex = 0;
    drawnCards = [];

    // 질문 입력 초기화
    const questionInput = document.getElementById('questionInput');
    if (questionInput) {
        questionInput.value = '';
    }

    // 카드 덱 초기화 및 셔플
    availableCards = [...ALL_CARDS];
    shuffleArray(availableCards);

    // UI 업데이트
    document.getElementById('readingTitle').textContent = `📖 ${spread.name}`;
    const wrapper = document.getElementById('cardsWrapper');
    wrapper.innerHTML = '';

    // 카드 슬롯 생성
    for (let i = 0; i < spread.count; i++) {
        const slot = document.createElement('div');
        slot.className = 'card-slot';

        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        card.dataset.revealed = 'false';

        // 카드 클릭 이벤트 추가
        card.addEventListener('click', () => drawCardAtIndex(i));

        const img = document.createElement('img');
        img.src = 'public/assets/card_back.png';
        img.alt = '카드 뒷면';

        card.appendChild(img);
        slot.appendChild(card);

        const position = document.createElement('div');
        position.className = 'card-position';
        position.textContent = spread.positions[i];
        slot.appendChild(position);

        wrapper.appendChild(slot);
    }

    // 버튼 초기화 - 카드 뽑기 버튼 숨기기
    const drawBtn = document.getElementById('drawBtn');
    drawBtn.style.display = 'none';

    // AI 해설 버튼과 다운로드 버튼 비활성화
    document.getElementById('aiBtn').disabled = true;
    document.getElementById('downloadBtn').disabled = true;

    document.getElementById('drawnCardsList').textContent = '뽑은 카드: ';

    showScreen('reading');
}

// 다음 카드 뽑기
function drawNextCard() {
    if (currentCardIndex >= currentSpread.count) {
        alert('모든 카드를 뽑았습니다!');
        return;
    }

    if (availableCards.length === 0) {
        alert('더 이상 뽑을 카드가 없습니다!');
        return;
    }

    // 랜덤 카드 선택
    const cardFile = availableCards.pop();
    const cardName = cardFile.replace('.jpg', '');

    // 카드 정보 저장
    drawnCards.push({
        position: currentSpread.positions[currentCardIndex],
        card: cardName,
        file: cardFile
    });

    // 카드 표시 (애니메이션)
    const cards = document.querySelectorAll('.card');
    const card = cards[currentCardIndex];

    card.classList.add('revealed');

    setTimeout(() => {
        const img = card.querySelector('img');
        img.src = `public/cards/${cardFile}`;
        img.alt = cardName;
    }, 300);

    // 뽑은 카드 목록 업데이트
    updateDrawnCardsList();

    // 다음 카드로
    currentCardIndex++;

    // AI 해설 버튼과 다운로드 버튼 활성화 (최소 1장 이상 뽑으면)
    if (currentCardIndex >= 1) {
        document.getElementById('aiBtn').disabled = false;
        document.getElementById('downloadBtn').disabled = false;
    }

    // 버튼 텍스트 업데이트
    const drawBtn = document.getElementById('drawBtn');
    const remaining = currentSpread.count - currentCardIndex;
    if (remaining > 0) {
        drawBtn.textContent = `🎴 카드 뽑기 (${remaining}장 남음)`;
    } else {
        drawBtn.textContent = '✅ 완료';
        drawBtn.disabled = true;
    }
}

// 특정 위치의 카드 뽑기 (클릭으로)
function drawCardAtIndex(index) {
    const cards = document.querySelectorAll('.card');
    const card = cards[index];

    // 이미 뽑힌 카드는 무시
    if (card.dataset.revealed === 'true') {
        return;
    }

    // 사용 가능한 카드가 없으면
    if (availableCards.length === 0) {
        alert('더 이상 뽑을 카드가 없습니다!');
        return;
    }

    // 랜덤 카드 선택
    const cardFile = availableCards.pop();
    const cardName = cardFile.replace('.jpg', '');

    // 카드 정보 저장
    drawnCards.push({
        position: currentSpread.positions[index],
        card: cardName,
        file: cardFile
    });

    // 카드 표시 (플립 애니메이션)
    card.classList.add('revealed');
    card.dataset.revealed = 'true';

    setTimeout(() => {
        const img = card.querySelector('img');
        img.src = `public/cards/${cardFile}`;
        img.alt = cardName;
    }, 400);

    // 뽑은 카드 목록 업데이트
    updateDrawnCardsList();

    // AI 해설 버튼과 다운로드 버튼 활성화
    if (drawnCards.length >= 1) {
        document.getElementById('aiBtn').disabled = false;
        document.getElementById('downloadBtn').disabled = false;
    }
}

function updateDrawnCardsList() {
    let text = '뽑은 카드: ';
    drawnCards.forEach(card => {
        text += `🃏 ${card.card} (${card.position})  `;
    });
    document.getElementById('drawnCardsList').textContent = text;
}

// 다시 뽑기
function resetReading() {
    if (confirm('다시 뽑으시겠습니까?')) {
        startReading(currentSpread);
    }
}

// 리딩 저장
function saveReading() {
    if (drawnCards.length === 0) {
        alert('뽑은 카드가 없습니다!');
        return;
    }

    const reading = {
        date: new Date().toLocaleString('ko-KR'),
        spread: currentSpread.name,
        cards: drawnCards
    };

    // LocalStorage에 저장
    const history = getHistory();
    history.unshift(reading);
    localStorage.setItem('tarotHistory', JSON.stringify(history));

    alert('리딩이 저장되었습니다!');
}

// 카드 이미지 다운로드
async function downloadCardsAsImage() {
    if (drawnCards.length === 0) {
        alert('뽑은 카드가 없습니다!');
        return;
    }

    try {
        // 임시 컨테이너 생성 (모든 카드가 보이도록)
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.top = '-10000px';
        tempContainer.style.left = '0';
        tempContainer.style.backgroundColor = '#0f172a';
        tempContainer.style.padding = '40px';
        tempContainer.style.display = 'flex';
        tempContainer.style.gap = '20px';
        tempContainer.style.alignItems = 'center';
        tempContainer.style.justifyContent = 'center';

        // 카드 개수에 따라 카드 크기 조절
        const cardCount = drawnCards.length;
        let cardWidth, cardHeight;

        if (cardCount <= 3) {
            cardWidth = 300;
            cardHeight = 500;
        } else if (cardCount <= 5) {
            cardWidth = 240;
            cardHeight = 400;
        } else if (cardCount <= 7) {
            cardWidth = 200;
            cardHeight = 333;
        } else {
            cardWidth = 160;
            cardHeight = 267;
        }

        // 각 카드를 임시 컨테이너에 추가
        drawnCards.forEach(cardData => {
            const cardDiv = document.createElement('div');
            cardDiv.style.width = cardWidth + 'px';
            cardDiv.style.height = cardHeight + 'px';
            cardDiv.style.border = '3px solid #fbbf24';
            cardDiv.style.borderRadius = '12px';
            cardDiv.style.overflow = 'hidden';
            cardDiv.style.backgroundColor = '#1e293b';
            cardDiv.style.flexShrink = '0';

            const img = document.createElement('img');
            img.src = `public/cards/${cardData.file}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.alt = cardData.card;

            cardDiv.appendChild(img);
            tempContainer.appendChild(cardDiv);
        });

        document.body.appendChild(tempContainer);

        // 이미지 로딩 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        // html2canvas로 캡처
        const canvas = await html2canvas(tempContainer, {
            backgroundColor: '#0f172a',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        // 임시 컨테이너 제거
        document.body.removeChild(tempContainer);

        // 캔버스를 이미지로 변환
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            link.download = `tarot-reading-${timestamp}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, 'image/png');

        alert('카드 이미지가 다운로드되었습니다!');
    } catch (error) {
        console.error('이미지 다운로드 실패:', error);
        alert('이미지 다운로드에 실패했습니다. 다시 시도해주세요.');
    }
}

// 히스토리 관리
function getHistory() {
    const stored = localStorage.getItem('tarotHistory');
    return stored ? JSON.parse(stored) : [];
}

function showHistory() {
    const history = getHistory();
    const list = document.getElementById('historyList');
    list.innerHTML = '';

    if (history.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #9ca3af; padding: 40px;">저장된 리딩이 없습니다.</p>';
    } else {
        history.forEach((reading, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-date">${reading.date}</div>
                <div class="history-spread">${reading.spread} (${reading.cards.length}장)</div>
            `;
            item.addEventListener('click', () => showReadingDetail(reading));
            list.appendChild(item);
        });
    }

    showScreen('history');
}

function showReadingDetail(reading) {
    const content = document.getElementById('detailContent');
    let html = `<strong>날짜:</strong> ${reading.date}<br>`;
    html += `<strong>스프레드:</strong> ${reading.spread}<br><br>`;
    html += '<strong>뽑은 카드:</strong><br>';

    reading.cards.forEach(card => {
        html += `• ${card.position}: ${card.card}<br>`;
    });

    content.innerHTML = html;
    document.getElementById('detailModal').classList.add('active');
}

function clearHistory() {
    if (confirm('모든 히스토리를 삭제하시겠습니까?')) {
        localStorage.removeItem('tarotHistory');
        showHistory();
    }
}

// 유틸리티
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function toggleMute() {
    isMuted = !isMuted;
    document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// AI 비밀번호 입력 프롬프트
function promptAIPassword() {
    if (drawnCards.length === 0) {
        alert('먼저 카드를 뽑아주세요!');
        return;
    }

    // 비밀번호 모달 열기
    document.getElementById('passwordModal').classList.add('active');
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').focus();
}

// AI 비밀번호 검증
async function validateAIPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();

    if (password.length !== 4) {
        alert('4자리 비밀번호를 입력해주세요.');
        return;
    }

    try {
        // 비밀번호 검증 API 호출
        const response = await fetch('/api/validate-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });

        const data = await response.json();

        if (data.valid) {
            // 비밀번호 모달 닫기
            document.getElementById('passwordModal').classList.remove('active');
            passwordInput.value = '';

            // AI 해석 실행
            showAIInterpretation();
        } else {
            alert('비밀번호가 틀렸습니다.\n\n비밀번호가 필요하신 경우\n010-7433-1947로 문자 주세요.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        alert('비밀번호 검증 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        console.error('Password validation error:', error);
    }
}

// 관리자 로그인 모달 열기
function showAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('active');
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminPasswordInput').focus();
}

// 관리자 비밀번호 검증
async function validateAdminPassword() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const password = passwordInput.value.trim();

    if (password.length !== 4) {
        alert('4자리 관리자 비밀번호를 입력해주세요.');
        return;
    }

    try {
        // 관리자 비밀번호 검증 API 호출
        const response = await fetch('/api/admin-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });

        const data = await response.json();

        if (data.valid) {
            // 로그인 모달 닫기
            document.getElementById('adminLoginModal').classList.remove('active');
            passwordInput.value = '';

            // 관리자 패널 열기
            showAdminPanel(data.current_ai_password);
        } else {
            alert('관리자 비밀번호가 틀렸습니다.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        alert('관리자 로그인 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        console.error('Admin login error:', error);
    }
}

// 관리자 패널 표시
function showAdminPanel(currentPassword) {
    document.getElementById('currentPassword').textContent = currentPassword;
    document.getElementById('adminPanelModal').classList.add('active');
    document.getElementById('newPasswordInput').value = '';
}

// AI 비밀번호 변경
async function updateAIPassword() {
    const newPasswordInput = document.getElementById('newPasswordInput');
    const newPassword = newPasswordInput.value.trim();

    if (newPassword.length !== 4) {
        alert('4자리 새 비밀번호를 입력해주세요.');
        return;
    }

    if (!/^\d{4}$/.test(newPassword)) {
        alert('비밀번호는 숫자 4자리여야 합니다.');
        return;
    }

    if (!confirm(`AI 비밀번호를 '${newPassword}'로 변경하시겠습니까?`)) {
        return;
    }

    try {
        // 비밀번호 변경 API 호출
        const response = await fetch('/api/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ new_password: newPassword })
        });

        const data = await response.json();

        if (data.success) {
            alert('AI 비밀번호가 성공적으로 변경되었습니다!');
            document.getElementById('currentPassword').textContent = newPassword;
            newPasswordInput.value = '';
        } else {
            alert('비밀번호 변경에 실패했습니다.\n' + (data.error || ''));
        }
    } catch (error) {
        alert('비밀번호 변경 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        console.error('Password update error:', error);
    }
}

// AI 해석 표시
async function showAIInterpretation() {
    if (drawnCards.length === 0) {
        alert('먼저 카드를 뽑아주세요!');
        return;
    }

    // 모달 열기
    const modal = document.getElementById('aiModal');
    const loadingText = document.getElementById('aiLoadingText');
    const content = document.getElementById('aiContent');

    modal.classList.add('active');
    loadingText.style.display = 'block';
    content.textContent = '';

    // 사용자 질문 가져오기
    const questionInput = document.getElementById('questionInput');
    const userQuestion = questionInput ? questionInput.value.trim() : '';

    try {
        // Vercel Serverless Function 호출
        const response = await fetch('/api/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spread_name: currentSpread.name,
                cards: drawnCards,
                question: userQuestion
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'AI 해석 생성 실패');
        }

        // 로딩 숨기고 결과 표시
        loadingText.style.display = 'none';
        content.textContent = data.interpretation;

    } catch (error) {
        loadingText.style.display = 'none';
        content.textContent = `AI 해석 생성 중 오류가 발생했습니다.\n\n오류: ${error.message}\n\n잠시 후 다시 시도해주세요.`;
    }
}

// ESC 키로 전체화면 종료
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// 앱 시작
init();
