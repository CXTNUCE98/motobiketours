export interface Photo {
  id: string;
  title: string;
  src: string | string[];
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  excerpt: string;
  youtubeId: string;
}

export interface News {
  id: string;
  title: string;
  thumbnail?: string; // Optional because mockup.ts uses 'thumbnail', homeData uses 'image'
  image?: string; // Support both temporarily or standardise
  date: string;
  excerpt?: string;
  description?: string;
  content?: string[];
  contentHtml?: string;
  views?: number;
  to?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
}

export interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  videoThumb: string;
}

export interface ServiceReview {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  thumbnail: string;
  icon: string;
  features: string[];
  priceRange: string;
  priceUsd: number;
  priceUnit: 'day' | 'person' | 'trip' | 'contact';
  duration?: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  reviews: ServiceReview[];
}
