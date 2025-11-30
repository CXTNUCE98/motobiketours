import { ref, computed } from 'vue';
import { authService } from '~/services/auth.service';
import { apiClient } from '~/services/api';
import type { User } from '~/types/api';
import { logger } from '~/utils/logger';

// Helper to decode JWT
function parseJwt(token: string) {
  try {
    if (!process.client) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Global auth state
const isAuthenticated = ref(authService.isAuthenticated());
const accessToken = ref(authService.getToken());
const user = ref<User | null>(null);

/**
 * Get auth headers for API requests
 */
const getAuthHeaders = (): HeadersInit => {
  if (!accessToken.value) {
    return {};
  }

  return {
    Authorization: `Bearer ${accessToken.value}`,
  };
};

/**
 * Fetch full user profile from API
 */
const fetchUserProfile = async () => {
  if (!accessToken.value) return;

  try {
    const decoded = parseJwt(accessToken.value);
    const userId = decoded?.sub || decoded?.id;

    if (userId) {
      const userData = await apiClient<User>(`/users/${userId}`, {
        headers: getAuthHeaders(),
      });
      user.value = userData;
    }
  } catch (error) {
    logger.error('Failed to fetch user profile', error);
  }
};

// Initialize user from token if available
if (process.client && accessToken.value) {
  const decoded = parseJwt(accessToken.value);
  if (decoded) {
    // Set initial state from token (fast, but maybe stale)
    user.value = {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      userName: decoded.userName || 'User',
      role: decoded.role || 'USER',
      provider: null,
      avatar: decoded.avatar,
      created_at: '', // Placeholder until fetch
    } as User;

    // Fetch fresh data from API to update avatar and other details
    fetchUserProfile();
  }
}

export function useAuth() {
  /**
   * Login user and update auth state
   */
  const login = (token: string) => {
    authService.setToken(token);
    accessToken.value = token;
    isAuthenticated.value = true;

    // Fetch full profile
    fetchUserProfile();
  };

  /**
   * Logout user and clear auth state
   */
  const logout = () => {
    authService.removeToken();
    accessToken.value = null;
    isAuthenticated.value = false;
    user.value = null;
  };

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    const token = authService.getToken();
    isAuthenticated.value = !!token;
    accessToken.value = token;
    return isAuthenticated.value;
  };

  return {
    // State
    isAuthenticated: computed(() => isAuthenticated.value),
    accessToken: computed(() => accessToken.value),
    user: computed(() => user.value),

    // Methods
    login,
    logout,
    checkAuth,
    getAuthHeaders,
    fetchUserProfile,
  };
}
