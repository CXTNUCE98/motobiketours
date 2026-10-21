import { useMutation, useQueryClient } from '@tanstack/vue-query';

/**
 * Mutation tạo comment mới
 */
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();

  return useMutation({
    mutationFn: async (data: { blogId: string; content: string; authorId?: string }): Promise<any> => {
      return await $motobikertoursApi('/comments', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.blogId] });
    },
    onError: (error) => {
      handleApiError(error, 'Create Comment');
    },
  });
};

/**
 * Mutation xóa comment
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError } = useErrorHandler();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }): Promise<{ message: string }> => {
      return await $motobikertoursApi('/comments/{id}', {
        method: 'DELETE',
        path: { id },
        query: { userId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      handleApiError(error, 'Delete Comment');
    },
  });
};
