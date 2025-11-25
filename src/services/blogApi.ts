// Blog API Service
const API_BASE_URL = 'http://localhost:3001'

// API Types
export interface UploadImageResponse {
    imageId: string
    url: string
    secureUrl: string
}

export interface CreateBlogRequest {
    name: string
    lang: string
    thumbnail: string
    shortDescription: string
    content: string
    tags: string[]
    numWords: number
    status: 'waiting' | 'published' | 'draft'
}

export interface BlogPost {
    id: string
    name: string
    slug: string
    lang: string
    thumbnail: string
    shortDescription: string
    content: string
    tags: string[]
    numWords: number
    status: string
    category: string | null
    author_name: string | null
    created_at: string
}

export interface ApiError {
    statusCode: number
    message: string | string[]
    error: string
}

/**
 * Upload image to server
 * @param file - Image file to upload
 * @returns Upload response with imageId and URLs
 */
export async function uploadImage(file: File): Promise<UploadImageResponse> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed')
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
        throw new Error('File size exceeds 2MB limit')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/blog/upload-image`, {
        method: 'POST',
        body: formData
    })

    if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message)
    }

    return response.json()
}

/**
 * Create a new blog post
 * @param data - Blog post data
 * @returns Created blog post
 */
export async function createBlog(data: CreateBlogRequest): Promise<BlogPost> {
    const response = await fetch(`${API_BASE_URL}/blog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const error: ApiError = await response.json()
        const errorMessage = Array.isArray(error.message)
            ? error.message.join(', ')
            : error.message

        // Handle specific error codes
        if (response.status === 409) {
            throw new Error('Blog with this name already exists. Please choose a different name.')
        }

        throw new Error(errorMessage)
    }

    return response.json()
}

/**
 * Count words in HTML content
 * @param html - HTML content
 * @returns Number of words
 */
export function countWords(html: string): number {
    // Remove HTML tags
    const text = html.replace(/<[^>]*>/g, '')
    // Remove extra whitespace
    const cleaned = text.trim()
    // Split by whitespace and count
    if (!cleaned) return 0
    return cleaned.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Validate blog form data
 * @param formData - Form data to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateBlogForm(formData: {
    title: string
    language: string
    thumbnailImageId: string
    shortDescription: string
    content: string
    tags: string[]
    status: string
}): string[] {
    const errors: string[] = []

    if (!formData.title || formData.title.trim() === '') {
        errors.push('Post name is required')
    }

    if (!formData.language) {
        errors.push('Please select a language')
    }

    if (!formData.thumbnailImageId) {
        errors.push('Please upload a thumbnail image')
    }

    if (!formData.shortDescription || formData.shortDescription.trim() === '') {
        errors.push('Short description is required')
    }

    if (!formData.content || formData.content === '<p><br></p>' || formData.content.trim() === '') {
        errors.push('Content is required')
    }

    if (!formData.tags || formData.tags.length === 0) {
        errors.push('Please add at least one tag')
    }

    const validStatuses = ['waiting', 'published', 'draft']
    if (!validStatuses.includes(formData.status)) {
        errors.push('Invalid status')
    }

    return errors
}
