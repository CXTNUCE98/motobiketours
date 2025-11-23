import { ref, computed } from 'vue'
import { authService } from '~/services/auth.service'
import { apiClient } from '~/services/api'
import type { User } from '~/types/api'

// Helper to decode JWT
function parseJwt(token: string) {
    try {
        if (!process.client) return null

        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))

        return JSON.parse(jsonPayload)
    } catch (e) {
        return null
    }
}

// Global auth state
const isAuthenticated = ref(authService.isAuthenticated())
const accessToken = ref(authService.getToken())
const user = ref<User | null>(null)

// Initialize user from token if available
if (process.client && accessToken.value) {
    const decoded = parseJwt(accessToken.value)
    if (decoded) {
        user.value = {
            id: decoded.sub || decoded.id,
            email: decoded.email,
            name: decoded.name || 'User',
            userName: decoded.username || 'User',
            role: decoded.role || 'USER',
            provider: null,
            created_at: '',
        }
    }
}

export function useAuth() {
    /**
     * Get auth headers for API requests
     */
    const getAuthHeaders = (): HeadersInit => {
        if (!accessToken.value) {
            return {}
        }

        return {
            Authorization: `Bearer ${accessToken.value}`,
        }
    }

    /**
     * Fetch full user profile from API
     */
    const fetchUserProfile = async () => {
        if (!accessToken.value) return

        try {
            const decoded = parseJwt(accessToken.value)
            const userId = decoded?.sub || decoded?.id

            if (userId) {
                const userData = await apiClient<User>(`/users/${userId}`, {
                    headers: getAuthHeaders()
                })
                user.value = userData
            }
        } catch (error) {
            console.error('Failed to fetch user profile', error)
        }
    }

    /**
     * Login user and update auth state
     */
    const login = (token: string) => {
        authService.setToken(token)
        accessToken.value = token
        isAuthenticated.value = true

        // Decode token to get user info immediately
        const decoded = parseJwt(token)
        if (decoded) {
            user.value = {
                id: decoded.sub || decoded.id,
                email: decoded.email,
                name: decoded.name || 'User',
                username: decoded.username || 'User',
                role: decoded.role || 'USER',
                provider: null,
                created_at: '',
            }
        }

        // Fetch full profile
        fetchUserProfile()
    }

    /**
     * Logout user and clear auth state
     */
    const logout = () => {
        authService.removeToken()
        accessToken.value = null
        isAuthenticated.value = false
        user.value = null
    }

    /**
     * Check if user is authenticated
     */
    const checkAuth = () => {
        const token = authService.getToken()
        isAuthenticated.value = !!token
        accessToken.value = token
        return isAuthenticated.value
    }

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
        fetchUserProfile
    }
}
