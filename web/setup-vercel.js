#!/usr/bin/env node
/**
 * Vercel 프로젝트 설정 자동화 스크립트
 * GitHub 자동 배포를 위한 Root Directory 및 Production Branch 설정
 */

const { execSync } = require('child_process');
const https = require('https');

// Vercel 프로젝트 정보
const PROJECT_ID = 'prj_AkdDGrCL4kVQuP5etEU1W8TtU0uw';
const TEAM_ID = 'team_TOSuQahA3RnJDFMeDOTuSvWY';

// Vercel CLI에서 토큰 가져오기 (환경 변수 또는 설정 파일에서)
function getVercelToken() {
    try {
        // Vercel CLI가 사용하는 토큰을 환경 변수에서 가져오기
        if (process.env.VERCEL_TOKEN) {
            return process.env.VERCEL_TOKEN;
        }

        // 또는 vercel whoami로 인증 확인
        execSync('vercel whoami', { stdio: 'pipe' });
        console.log('Vercel CLI에 로그인되어 있습니다.');

        // 임시 토큰 생성 또는 기존 토큰 사용
        console.log('\n⚠️  API 토큰이 필요합니다.');
        console.log('다음 단계를 따라주세요:');
        console.log('1. https://vercel.com/account/tokens 에서 새 토큰 생성');
        console.log('2. 토큰을 복사하고 다음 명령어 실행:');
        console.log('   export VERCEL_TOKEN="your-token-here"');
        console.log('   node setup-vercel.js');
        process.exit(1);
    } catch (error) {
        console.error('Vercel CLI 인증 오류:', error.message);
        process.exit(1);
    }
}

// Vercel API 호출
function callVercelAPI(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const token = getVercelToken();

        const options = {
            hostname: 'api.vercel.com',
            path: path,
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body || '{}'));
                } else {
                    reject(new Error(`API Error: ${res.statusCode} - ${body}`));
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// 프로젝트 설정 업데이트
async function updateProjectSettings() {
    try {
        console.log('🔧 Vercel 프로젝트 설정 업데이트 중...\n');

        // 프로젝트 설정 업데이트
        const updateData = {
            rootDirectory: 'web',
            framework: null,
            buildCommand: 'echo "No build needed"',
            devCommand: null,
            installCommand: 'echo "No install needed"',
            outputDirectory: '.',
            gitRepository: {
                type: 'github',
                repo: 'Cayson-Choi/tarot-card-reading'
            },
            productionBranch: 'master'
        };

        console.log('📝 업데이트할 설정:');
        console.log(JSON.stringify(updateData, null, 2));

        const result = await callVercelAPI(
            'PATCH',
            `/v9/projects/${PROJECT_ID}?teamId=${TEAM_ID}`,
            updateData
        );

        console.log('\n✅ 프로젝트 설정이 성공적으로 업데이트되었습니다!');
        console.log('\n설정 내용:');
        console.log(`- Root Directory: web`);
        console.log(`- Production Branch: master`);
        console.log(`- Git Repository: Cayson-Choi/tarot-card-reading`);
        console.log('\n이제 master 브랜치에 푸시할 때마다 자동으로 배포됩니다! 🚀');

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        process.exit(1);
    }
}

// 실행
updateProjectSettings();
