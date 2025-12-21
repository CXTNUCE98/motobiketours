import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query';
import { type Ref, computed } from 'vue';
import type { Tour, TourFilter, CreateTourDto, UpdateTourDto } from '@/services/tourApi';

// Keys
export const tourKeys = {
    all: ['tours'] as const,
    lists: () => [...tourKeys.all, 'list'] as const,
    list: (filters: TourFilter) => [...tourKeys.lists(), filters] as const,
    details: () => [...tourKeys.all, 'detail'] as const,
    detail: (id: string) => [...tourKeys.details(), id] as const,
};

// Queries
export const useTours = (filters: Ref<TourFilter>) => {
    return useQuery({
        queryKey: computed(() => tourKeys.list(filters.value)),
        queryFn: async () => {
            const res = await $motobikertoursApi('/tours', {
                query: filters.value
            });
            return res;
        },
        placeholderData: keepPreviousData,
    });
};

export const useTour = (id: Ref<string> | string) => {
    const tourId = computed(() => typeof id === 'string' ? id : id.value);
    return useQuery({
        queryKey: computed(() => tourKeys.detail(tourId.value)),
        queryFn: async () => {
            if (!tourId.value) return null;
            const res = await $motobikertoursApi(`/tours/${tourId.value}`);
            return res;
        },
        enabled: computed(() => !!tourId.value),
    });
};

// Mutations
export const useCreateTour = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: FormData | CreateTourDto) => {
            // Note: $motobikertoursApi handles FormData if passed as body
            // But we might need to specify method: 'POST'
            return await $motobikertoursApi('/tours', {
                method: 'POST',
                body: data,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
        },
    });
};

export const useUpdateTour = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: FormData | UpdateTourDto }) => {
            return await $motobikertoursApi(`/tours/${id}`, {
                method: 'PATCH',
                body: data,
            });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: tourKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
        },
    });
};

export const useDeleteTour = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            return await $motobikertoursApi(`/tours/${id}`, {
                method: 'DELETE',
            });
        },
        onSuccess: (data, variables) => {
            // Invalidate detail query for the deleted tour
            queryClient.invalidateQueries({ queryKey: tourKeys.detail(variables) });
            // Invalidate all list queries
            queryClient.invalidateQueries({ queryKey: tourKeys.lists() });
            // Invalidate all tours queries
            queryClient.invalidateQueries({ queryKey: tourKeys.all });
        },
    });
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            return await $motobikertoursApi('/blog/upload-image', {
                method: 'POST',
                body: formData,
            });
        },
    });
};

