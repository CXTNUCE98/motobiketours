import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Tour } from '~/types/api';

/**
 * Hook lấy danh sách yêu thích của người dùng hiện tại
 */
export const useWishlistQuery = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async (): Promise<Tour[]> => {
      const { getAuthHeaders } = useAuth();
      return (await $motobikertoursApi('/wishlist', {
        method: 'GET',
        headers: getAuthHeaders(),
      })) as Tour[];
    },
    enabled: computed(() => isAuthenticated.value),
    staleTime: 2 * 60 * 1000, // 2 min — wishlist
  });
};

/**
 * Hook kiểm tra trạng thái yêu thích của một tour
 */
export const useIsWishlistedQuery = (tourId: string | Ref<string>) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['wishlist-check', tourId],
    queryFn: async (): Promise<{ isWishlisted: boolean }> => {
      const { getAuthHeaders } = useAuth();
      return (await $motobikertoursApi('/wishlist/check/{tourId}', {
        path: { tourId: unref(tourId) },
        headers: getAuthHeaders(),
      })) as { isWishlisted: boolean };
    },
    enabled: computed(() => !!unref(tourId) && isAuthenticated.value),
    staleTime: 5 * 60 * 1000, // 5 min — wishlist check status
  });
};

/**
 * Hook thêm/xóa tour khỏi danh sách yêu thích
 */
export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: async (tourId: string) => {
      const { getAuthHeaders } = useAuth();
      return await $motobikertoursApi('/wishlist/toggle/{tourId}', {
        method: 'POST',
        path: { tourId },
        headers: getAuthHeaders(),
      });
    },
    onMutate: async (tourId) => {
      // Cancel outgoing refetches to avoid race conditions
      await queryClient.cancelQueries({ queryKey: ['wishlist-check', tourId] });
      await queryClient.cancelQueries({ queryKey: ['wishlist-bulk'] });

      // Snapshot current cache
      const previousIndividual = queryClient.getQueryData(['wishlist-check', tourId]);
      const previousBulk = queryClient.getQueryData(['wishlist-bulk']);

      // Optimistically update individual query
      queryClient.setQueryData(['wishlist-check', tourId], (old: { isWishlisted: boolean } | undefined) => {
        if (!old) return old;
        return { ...old, isWishlisted: !old.isWishlisted };
      });

      // Optimistically update bulk query
      if (previousBulk) {
        queryClient.setQueryData(['wishlist-bulk'], (old: Record<string, boolean> | undefined) => {
          if (!old) return old;
          return { ...old, [tourId]: !old[tourId] };
        });
      }

      return { previousIndividual, previousBulk };
    },
    onError: (_, tourId, context: any) => {
      // Roll back on error
      if (context?.previousIndividual) {
        queryClient.setQueryData(['wishlist-check', tourId], context.previousIndividual);
      }
      if (context?.previousBulk) {
        queryClient.setQueryData(['wishlist-bulk'], context.previousBulk);
      }
    },
    onSuccess: (_, tourId) => {
      // Invalidate all related queries to sync with server
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', tourId] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-bulk'] });
    },
  });
};

/**
 * Hook lấy số lượng tour trong danh sách yêu thích
 */
export const useWishlistCountQuery = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['wishlist-count'],
    queryFn: async (): Promise<number> => {
      const { getAuthHeaders } = useAuth();
      const res = (await $motobikertoursApi('/wishlist/count', {
        method: 'GET',
        headers: getAuthHeaders(),
      })) as { count: number };
      return res.count;
    },
    enabled: computed(() => isAuthenticated.value),
    staleTime: 60 * 1000, // 1 min — wishlist count
  });
};

/**
 * Hook kiểm tra trạng thái wishlist cho nhiều tour cùng lúc (batch)
 * @param tourIds Danh sách ID tour cần kiểm tra
 */
export const useWishlistBulkQuery = (tourIds: string[] | Ref<string[]>) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['wishlist-bulk', computed(() => unref(tourIds))],
    queryFn: async (): Promise<Record<string, boolean>> => {
      const { getAuthHeaders } = useAuth();
      const res = (await $motobikertoursApi('/wishlist/check-bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: { tourIds: unref(tourIds) },
      })) as { wishlistStatus: Record<string, boolean> };
      return res.wishlistStatus;
    },
    enabled: computed(
      () => !!unref(tourIds).length && isAuthenticated.value,
    ),
    staleTime: 2 * 60 * 1000, // 2 min — bulk wishlist check
  });
};
