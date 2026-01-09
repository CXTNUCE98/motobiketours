import { useQuery } from '@tanstack/vue-query';

export function useTourQuery(tourId: string) {
  return useQuery({
    queryKey: ['tour', tourId],
    queryFn: async () => {
      const response = await $motobikertoursApi('/tours/{id}', {
        path: { id: tourId },
      });
      return response;
    },
    enabled: !!tourId,
  });
}
