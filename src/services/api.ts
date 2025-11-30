// API Configuration
// Use environment variable with fallback to localhost for development
export const API_BASE_URL = 
  process.env.NUXT_PUBLIC_API_BASE || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://motobikertours-api.vercel.app' 
    : 'http://localhost:3001');

// API Client with error handling
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json();
      throw {
        statusCode: response.status,
        message: error.message || 'An error occurred',
        error: error.error,
      };
    }

    return await response.json();
  } catch (error: unknown) {
    // Re-throw API errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    // Handle network errors
    throw {
      statusCode: 0,
      message: 'Network error. Please check your connection.',
      error: 'NETWORK_ERROR',
    };
  }
}

// Helper to add auth token to requests
export function getAuthHeaders(): HeadersInit {
  if (!process.client) {
    return {};
  }

  const token = localStorage.getItem('access_token');

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}
