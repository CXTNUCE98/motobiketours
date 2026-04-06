import { computed, ref, unref, type Ref, type ComputedRef } from 'vue';
import { useQuery, keepPreviousData } from '@tanstack/vue-query';
import type { Tour, ToursResponse, TourFilter } from '~/types/api';
import { cleanObject } from '~/utils/api';

/**
 * Query lấy danh sách tour với bộ lọc
 */
export const useToursQuery = (filters: any, enabled: Ref<boolean> | ComputedRef<boolean> = ref(true)) => {
  return useQuery({
    queryKey: ['tours', computed(() => JSON.stringify(unref(filters)))],
    queryFn: async ({ signal }): Promise<ToursResponse> => {
      const res = await $motobikertoursApi('/tours', {
        query: cleanObject(unref(filters)),
        signal,
      });
      return res as ToursResponse;
    },
    placeholderData: keepPreviousData,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 min — tours change infrequently
  });
};

/**
 * Query lấy chi tiết tour theo ID
 */
export const useTourByIdQuery = (id: string | Ref<string>, options?: { light?: boolean }) => {
  const isLight = options?.light ?? false;

  return useQuery({
    queryKey: ['tour', id, { light: isLight }],
    queryFn: async ({ signal }): Promise<Tour> => {
      return (await $motobikertoursApi('/tours/{id}', {
        path: { id: unref(id) },
        query: isLight ? { light: 'true' } : {},
        signal,
      })) as Tour;
    },
    enabled: computed(() => !!unref(id)),
    staleTime: isLight ? 5 * 60 * 1000 : 2 * 60 * 1000, // Light mode cache longer (less data, changes less)
  });
};
