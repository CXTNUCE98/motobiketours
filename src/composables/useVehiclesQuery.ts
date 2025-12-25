import { useQuery } from '@tanstack/vue-query';
import type { Vehicle } from '~/types/api';

/**
 * Query lấy danh sách tất cả xe
 */
export const useVehiclesQuery = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      return (await $motobikertoursApi('/vehicles', {
        method: 'GET',
      })) as Vehicle[];
    },
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
  });
};
