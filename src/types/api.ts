// API Types based on API_DOCUMENTATION.md

export interface User {
  id: string;
  email: string;
  userName: string;
  role: 'USER' | 'ADMIN';
  isAdmin?: boolean;
  provider: string | null;
  createdAt: string;
  avatar: string;
}

export interface TourItinerary {
  id: string;
  hotSpot: HotSpot;
  order: number;
  activityDescription?: string;
  durationMinutes?: number;
}

export interface RatingStats {
  averageRating: number;
  totalReviews: number;
  breakdown?: Record<number, number>;
}

export interface Review {
  id: string;
  userId: string;
  tourId: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  user?: User;
}

export interface CreateReviewDto {
  tourId: string;
  rating: number;
  content: string;
  images?: string[];
}

export interface Tour {
  id: string;
  title: string;
  thumbnail: string;
  images: string[];
  description: string;
  content: string;
  priceUsd: number;
  duration: string;
  durationDays: number;
  departFrom: string;
  routes: string;
  type: string[];
  isFeatured: boolean;
  createdAt: string;
  itineraries?: TourItinerary[];
  suggestedVehicle?: Vehicle;
  suggestedVehicleId?: string | null;
  ratingStats?: RatingStats;
  reviews?: Review[];
  durationRange: string;
  discount: number;
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
  priceMin?: number;
  priceMax?: number;
  durationRange?: string;
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
  authorName: string;
  tags: string[];
  createdAt: string;
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
  description: string;
  thumbnail: string;
  icon: string;
  priceRange: string;
  duration: string;
  features: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  reviews: ServiceReview[];
  createdAt: string;
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
  accessToken: string;
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
  createdAt: string;
  updatedAt: string;
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
  openingHours: string;
  priceInfo: string;
  isHot: boolean;
  distance?: number;
  createdAt: string;
  updatedAt: string;
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
  imageUrl: string;
  thumbnail: string;
  capacity: number;
  pricePerKm: number;
  amenities: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleDto {
  model: string;
  type: string;
  capacity: number;
  pricePerKm: number;
  thumbnail?: string;
  amenities?: string[];
  isAvailable?: boolean;
}

export interface UpdateVehicleDto {
  model?: string;
  type?: string;
  capacity?: number;
  pricePerKm?: number;
  thumbnail?: string;
  amenities?: string[];
  isAvailable?: boolean;
}

export interface EstimateRouteRequest {
  hotSpotIds: string[];
  vehicleId: string;
  departureName?: string;
}

export interface EstimateRouteResponse {
  distance: number;
  duration: number;
  geometry: string;
  vehicle: {
    id: string;
    model: string;
    pricePerKm: number;
  };
  priceEstimateUsd: number;
  currency: string;
}

// API Error Response
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
