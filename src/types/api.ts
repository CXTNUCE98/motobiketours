// API Types based on API_DOCUMENTATION.md

export interface User {
    id: string
    email: string
    name: string
    userName: string
    role: 'USER' | 'ADMIN'
    provider: string | null
    created_at: string
}

export interface Tour {
    id: string
    title: string
    slug: string
    thumbnail: string
    images: string[]
    description: string
    content: string
    price_usd: number
    duration: string
    depart_from: string
    routes: string
    type: string
    is_featured: boolean
    created_at: string
}

export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    thumbnail: string
    category: string
    author_name: string
    tags: string[]
    created_at: string
}

export interface Service {
    id: string
    title: string
    short_title: string
    description: string
    thumbnail: string
    icon: string
    price_range: string
    features: string[]
    created_at: string
}

// Auth DTOs
export interface RegisterDto {
    email: string
    password: string
    name: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface AuthResponse {
    access_token: string
}

export interface UpdateUserDto {
    name?: string
    email?: string
    password?: string
}

// API Error Response
export interface ApiError {
    statusCode: number
    message: string | string[]
    error?: string
}
