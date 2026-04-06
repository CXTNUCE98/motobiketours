import { computed, unref, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { Service } from '~/types/api';
import { cleanObject } from '~/utils/api';

export interface ServicesResponse {
  data: Service[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Query lấy danh sách dịch vụ
 */
export const useServicesQuery = (filters: any = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: async (): Promise<ServicesResponse> => {
      return (await $motobikertoursApi('/services', {
        query: cleanObject(unref(filters)),
      })) as ServicesResponse;
    },
    staleTime: 10 * 60 * 1000, // 10 min — services change rarely
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
    staleTime: 5 * 60 * 1000, // 5 min — service detail
  });
};
