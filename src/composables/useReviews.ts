import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Review, CreateReviewDto } from '~/types/api';

/**
 * Hook lấy danh sách đánh giá của một tour
 * @param tourId ID của tour
 */
export const useTourReviewsQuery = (tourId: string | Ref<string>) => {
  return useQuery({
    queryKey: ['reviews', tourId],
    queryFn: async (): Promise<Review[]> => {
      return (await $motobikertoursApi('/reviews/tour/{tourId}', {
        path: { tourId: unref(tourId) },
      })) as Review[];
    },
    enabled: computed(() => !!unref(tourId)),
  });
};

/**
 * Hook tạo đánh giá mới
 * @param tourId ID của tour để invalidate cache
 */
export const useCreateReviewMutation = (tourId: string) => {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateReviewDto) => {
      return await $motobikertoursApi('/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data,
      });
    },
    onSuccess: () => {
      // Làm mới dữ liệu đánh giá và thông tin tour
      queryClient.invalidateQueries({ queryKey: ['reviews', tourId] });
      queryClient.invalidateQueries({ queryKey: ['tour', tourId] });
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });
};
