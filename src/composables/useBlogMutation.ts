import { useMutation, useQueryClient } from '@tanstack/vue-query';

/**
 * Mutation tạo bài viết blog mới
 */
export const useCreateBlogMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any): Promise<any> => {
      return await $motobikertoursApi('/blog', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

/**
 * Mutation tạo comment mới
 */
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any): Promise<any> => {
      return await $motobikertoursApi('/comments', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.blogId] });
    },
  });
};

/**
 * Mutation xóa comment
 */
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }): Promise<any> => {
      return await $motobikertoursApi('/comments/{id}', {
        method: 'DELETE',
        path: { id },
        query: { userId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
