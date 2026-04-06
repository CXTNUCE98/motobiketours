import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Tour, CreateTourDto, UpdateTourDto } from '~/types/api';

/**
 * Mutation để tạo tour mới
 */
export const useCreateTourMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();

  return useMutation({
    mutationFn: async (data: CreateTourDto): Promise<Tour> => {
      return await $motobikertoursApi('/tours', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
    onError: (error) => {
      handleApiError(error, 'Create Tour');
    },
  });
};

/**
 * Mutation để cập nhật tour
 */
export const useUpdateTourMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTourDto }): Promise<Tour> => {
      return await $motobikertoursApi('/tours/{id}', {
        method: 'PATCH',
        body: data,
        path: { id },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tour', variables.id] });
    },
    onError: (error) => {
      handleApiError(error, 'Update Tour');
    },
  });
};

/**
 * Mutation để xóa tour
 */
export const useDeleteTourMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();

  return useMutation({
    mutationFn: async (id: string): Promise<{ message: string }> => {
      return await $motobikertoursApi('/tours/{id}', {
        method: 'DELETE',
        path: { id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
    onError: (error) => {
      handleApiError(error, 'Delete Tour');
    },
  });
};
