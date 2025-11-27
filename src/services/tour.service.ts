import { Tour, ToursResponse, TourFilter } from '@/types/api';

const API_BASE_URL = 'http://localhost:3001';

export const fetchTours = async (filter: TourFilter): Promise<ToursResponse> => {
  const params = new URLSearchParams();

  if (filter.q) params.append('q', filter.q);
  if (filter.price_min !== undefined) params.append('price_min', filter.price_min.toString());
  if (filter.price_max !== undefined) params.append('price_max', filter.price_max.toString());
  if (filter.duration_range) params.append('duration_range', filter.duration_range);
  if (filter.type) params.append('type', filter.type);
  if (filter.p) params.append('p', filter.p.toString());
  if (filter.r) params.append('r', filter.r.toString());

  const response = await fetch(`${API_BASE_URL}/tours?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tours');
  }

  return response.json();
};

export const fetchTourById = async (id: string): Promise<Tour> => {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tour details');
  }

  return response.json();
};
