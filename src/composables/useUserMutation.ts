import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { User, UpdateUserDto } from '~/types/api';

/**
 * Mutation để cập nhật thông tin người dùng
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }): Promise<User> => {
      return await $motobikertoursApi('/users/{id}', {
        method: 'PATCH',
        body: data,
        path: { id },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.id] });
    },
  });
};
