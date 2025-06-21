const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
  },
  PROFILE: {
    UPDATE: `${API_BASE_URL}/profile`
  }
};

export default API_BASE_URL; 