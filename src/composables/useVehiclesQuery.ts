import { useQuery } from '@tanstack/vue-query';
import type { Vehicle } from '~/types/api';

/**
 * Query lấy danh sách tất cả xe
 */
export const useVehiclesQuery = (options: { enabled?: MaybeRef<boolean> } = {}) => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      return (await $motobikertoursApi('/vehicles', {
        method: 'GET',
      })) as Vehicle[];
    },
    enabled: options.enabled,
    staleTime: 10 * 60 * 1000,  // 10 min — vehicles change rarely
    gcTime: 30 * 60 * 1000,    // 30 min — keep in memory longer
  });
};

/**
 * Query lấy chi tiết xe theo ID
 */
export const useVehicleQuery = (id: string | Ref<string>) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: async (): Promise<Vehicle> => {
      return (await $motobikertoursApi('/vehicles/{id}', {
        method: 'GET',
        path: { id: unref(id) },
      })) as Vehicle;
    },
    enabled: computed(() => !!unref(id)),
    staleTime: 10 * 60 * 1000, // 10 min — vehicle detail
  });
};
