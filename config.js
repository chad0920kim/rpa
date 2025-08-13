// config.js - GitHub Pages용 설정 파일
// ⚠️ 이 파일은 공개적으로 접근 가능하므로 민감한 정보를 포함하지 마세요

const CONFIG = {
    // Google Sheets 설정
    GOOGLE_SHEETS: {
        // 투어비스 Missing Call 데이터 시트
        TOURVIS_SPREADSHEET_ID: '15Pyx-yh-G8OmQPhAc7DVze6Yl6drTXf3wKIr1dB1cfE',
        TOURVIS_WORKSHEET_NAME: '미싱콜',
        
        // 사용자 관리 시트 (같은 스프레드시트의 다른 시트)
        USER_SPREADSHEET_ID: '15Pyx-yh-G8OmQPhAc7DVze6Yl6drTXf3wKIr1dB1cfE',
        USER_WORKSHEET_NAME: 'Users',
        
        // Google Sheets API 키 (읽기 전용 권한만)
        // 실제 사용시 본인의 API 키로 교체 필요
        API_KEY: 'YOUR_GOOGLE_SHEETS_API_KEY_HERE',
        
        // API 기본 URL
        API_BASE_URL: 'https://sheets.googleapis.com/v4/spreadsheets'
    },
    
    // 사용자 관리 설정
    USER_MANAGEMENT: {
        // Users 시트의 칼럼 구조 (A~K 칼럼으로 확장)
        COLUMNS: {
            ID: 0,           // A: 사용자 ID (자동생성)
            USERNAME: 1,     // B: 사용자명 (로그인 ID)
            PASSWORD_HASH: 2, // C: 비밀번호 해시
            NAME: 3,         // D: 실명
            EMAIL: 4,        // E: 이메일
            ROLE: 5,         // F: 권한 (admin, manager, user)
            CREATED_AT: 6,   // G: 생성일시
            LAST_LOGIN: 7,   // H: 마지막 로그인 일시
            STATUS: 8,       // I: 상태 (approved, pending, rejected)
            PHONE: 9,        // J: 연락처
            DEPARTMENT: 10   // K: 부서/팀
        },
        
        // 계정 상태
        STATUS: {
            APPROVED: 'approved',   // 승인됨 (활성 계정)
            PENDING: 'pending',     // 승인 대기중
            REJECTED: 'rejected'    // 거부됨
        },
        
        // 기본 관리자 계정 정보
        DEFAULT_ADMIN: {
            username: 'admin',
            password: 'admin123',
            name: '시스템 관리자',
            email: 'admin@tidesquare.com',
            role: 'admin',
            status: 'approved'
        },
        
        // 비밀번호 정책
        PASSWORD_POLICY: {
            MIN_LENGTH: 6,
            MAX_LENGTH: 20,
            REQUIRE_NUMBER: true,
            REQUIRE_SPECIAL: false
        }
    },
    
    // 세션 관리
    SESSION: {
        TOKEN_EXPIRE_HOURS: 8,
        STORAGE_KEY: 'tourvis_user_session',
        REMEMBER_ME_DAYS: 7
    },
    
    // API 설정 (실제 배포된 Apps Script URL 사용)
    API: {
        // Google Apps Script 웹앱 URL (실제 배포된 URL)
        APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzGB1drhTBjQAIOmg02iRtQWPR4x2TFSta-7ha5LXdt-nQu4HQkU2P_qlpsoWJaHEo/exec',
        
        // 사용할 API 타입 ('sheets_api' 또는 'apps_script')
        API_TYPE: 'apps_script',
        
        // 요청 타임아웃 (밀리초)
        TIMEOUT: 30000,
        
        // 재시도 횟수
        RETRY_COUNT: 3,
        
        // 엔드포인트 설정
        ENDPOINTS: {
            GET_USERS: '/users',
            ADD_USER: '/users',
            UPDATE_USER: '/users',
            DELETE_USER: '/users',
            GET_CALLS: '/calls',
            UPDATE_CALL: '/calls',
            GET_PENDING_REQUESTS: '/requests',
            APPROVE_REQUEST: '/approve',
            REJECT_REQUEST: '/reject',
            SUBMIT_ACCOUNT_REQUEST: '/request',
            TEST_CONNECTION: '/test'
        }
    },
    
    // 환경 설정
    ENVIRONMENT: {
        IS_GITHUB_PAGES: true,
        DEBUG_MODE: true,
        VERSION: '1.0.0'
    },
    
    // UI 설정
    UI: {
        // 대시보드 설정
        PAGE_SIZE: 50,
        AUTO_REFRESH_INTERVAL: 60000, // 1분
        TOAST_DURATION: 3000,
        
        // 로그인 화면 설정
        LOGIN: {
            COMPANY_NAME: '투어비스',
            SYSTEM_NAME: '항공(국제선) Missing Call 처리 시스템',
            COPYRIGHT: '© 2025 TideSquare. All rights reserved.',
            BACKGROUND_COLOR: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }
    }
};

