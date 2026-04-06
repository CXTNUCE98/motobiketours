import { computed, unref, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { BlogPost } from '~/types/api';
import { cleanObject } from '~/utils/api';

export interface BlogsResponse {
  data: BlogPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * Query lấy danh sách bài viết blog
 */
export const useBlogsQuery = (filters: any = {}) => {
  return useQuery({
    queryKey: ['blogs', filters],
    queryFn: async (): Promise<BlogsResponse> => {
      return (await $motobikertoursApi('/blog', {
        query: cleanObject(unref(filters)),
      })) as BlogsResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 min — blogs change moderately
  });
};

/**
 * Query lấy chi tiết bài viết blog theo ID
 */
export const useBlogByIdQuery = (id: string | Ref<string>) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: async (): Promise<BlogPost> => {
      return (await $motobikertoursApi('/blog/{id}', {
        path: { id: unref(id) },
      })) as BlogPost;
    },
    enabled: computed(() => !!unref(id)),
    staleTime: 5 * 60 * 1000, // 5 min — blog detail
  });
};
