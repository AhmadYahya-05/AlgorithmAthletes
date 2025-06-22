const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    LOGOUT: `${API_BASE_URL}/auth/logout`
  },
  PROFILE: {
    GET: `${API_BASE_URL}/profile`,
    UPDATE: `${API_BASE_URL}/profile`
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    FRIENDS: `${API_BASE_URL}/users/friends`,
    ADD_FRIEND: (friendId) => `${API_BASE_URL}/users/friends/${friendId}`,
    REMOVE_FRIEND: (friendId) => `${API_BASE_URL}/users/friends/${friendId}`
  }
};

export default API_BASE_URL; 