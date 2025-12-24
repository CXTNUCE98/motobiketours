import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Tour } from '~/types/api';

/**
 * Mutation để tạo tour mới
 */
export const useCreateTourMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any): Promise<Tour> => {
      return await $motobikertoursApi('/tours', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });
};

/**
 * Mutation để cập nhật tour
 */
export const useUpdateTourMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }): Promise<Tour> => {
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
  });
};

/**
 * Mutation để xóa tour
 */
export const useDeleteTourMutation = () => {
  const queryClient = useQueryClient();

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
  });
};

/**
 * Mutation để upload ảnh
 */
export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<any> => {
      const formData = new FormData();
      formData.append('file', file);
      return await $motobikertoursApi('/blog/upload-image', {
        method: 'POST',
        body: formData as any,
      });
    },
  });
};
