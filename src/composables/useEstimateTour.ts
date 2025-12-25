import { useMutation } from '@tanstack/vue-query';
import type { EstimateRouteRequest, EstimateRouteResponse } from '~/types/api';

/**
 * Mutation để ước tính lộ trình và báo giá tour
 */
export const useEstimateTour = () => {
  return useMutation({
    mutationFn: async (data: EstimateRouteRequest): Promise<EstimateRouteResponse> => {
      return (await $motobikertoursApi('/tours/estimate', {
        method: 'POST',
        body: data,
      })) as EstimateRouteResponse;
    },
  });
};
