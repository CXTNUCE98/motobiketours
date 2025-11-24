import type { LoginDto, RegisterDto, AuthResponse } from '~/types/api'
import { apiClient } from './api'

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterDto): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    /**
     * Login user
     */
    async login(data: LoginDto): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    },

    /**
     * Store auth token in localStorage
     */
    setToken(token: string): void {
        if (process.client) {
            localStorage.setItem('access_token', token)
        }
    },

    /**
     * Get auth token from localStorage
     */
    getToken(): string | null {
        if (process.client) {
            return localStorage.getItem('access_token')
        }
        return null
    },

    /**
     * Remove auth token from localStorage
     */
    removeToken(): void {
        if (process.client) {
            localStorage.removeItem('access_token')
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken()
    },
}
