import { useQuery } from '@tanstack/vue-query';
import type { BlogPost } from '~/types/api';
import { cleanObject } from '~/utils/api';

/**
 * Query lấy danh sách bài viết blog
 */
export const useBlogsQuery = (filters: any = {}) => {
  return useQuery({
    queryKey: ['blogs', filters],
    queryFn: async (): Promise<any> => {
      return await $motobikertoursApi('/blog', {
        query: cleanObject(unref(filters)),
      });
    },
  });
};

/**
 * Query lấy chi tiết bài viết blog theo ID
 */
export const useBlogByIdQuery = (id: string | Ref<string>) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async (): Promise<BlogPost> => {
      return await $motobikertoursApi('/blog/{id}', {
        path: { id: unref(id) },
      });
    },
    enabled: computed(() => !!unref(id)),
  });
};
