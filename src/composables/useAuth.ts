import { ref, computed, onMounted } from 'vue';
import type { User } from '~/types/api';

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

// Token storage key
const TOKEN_KEY = 'accessToken';

// Global auth state
const accessToken = ref<string | null>(process.client ? localStorage.getItem(TOKEN_KEY) : null);
const isAuthenticated = computed(() => !!accessToken.value);
const PROFILE_KEY = 'userProfile';
const user = ref<User | null>(null);
const isFetchingProfile = ref(false);

// Helper to save profile to cache
const saveProfileToCache = (userData: User) => {
  if (process.client) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(userData));
  }
};

/**
 * Update user state locally and in cache
 */
const updateUserLocal = (userData: User) => {
  user.value = userData;
  saveProfileToCache(userData);
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
  if (process.client && accessToken.value && !user.value) {
    const decoded = parseJwt(accessToken.value);
    if (decoded) {
      const cachedProfile = getProfileFromCache();
      const userId = decoded.sub || decoded.id;

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
};

// Initialize early without API call (safe outside Nuxt context)
initUserFromToken();

export function useAuth() {
  /**
   * Login user and update auth state
   */
  const login = (token: string) => {
    if (process.client) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    accessToken.value = token;

    // Fast init from new token
    initUserFromToken();

    // Fetch full profile
    fetchUserProfile(true);
  };

  // Only fetch profile on mount if we have an access token and haven't fetched recently
  onMounted(() => {
    // Only fetch if authenticated and no full profile data yet (beyond basic token info)
    // or if the profile is not being fetched currently
    if (accessToken.value && !isFetchingProfile.value && (!user.value || !user.value.createdAt)) {
      fetchUserProfile();
    }
  });

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
      accessToken.value = localStorage.getItem(TOKEN_KEY);
    }
    return !!accessToken.value;
  };

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
