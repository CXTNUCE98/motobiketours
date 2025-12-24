import { useQuery } from '@tanstack/vue-query';
import type { Service } from '~/types/api';
import { cleanObject } from '~/utils/api';

/**
 * Query lấy danh sách dịch vụ
 */
export const useServicesQuery = (filters: any = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: async (): Promise<any> => {
      return await $motobikertoursApi('/services', {
        query: cleanObject(unref(filters)),
      });
    },
  });
};

/**
 * Query lấy chi tiết dịch vụ theo ID
 */
export const useServiceByIdQuery = (id: string | Ref<string>) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async (): Promise<Service> => {
      return await $motobikertoursApi('/services/{id}', {
        path: { id: unref(id) },
      });
    },
    enabled: computed(() => !!unref(id)),
  });
};
