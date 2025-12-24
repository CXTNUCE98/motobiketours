import { useQuery, keepPreviousData } from '@tanstack/vue-query';
import type { Tour, ToursResponse, TourFilter } from '~/types/api';
import { cleanObject } from '~/utils/api';

/**
 * Query lấy danh sách tour với bộ lọc
 */
export const useToursQuery = (filters: any) => {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: async (): Promise<ToursResponse> => {
      const res = await $motobikertoursApi('/tours', {
        query: cleanObject(unref(filters)),
      });
      return res as ToursResponse;
    },
    placeholderData: keepPreviousData,
  });
};

/**
 * Query lấy chi tiết tour theo ID
 */
export const useTourByIdQuery = (id: string | Ref<string>) => {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: async (): Promise<Tour> => {
      return (await $motobikertoursApi('/tours/{id}', {
        path: { id: unref(id) },
      })) as Tour;
    },
    enabled: computed(() => !!unref(id)),
  });
};
