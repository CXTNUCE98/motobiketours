// Tour API Service - Complete implementation following TOURS_API_INTEGRATION_GUIDE.md
import axios from 'axios';
import { apiClient, getAuthHeaders, API_BASE_URL } from './api';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CreateTourDto {
    title: string;
    type: string;
    price_usd: number;
    duration: string;
    duration_range: number;
    depart_from: string;
    routes: string;
    description: string;
    content: string;
    thumbnail: string; // URL or empty if uploading file
    images: string[]; // URLs or empty if uploading files
    is_featured: boolean;
}

export interface UpdateTourDto extends Partial<CreateTourDto> { }

export interface Tour {
    id: string;
    title: string;
    thumbnail: string;
    images: string[];
    description: string;
    content: string;
    price_usd: number;
    duration: string;
    duration_range: number;
    depart_from: string;
    routes: string;
    type: string;
    is_featured: boolean;
    created_at: string;
}

export interface ToursResponse {
    data: Tour[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

export interface TourFilter {
    q?: string;
    price_min?: number;
    price_max?: number;
    duration_range?: string;
    type?: string;
    p?: number;
    r?: number;
    depart_from?: string;
}

// ============================================================================
// TOUR CRUD OPERATIONS
// ============================================================================

/**
 * Fetch tours with filters (GET /tours)
 */
export async function fetchTours(filters: TourFilter = {}): Promise<ToursResponse> {
    const params = new URLSearchParams();

    if (filters.q) params.append('q', filters.q);
    if (filters.price_min !== undefined) params.append('price_min', filters.price_min.toString());
    if (filters.price_max !== undefined) params.append('price_max', filters.price_max.toString());
    if (filters.duration_range) params.append('duration_range', filters.duration_range);
    if (filters.type) params.append('type', filters.type);
    if (filters.depart_from) params.append('depart_from', filters.depart_from);
    if (filters.p) params.append('p', filters.p.toString());
    if (filters.r) params.append('r', filters.r.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/tours?${queryString}` : '/tours';

    return apiClient<ToursResponse>(endpoint, {
        method: 'GET'
    });
}

/**
 * Fetch single tour by ID (GET /tours/:id)
 */
export async function fetchTourById(id: string): Promise<Tour> {
    return apiClient<Tour>(`/tours/${id}`, {
        method: 'GET'
    });
}

/**
 * Create a new tour (POST /tours)
 * Supports JSON or FormData (for image uploads)
 */
export async function createTour(
    data: CreateTourDto | FormData, 
    onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<Tour> {
    const isFormData = data instanceof FormData;

    if (!isFormData) {
        const errors = validateTourForm(data as CreateTourDto);
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }
    }

    const headers: Record<string, string> = { ...getAuthHeaders() };

    try {
        const response = await axios.post(`${API_BASE_URL}/tours`, data, {
            headers,
            onUploadProgress
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string | string[] } } };
            if (axiosError.response?.data) {
                const apiError = axiosError.response.data;
                const message = apiError.message || 'Failed to create tour';
                throw new Error(Array.isArray(message) ? message.join(', ') : String(message));
            }
        }
        throw error;
    }
}

/**
 * Update an existing tour (PATCH /tours/:id)
 */
export async function updateTour(
    id: string, 
    data: UpdateTourDto | FormData, 
    onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
): Promise<Tour> {
    const headers: Record<string, string> = { ...getAuthHeaders() };

    try {
        const response = await axios.patch(`${API_BASE_URL}/tours/${id}`, data, {
            headers,
            onUploadProgress
        });
        return response.data;
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string | string[] } } };
            if (axiosError.response?.data) {
                const apiError = axiosError.response.data;
                const message = apiError.message || 'Failed to update tour';
                throw new Error(Array.isArray(message) ? message.join(', ') : String(message));
            }
        }
        throw error;
    }
}

/**
 * Delete a tour (DELETE /tours/:id)
 */
export async function deleteTour(id: string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/tours/${id}`, {
        method: 'DELETE',
        headers: {
            ...getAuthHeaders()
        }
    });
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateTourForm(formData: CreateTourDto): string[] {
    const errors: string[] = [];
    if (!formData.title || formData.title.trim() === '') errors.push('Tour title is required');
    if (!formData.type) errors.push('Tour type is required');
    if (formData.price_usd === undefined || formData.price_usd === null) errors.push('Price is required');
    if (!formData.duration) errors.push('Duration is required');
    if (!formData.depart_from) errors.push('Departure location is required');
    if (!formData.routes) errors.push('Routes are required');
    if (!formData.description) errors.push('Description is required');
    if (!formData.content) errors.push('Content is required');
    return errors;
}

export function countWords(html: string): number {
    const text = html.replace(/<[^>]*>/g, '');
    const cleaned = text.trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).filter(word => word.length > 0).length;
}

export function generateSlug(title: string): string {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export default {
    fetchTours,
    fetchTourById,
    createTour,
    updateTour,
    deleteTour,
    validateTourForm,
    countWords,
    generateSlug
};
