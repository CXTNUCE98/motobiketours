import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { User, UpdateUserDto } from '~/types/api';

/**
 * Mutation để cập nhật thông tin người dùng
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }): Promise<User> => {
      return await $motobikertoursApi('/users/{id}', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: data,
        path: { id },
      });
    },
    onSuccess: (data, variables) => {
      const updatedUser = { ...data };
      queryClient.setQueryData(['user-profile', variables.id], updatedUser);
    },
    onError: (error) => {
      handleApiError(error, 'Update User');
    },
  });
};