// 유틸리티 함수들
const Utils = {
    // 간단한 해시 함수 (클라이언트용)
    simpleHash(text, salt = '') {
        const combined = text + salt + 'tourvis_salt_2025';
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit 정수로 변환
        }
        return Math.abs(hash).toString(36);
    },
    
    // UUID 생성
    generateUUID() {
        return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // 현재 시간 문자열
    getCurrentDateTime() {
        return new Date().toLocaleString('ko-KR');
    },
    
    // ⭐ 날짜만 표시 (YYYY-MM-DD)
    formatDateOnly(dateTimeStr) {
        try {
            if (!dateTimeStr) return '';
            
            // ISO 문자열에서 날짜 부분만 추출
            if (typeof dateTimeStr === 'string') {
                if (dateTimeStr.includes('T')) {
                    return dateTimeStr.split('T')[0];
                }
                // 이미 날짜만 있는 경우
                return dateTimeStr.split(' ')[0];
            }
            
            // Date 객체인 경우
            if (dateTimeStr instanceof Date) {
                return dateTimeStr.toISOString().split('T')[0];
            }
            
            return dateTimeStr;
        } catch (error) {
            console.error('날짜 포맷 오류:', error);
            return dateTimeStr || '';
        }
    },
    
    // ⭐ 시간만 표시 (HH:MM:SS)
    formatTimeOnly(dateTimeStr) {
        try {
            if (!dateTimeStr) return '';
            
            if (typeof dateTimeStr === 'string') {
                // ISO 문자열에서 시간 부분 추출
                if (dateTimeStr.includes('T')) {
                    const timePart = dateTimeStr.split('T')[1];
                    if (timePart) {
                        // +09:00이나 Z 제거하고 시간만
                        return timePart.split('+')[0].split('Z')[0].split('.')[0];
                    }
                }
                
                // 이미 시간만 있는 경우 (HH:MM:SS 형태)
                if (dateTimeStr.includes(':') && !dateTimeStr.includes('T')) {
                    return dateTimeStr.split('.')[0]; // 밀리초 제거
                }
                
                // 공백으로 분리된 날짜 시간 형태
                if (dateTimeStr.includes(' ') && dateTimeStr.includes(':')) {
                    const parts = dateTimeStr.split(' ');
                    const timePart = parts[parts.length - 1];
                    return timePart.split('.')[0];
                }
            }
            
            // Date 객체인 경우
            if (dateTimeStr instanceof Date) {
                return dateTimeStr.toTimeString().split(' ')[0];
            }
            
            return dateTimeStr || '';
        } catch (error) {
            console.error('시간 포맷 오류:', error);
            return dateTimeStr || '';
        }
    },
    
    // ⭐ 한국 시간으로 포맷 (YYYY-MM-DD HH:MM:SS)
    formatKoreanDateTime(dateTimeStr) {
        try {
            if (!dateTimeStr) return '';
            
            let date;
            if (typeof dateTimeStr === 'string') {
                date = new Date(dateTimeStr);
            } else if (dateTimeStr instanceof Date) {
                date = dateTimeStr;
            } else {
                return dateTimeStr;
            }
            
            // 유효한 날짜인지 확인
            if (isNaN(date.getTime())) {
                return dateTimeStr;
            }
            
            return date.toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('한국시간 포맷 오류:', error);
            return dateTimeStr || '';
        }
    },
    
    // ⭐ 날짜 시간 문자열 파싱 및 유효성 검사
    parseDateTime(dateTimeStr) {
        try {
            if (!dateTimeStr) return null;
            
            const date = new Date(dateTimeStr);
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            console.error('날짜시간 파싱 오류:', error);
            return null;
        }
    },
    
    // 이메일 유효성 검사
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // 비밀번호 유효성 검사
    isValidPassword(password) {
        const policy = CONFIG.USER_MANAGEMENT.PASSWORD_POLICY;
        
        if (password.length < policy.MIN_LENGTH || password.length > policy.MAX_LENGTH) {
            return { valid: false, message: `비밀번호는 ${policy.MIN_LENGTH}-${policy.MAX_LENGTH}자 사이여야 합니다.` };
        }
        
        if (policy.REQUIRE_NUMBER && !/\d/.test(password)) {
            return { valid: false, message: '비밀번호에는 숫자가 포함되어야 합니다.' };
        }
        
        if (policy.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return { valid: false, message: '비밀번호에는 특수문자가 포함되어야 합니다.' };
        }
        
        return { valid: true, message: '유효한 비밀번호입니다.' };
    },
    
    // 디버그 로그
    debugLog(...args) {
        if (CONFIG.ENVIRONMENT.DEBUG_MODE) {
            console.log('[DEBUG]', new Date().toISOString(), ...args);
        }
    },
    
    // Toast 메시지 표시
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        switch(type) {
            case 'success':
                toast.style.backgroundColor = '#10b981';
                break;
            case 'error':
                toast.style.backgroundColor = '#ef4444';
                break;
            case 'warning':
                toast.style.backgroundColor = '#f59e0b';
                break;
            default:
                toast.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(toast);
        
        // 애니메이션
        setTimeout(() => toast.style.opacity = '1', 100);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, CONFIG.UI.TOAST_DURATION);
    }
};

