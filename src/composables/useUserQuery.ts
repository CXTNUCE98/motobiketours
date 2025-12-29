import { useQuery } from '@tanstack/vue-query';
import type { User } from '~/types/api';

/**
 * Query lấy thông tin profile người dùng hiện tại
 */
export const useUserProfileQuery = (userId: string | Ref<string | undefined>) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<User> => {
      return await $motobikertoursApi('/users/{id}', {
        path: { id: unref(userId) as string },
      });
    },
    enabled: computed(() => !!unref(userId) && isAuthenticated.value),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};
