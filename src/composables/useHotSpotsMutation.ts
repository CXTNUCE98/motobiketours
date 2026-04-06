import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { HotSpot } from '~/types/api';

export const useCreateHotSpot = () => {
    const queryClient = useQueryClient();
    const { handleApiError } = useErrorHandler();

    return useMutation({
        mutationFn: async (data: Partial<HotSpot>) => {
            return await $motobikertoursApi('/hot-spots', {
                method: 'POST',
                body: data,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hot-spots'] });
        },
        onError: (error) => {
            handleApiError(error, 'Create HotSpot');
        },
    });
};

export const useUpdateHotSpot = () => {
    const queryClient = useQueryClient();
    const { handleApiError } = useErrorHandler();

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
        },
        onError: (error) => {
            handleApiError(error, 'Update HotSpot');
        },
    });
};

export const useDeleteHotSpot = () => {
    const queryClient = useQueryClient();
    const { handleApiError } = useErrorHandler();

    return useMutation({
        mutationFn: async (id: string) => {
            return await $motobikertoursApi(`/hot-spots/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hot-spots'] });
        },
        onError: (error) => {
            handleApiError(error, 'Delete HotSpot');
        },
    });
};
