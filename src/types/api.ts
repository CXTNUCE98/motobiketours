// API Types based on API_DOCUMENTATION.md

export interface User {
  id: string;
  email: string;
  userName: string;
  role: 'USER' | 'ADMIN';
  isAdmin?: boolean;
  provider: string | null;
  created_at: string;
  avatar: string;
}

export interface TourItinerary {
  id: string;
  hot_spot: HotSpot;
  order: number;
  activity_description?: string;
  duration_minutes?: number;
}

export interface Tour {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  description: string;
  content: string;
  price_usd: number;
  duration: string;
  duration_days: number;
  depart_from: string;
  routes: string;
  type: string[];
  is_featured: boolean;
  created_at: string;
  itineraries?: TourItinerary[];
  suggested_vehicle?: Vehicle;
  suggested_vehicle_id?: string | null;
}

export interface TourCardItem {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  duration: string;
  people: string;
  to?: string;
  badge?: string;
  tags: string[];
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
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  author_name: string;
  tags: string[];
  created_at: string;
}

export interface ServiceReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  short_title: string; // for compatibility
  description: string;
  thumbnail: string;
  icon: string;
  priceRange: string;
  price_range: string; // for compatibility
  duration: string;
  features: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  reviews: ServiceReview[];
  created_at: string;
}

// Auth DTOs
export interface RegisterDto {
  email: string;
  password: string;
  userName: string;
  isAdmin: boolean;
  avatar: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UpdateUserDto {
  userName?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  isAdmin?: boolean;
  avatar?: string;
}

// Comments
export interface CommentAuthor {
  authId: string;
  avatar: string;
  userName: string;
}

export interface Comment {
  id: string;
  blogId: string;
  content: string;
  author: CommentAuthor;
  parentId: string | null;
  likeCount: number;
  dislikeCount: number;
  replyCount: number;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface CreateCommentDto {
  blogId: string;
  content: string;
  author: CommentAuthor;
  parentId?: string;
}

export interface LikeCommentDto {
  userId: string;
  type: 'like' | 'dislike';
}

export interface LikeStatusResponse {
  hasLiked: boolean;
  hasDisliked: boolean;
  type: 'like' | 'dislike' | null;
}

export interface LikeActionResponse {
  message: string;
  action: 'added' | 'removed' | 'updated';
}

export interface HotSpot {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  opening_hours: string;
  price_info: string;
  is_hot: boolean;
  distance?: number;
  created_at: string;
  updated_at: string;
  nearby?: HotSpot[];
}

export interface GetHotSpotsQuery {
  lat?: number;
  lng?: number;
  category?: string;
}

export interface Vehicle {
  id: string;
  model: string;
  type: string;
  image_url: string;
  thumbnail: string;
  capacity: number;
  price_per_km: number;
  amenities: string[];
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleDto {
  model: string;
  type: string;
  capacity: number;
  price_per_km: number;
  thumbnail?: string;
  amenities?: string[];
  is_available?: boolean;
}

export interface UpdateVehicleDto {
  model?: string;
  type?: string;
  capacity?: number;
  price_per_km?: number;
  thumbnail?: string;
  amenities?: string[];
  is_available?: boolean;
}

export interface EstimateRouteRequest {
  hot_spot_ids: string[];
  vehicle_id: string;
  departure_name?: string;
}

export interface EstimateRouteResponse {
  distance: number;
  duration: number;
  geometry: string;
  vehicle: {
    id: string;
    model: string;
    price_per_km: number;
  };
  price_estimate_usd: number;
  currency: string;
}

// API Error Response
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
