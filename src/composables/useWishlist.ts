import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Tour } from '~/types/api';
import { useAuth } from '~/composables/useAuth';

/**
 * Hook lấy danh sách yêu thích của người dùng hiện tại
 */
export const useWishlistQuery = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async (): Promise<Tour[]> => {
      const { getAuthHeaders } = useAuth();
      return (await $motobikertoursApi('/wishlist', {
        method: 'GET',
        headers: getAuthHeaders(),
      })) as Tour[];
    },
  });
};

/**
 * Hook kiểm tra trạng thái yêu thích của một tour
 */
export const useIsWishlistedQuery = (tourId: string | Ref<string>) => {
  return useQuery({
    queryKey: ['wishlist-check', tourId],
    queryFn: async (): Promise<{ isWishlisted: boolean }> => {
      const { getAuthHeaders } = useAuth();
      return (await $motobikertoursApi('/wishlist/check/{tourId}', {
        path: { tourId: unref(tourId) },
        headers: getAuthHeaders(),
      })) as { isWishlisted: boolean };
    },
    enabled: computed(() => !!unref(tourId)),
  });
};

/**
 * Hook thêm/xóa tour khỏi danh sách yêu thích
 */
export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tourId: string) => {
      const { getAuthHeaders } = useAuth();
      return await $motobikertoursApi('/wishlist/toggle/{tourId}', {
        method: 'POST',
        path: { tourId },
        headers: getAuthHeaders(),
      });
    },
    onSuccess: (_, tourId) => {
      // Làm mới danh sách và trạng thái check
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', tourId] });
    },
  });
};
