const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
  },
  VIDEO: {
    UPLOAD: `${API_BASE_URL}/video/upload`,
    ANALYZE: (analysisId) => `${API_BASE_URL}/video/analyze/${analysisId}`,
    GET_ANALYSIS: (analysisId) => `${API_BASE_URL}/video/analysis/${analysisId}`,
    GET_HISTORY: `${API_BASE_URL}/video/history`
  }
};

export default API_BASE_URL; 