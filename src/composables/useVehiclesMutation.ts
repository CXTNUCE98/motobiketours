import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { CreateVehicleDto, UpdateVehicleDto, Vehicle } from '~/types/api';

/**
 * Mutation để tạo xe mới
 */
export const useCreateVehicleMutation = () => {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateVehicleDto): Promise<Vehicle> => {
      return (await $motobikertoursApi('/vehicles', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data,
      })) as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

/**
 * Mutation để cập nhật thông tin xe
 */
export const useUpdateVehicleMutation = () => {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateVehicleDto }): Promise<Vehicle> => {
      return (await $motobikertoursApi('/vehicles/{id}', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        path: { id },
        body: data,
      })) as Vehicle;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', data.id] });
    },
  });
};

/**
 * Mutation để xóa xe
 */
export const useDeleteVehicleMutation = () => {
  const queryClient = useQueryClient();
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await $motobikertoursApi('/vehicles/{id}', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        path: { id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
