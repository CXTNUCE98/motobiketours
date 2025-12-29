import { computed } from 'vue';
import type { User } from '~/types/api';

// Token storage key
const TOKEN_KEY = 'accessToken';
const PROFILE_KEY = 'userProfile';

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

export function useAuth() {
  // Use useState for shared state across components
  const accessToken = useState<string | null>('auth_accessToken', () => null);
  const user = useState<User | null>('auth_user', () => null);
  const isFetchingProfile = useState<boolean>('auth_isFetchingProfile', () => false);

  const isAuthenticated = computed(() => !!accessToken.value);

  // Helper to save profile to cache
  const saveProfileToCache = (userData: User) => {
    if (process.client) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(userData));
    }
  };

  // Helper to get profile from cache
  const getProfileFromCache = (): User | null => {
    if (!process.client) return null;
    const cached = localStorage.getItem(PROFILE_KEY);
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  };

  /**
   * Update user state locally and in cache
   */
  const updateUserLocal = (userData: User) => {
    user.value = userData;
    saveProfileToCache(userData);
  };

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
  const fetchUserProfile = async (force = false) => {
    if (!accessToken.value || (isFetchingProfile.value && !force)) return;

    try {
      isFetchingProfile.value = true;
      const decoded = parseJwt(accessToken.value);
      const userId = decoded?.sub || decoded?.id;

      if (userId) {
        const userData = await $motobikertoursApi('/users/{id}', {
          headers: getAuthHeaders(),
          path: { id: userId },
        });
        const updatedUser = userData as unknown as User;
        user.value = updatedUser;
        saveProfileToCache(updatedUser);
      }
    } catch (error) {
      console.log('Failed to fetch user profile', error);
    } finally {
      isFetchingProfile.value = false;
    }
  };

  // Initial state from token (client-side only)
  const initUserFromToken = () => {
    if (process.client && accessToken.value) {
      const decoded = parseJwt(accessToken.value);
      if (decoded) {
        const cachedProfile = getProfileFromCache();
        const userId = decoded.sub || decoded.id;

        // If we don't have a user yet, or the cached user matches the token
        if (!user.value) {
          if (cachedProfile && cachedProfile.id === userId) {
            user.value = cachedProfile;
          } else {
            user.value = {
              id: userId,
              email: decoded.email,
              userName: decoded.userName || 'User',
              role: decoded.role || 'USER',
              provider: null,
              avatar: decoded.avatar,
              createdAt: '',
            } as User;
          }
        }
      }
    }
  };

  /**
   * Login user and update auth state
   */
  const login = (token: string) => {
    if (process.client) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    accessToken.value = token;
    initUserFromToken();
    fetchUserProfile(true);
  };

  /**
   * Logout user and clear auth state
   */
  const logout = () => {
    if (process.client) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(PROFILE_KEY);
    }
    accessToken.value = null;
    user.value = null;
  };

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    if (process.client) {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && token !== accessToken.value) {
        accessToken.value = token;
        initUserFromToken();
      }
    }
    return !!accessToken.value;
  };

  // Initialize on client side if needed
  if (process.client && !accessToken.value) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      accessToken.value = token;
      initUserFromToken();
      // Optionally fetch profile in background
      if (!isFetchingProfile.value && (!user.value || !user.value.createdAt)) {
        fetchUserProfile();
      }
    }
  }

  return {
    // State
    isAuthenticated,
    accessToken: computed(() => accessToken.value),
    user: computed(() => user.value),

    // Methods
    login,
    logout,
    checkAuth,
    getAuthHeaders,
    fetchUserProfile,
    updateUserLocal,
  };
}