// 세션 관리 클래스
class SessionManager {
    static setSession(user, rememberMe = false) {
        const sessionData = {
            userId: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        localStorage.setItem(CONFIG.SESSION.STORAGE_KEY, JSON.stringify(sessionData));
        Utils.debugLog('Session set for user:', user.username);
    }
    
    static getSession() {
        try {
            const sessionData = localStorage.getItem(CONFIG.SESSION.STORAGE_KEY);
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            
            // 세션 만료 확인
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const diffHours = (now - loginTime) / (1000 * 60 * 60);
            
            const expireHours = session.rememberMe 
                ? CONFIG.SESSION.REMEMBER_ME_DAYS * 24 
                : CONFIG.SESSION.TOKEN_EXPIRE_HOURS;
            
            if (diffHours > expireHours) {
                this.clearSession();
                return null;
            }
            
            return session;
        } catch (error) {
            Utils.debugLog('Error getting session:', error);
            this.clearSession();
            return null;
        }
    }
    
    static clearSession() {
        localStorage.removeItem(CONFIG.SESSION.STORAGE_KEY);
        Utils.debugLog('Session cleared');
    }
    
    static isLoggedIn() {
        return this.getSession() !== null;
    }
    
    static getCurrentUser() {
        return this.getSession();
    }
    
    static hasRole(requiredRole) {
        const session = this.getSession();
        if (!session) return false;
        
        const roleHierarchy = { 'admin': 3, 'manager': 2, 'user': 1 };
        const userLevel = roleHierarchy[session.role] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        
        return userLevel >= requiredLevel;
    }
}

// Google Apps Script API 통신 클래스
class GoogleAppsScriptAPI {
    static async request(action, data = {}) {
        try {
            Utils.debugLog('API Request:', { action, data });
            
            const requestData = {
                action: action,
                ...data
            };
            
            const response = await fetch(CONFIG.API.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // CORS preflight 회피
                },
                body: JSON.stringify(requestData), // JSON 문자열로 전송
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            Utils.debugLog('API Response:', result);
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            return result;
        } catch (error) {
            Utils.debugLog('API Error:', error);
            throw error;
        }
    }
    
    // 함수 호출 (호환성을 위한 별칭)
    static async callFunction(action, data = {}) {
        return await this.request(action, data);
    }
    
