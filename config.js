// config.js - GitHub Pages용 설정 파일
// ⚠️ 이 파일은 공개적으로 접근 가능하므로 민감한 정보를 포함하지 마세요

const CONFIG = {
    // Google Sheets 설정
    GOOGLE_SHEETS: {
        // 투어비스 Missing Call 데이터 시트
        TOURVIS_SPREADSHEET_ID: '15Pyx-yh-G8OmQPhAc7DVze6Yl6drTXf3wKIr1dB1cfE',
        TOURVIS_WORKSHEET_NAME: 'Sheet1',
        
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
        // Users 시트의 칼럼 구조 (A~H 칼럼)
        COLUMNS: {
            ID: 0,           // A: 사용자 ID (자동생성)
            USERNAME: 1,     // B: 사용자명 (로그인 ID)
            PASSWORD_HASH: 2, // C: 비밀번호 해시
            NAME: 3,         // D: 실명
            EMAIL: 4,        // E: 이메일
            ROLE: 5,         // F: 권한 (admin, manager, user)
            CREATED_AT: 6,   // G: 생성일시
            LAST_LOGIN: 7    // H: 마지막 로그인 일시
        },
        
        // 기본 관리자 계정 정보
        DEFAULT_ADMIN: {
            username: 'admin',
            password: 'admin123',
            name: '시스템 관리자',
            email: 'admin@tidesquare.com',
            role: 'admin'
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
    
    // API 설정
    API: {
        // Google Apps Script 웹앱 URL
        APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzGB1drhTBjQAIOmg02iRtQWPR4x2TFSta-7ha5LXdt-nQu4HQkU2P_qlpsoWJaHEo/exec',
        
        // 사용할 API 타입 ('sheets_api' 또는 'apps_script')
        API_TYPE: 'apps_script',
        
        // 요청 타임아웃 (밀리초)
        TIMEOUT: 30000,
        
        // 재시도 횟수
        RETRY_COUNT: 3
    },
    
    // API 설정
    API: {
        // Google Apps Script 웹앱 URL (배포 후 여기에 입력)
        APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
        
        // 사용할 API 타입 ('sheets_api' 또는 'apps_script')
        API_TYPE: 'apps_script',
        
        // 엔드포인트 설정
        ENDPOINTS: {
            GET_USERS: '/users',
            ADD_USER: '/users',
            UPDATE_USER: '/users',
            DELETE_USER: '/users',
            GET_CALLS: '/calls',
            UPDATE_CALL: '/calls'
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

// Google Sheets API 통신 클래스
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
    
    static async appendRow(spreadsheetId, range, values) {
        try {
            // Google Sheets API는 읽기 전용이므로 실제로는 업데이트할 수 없습니다.
            // 실제 구현에서는 Google Apps Script나 서버가 필요합니다.
            Utils.debugLog('Append row request:', { spreadsheetId, range, values });
            
            // Mock 응답 (실제 구현 필요)
            return { success: true, updatedRows: 1 };
        } catch (error) {
            Utils.debugLog('Error appending row:', error);
            throw error;
        }
    }
    
    static async updateRow(spreadsheetId, range, values) {
        try {
            // Google Sheets API는 읽기 전용이므로 실제로는 업데이트할 수 없습니다.
            Utils.debugLog('Update row request:', { spreadsheetId, range, values });
            
            // Mock 응답 (실제 구현 필요)
            return { success: true, updatedCells: values.length };
        } catch (error) {
            Utils.debugLog('Error updating row:', error);
            throw error;
        }
    }
}

// 설정 검증
function validateConfig() {
    const errors = [];
    
    // Apps Script 사용시에는 API Key가 필요없음
    if (CONFIG.API.API_TYPE === 'apps_script') {
        // Apps Script URL 확인
        if (!CONFIG.API.APPS_SCRIPT_URL || CONFIG.API.APPS_SCRIPT_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
            errors.push('Google Apps Script URL이 설정되지 않았습니다.');
        }
    } else {
        // Google Sheets API 사용시에만 API Key 확인
        if (!CONFIG.GOOGLE_SHEETS.API_KEY || CONFIG.GOOGLE_SHEETS.API_KEY === 'YOUR_GOOGLE_SHEETS_API_KEY_HERE') {
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

// 전역 객체로 내보내기
window.CONFIG = CONFIG;
window.Utils = Utils;
window.SessionManager = SessionManager;
window.GoogleSheetsAPI = GoogleSheetsAPI;
window.validateConfig = validateConfig;
