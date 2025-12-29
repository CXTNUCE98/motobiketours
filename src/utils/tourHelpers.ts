import type { Tour } from '@/types/api';

/**
 * Get image URL from thumbnail
 * Handles both full URLs and Cloudinary image IDs
 */
export const getTourImageUrl = (thumbnail: string | null | undefined): string => {
  if (!thumbnail) return 'https://via.placeholder.com/800x600?text=No+Image';
  if (thumbnail.startsWith('http')) return thumbnail;
  return `https://res.cloudinary.com/daok0blh9/image/upload/v1764131273/${thumbnail}.jpg`;
};

/**
 * Convert price from USD to VND
 * Using approximate exchange rate (1 USD = 24,000 VND)
 */
const USD_TO_VND_RATE = 24000;
export const convertUsdToVnd = (priceUsd: number): number => {
  return Math.round(priceUsd * USD_TO_VND_RATE);
};

/**
 * Format duration string from API
 */
export const formatDuration = (duration: string): string => {
  if (!duration) return '';
  return duration;
};

/**
 * Get people count from routes or default
 */
export const getPeopleCount = (routes?: string): string => {
  // You can extract from routes or use default
  // For now, using a default value
  return '2-4';
};

/**
 * Transform API Tour to TourCard props format
 */
export const transformTourToCardProps = (tour: Tour) => {
  return {
    id: tour.id,
    image: getTourImageUrl(tour.thumbnail),
    title: tour.title,
    price: tour.priceUsd, // Pass USD price directly
    rating: tour.ratingStats?.averageRating || 5,
    duration: tour.duration || '',
    people: getPeopleCount(tour.routes),
    to: `/tour/${tour.id}`,
    badge: tour.type?.[0],
    showPeulisLabel: false,
    tags: tour.routes ? tour.routes.split(',').map((r) => r.trim()) : [],
  };
};

/**
 * Transform API Tour to TourCard props with optional discount
 */
export const transformTourToCardPropsWithDiscount = (tour: Tour, originalPrice?: number, discount?: number) => {
  const baseProps = transformTourToCardProps(tour);
  return {
    ...baseProps,
    originalPrice: originalPrice, // Pass USD price directly
    discount,
  };
};