    // 연결 테스트
    static async testConnection() {
        try {
            const result = await this.request('checkSystemStatus');
            return { success: true, message: '연결 성공', data: result };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    // 사용자 관련 API
    static async getUsers() {
        return await this.request('getUsers');
    }
    
    static async addUser(userData) {
        return await this.request('addUser', { userData });
    }
    
    static async updateUser(userId, userData) {
        return await this.request('updateUser', { userId, userData });
    }
    
    static async deleteUser(userId) {
        return await this.request('deleteUser', { userId });
    }
    
    static async authenticate(username, password) {
        return await this.request('authenticate', { username, password });
    }
    
    // 계정 신청 관련 API
    static async submitAccountRequest(requestData) {
        return await this.request('submitAccountRequest', requestData);
    }
    
    static async getPendingRequests() {
        return await this.request('getPendingRequests');
    }
    
    static async approveRequest(requestId, approvalData) {
        return await this.request('approveRequest', { requestId, approvalData });
    }
    
    static async rejectRequest(requestId, reason) {
        return await this.request('rejectRequest', { requestId, reason });
    }
    
    // Missing Call 관련 API
    static async getCalls(params = {}) {
        return await this.request('getCalls', params);
    }
    
    static async updateCall(callData) {
        return await this.request('updateCall', { callData });
    }
}

// Google Sheets API 통신 클래스 (백업용)
class GoogleSheetsAPI {
    static async readSheet(spreadsheetId, range) {
        try {
            const url = `${CONFIG.GOOGLE_SHEETS.API_BASE_URL}/${spreadsheetId}/values/${range}?key=${CONFIG.GOOGLE_SHEETS.API_KEY}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.values || [];
        } catch (error) {
            Utils.debugLog('Error reading sheet:', error);
            throw error;
        }
    }
}

// 연결 테스트 함수 (전역 함수로 정의)
async function testConnection() {
    try {
        Utils.showToast('연결 테스트 중...', 'info');
        
        if (CONFIG.API.API_TYPE === 'apps_script') {
            const result = await GoogleAppsScriptAPI.testConnection();
            
            if (result.success) {
                Utils.showToast('✅ 연결 성공!', 'success');
                Utils.debugLog('Connection test successful:', result);
            } else {
                Utils.showToast('❌ 연결 실패: ' + result.message, 'error');
                Utils.debugLog('Connection test failed:', result);
            }
            
            return result;
        } else {
            // Google Sheets API 테스트
            await GoogleSheetsAPI.readSheet(
                CONFIG.GOOGLE_SHEETS.TOURVIS_SPREADSHEET_ID,
                CONFIG.GOOGLE_SHEETS.TOURVIS_WORKSHEET_NAME + '!A1:B1'
            );
            
            Utils.showToast('✅ Google Sheets 연결 성공!', 'success');
            return { success: true, message: 'Google Sheets 연결 성공' };
        }
    } catch (error) {
        const errorMessage = error.message || '알 수 없는 오류';
        Utils.showToast('❌ 연결 실패: ' + errorMessage, 'error');
        Utils.debugLog('Connection test error:', error);
        return { success: false, message: errorMessage };
    }
}

// 설정 검증
function validateConfig() {
    const errors = [];
    
    // Apps Script 사용시에는 URL 확인
    if (CONFIG.API.API_TYPE === 'apps_script') {
        if (!CONFIG.API.APPS_SCRIPT_URL) {
            errors.push('Google Apps Script URL이 설정되지 않았습니다.');
        }
    } else {
        // Google Sheets API 사용시에만 API Key 확인
        if (!CONFIG.GOOGLE_SHEETS.API_KEY || 
            CONFIG.GOOGLE_SHEETS.API_KEY === 'YOUR_GOOGLE_SHEETS_API_KEY_HERE') {
            errors.push('Google Sheets API Key가 설정되지 않았습니다.');
        }
    }
    
    if (!CONFIG.GOOGLE_SHEETS.TOURVIS_SPREADSHEET_ID) {
        errors.push('스프레드시트 ID가 설정되지 않았습니다.');
    }
    
    if (errors.length > 0) {
        console.error('⚠️ 설정 오류가 있습니다:', errors);
        return false;
    }
    
    Utils.debugLog('✅ 설정 검증 완료 - API 타입:', CONFIG.API.API_TYPE);
    return true;
}

// 초기화 함수
function initializeApp() {
    Utils.debugLog('Initializing Tourvis Missing Call System...');
    
    // 설정 검증
    validateConfig();
    
    // 세션 확인
    const currentUser = SessionManager.getCurrentUser();
    if (currentUser) {
        Utils.debugLog('Current user session:', currentUser.username);
    }
    
    Utils.debugLog('App initialization complete');
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', initializeApp);

// 전역 객체로 내보내기
window.CONFIG = CONFIG;
window.Utils = Utils;
window.SessionManager = SessionManager;
window.GoogleAppsScriptAPI = GoogleAppsScriptAPI;
window.GoogleSheetsAPI = GoogleSheetsAPI;
window.testConnection = testConnection;
window.validateConfig = validateConfig;
window.initializeApp = initializeApp;
