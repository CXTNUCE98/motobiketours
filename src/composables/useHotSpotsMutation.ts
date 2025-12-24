import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ElMessage } from 'element-plus';
import type { HotSpot } from '~/types/api';

export const useCreateHotSpot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<HotSpot>) => {
            return await $motobikertoursApi('/hot-spots', {
                method: 'POST',
                body: data,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hot-spots'] });
            ElMessage.success('Create hot spot successfully');
        },
        onError: (error: any) => {
            ElMessage.error(error.message || 'Failed to create hot spot');
        },
    });
};

export const useUpdateHotSpot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<HotSpot> }) => {
            return await $motobikertoursApi(`/hot-spots/${id}`, {
                method: 'PATCH',
                body: data,
            });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['hot-spots'] });
            queryClient.invalidateQueries({ queryKey: ['hot-spot', variables.id] });
            ElMessage.success('Update hot spot successfully');
        },
        onError: (error: any) => {
            ElMessage.error(error.message || 'Failed to update hot spot');
        },
    });
};

export const useDeleteHotSpot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await $motobikertoursApi(`/hot-spots/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hot-spots'] });
            ElMessage.success('Delete hot spot successfully');
        },
        onError: (error: any) => {
            ElMessage.error(error.message || 'Failed to delete hot spot');
        },
    });
};
