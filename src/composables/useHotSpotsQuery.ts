import { useQuery, keepPreviousData } from '@tanstack/vue-query';
import type { HotSpot, GetHotSpotsQuery } from '~/types/api';
import { cleanObject } from '~/utils/api';

/**
 * Query lấy danh sách địa điểm Hot
 */
export const useHotSpotsQuery = (params: MaybeRef<GetHotSpotsQuery>) => {
  return useQuery({
    queryKey: ['hot-spots', computed(() => JSON.stringify(unref(params)))],
    queryFn: async (): Promise<HotSpot[]> => {
      return (await $motobikertoursApi('/hot-spots', {
        query: cleanObject(unref(params)),
      })) as HotSpot[];
    },
    placeholderData: keepPreviousData,
  });
};

/**
 * Query lấy chi tiết địa điểm theo ID
 */
export const useHotSpotByIdQuery = (id: string | Ref<string>) => {
  return useQuery({
    queryKey: ['hot-spot', id],
    queryFn: async (): Promise<HotSpot> => {
      return (await $motobikertoursApi('/hot-spots/{id}', {
        path: { id: unref(id) },
      })) as HotSpot;
    },
    enabled: computed(() => !!unref(id)),
  });
};
