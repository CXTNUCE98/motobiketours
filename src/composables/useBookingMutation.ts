import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { CreateBookingDto, UpdateBookingDto } from '~/types/booking';

/**
 * Composable for creating a new booking
 */
export function useCreateBookingMutation() {
  const { getAuthHeaders } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingDto) => {
      const response = await $motobikertoursApi('/bookings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: data,
      });
      return response;
    },
    onSuccess: (data) => {
      ElMessage.success(t('booking.createSuccess'));
      // Invalidate booking queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      // Redirect to payment page or success page
      // TODO: Integrate with payment gateway
      router.push(`/booking/success?id=${data.id}`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t('booking.createFailed');
      ElMessage.error(message);
    },
  });
}

/**
 * Composable for updating a booking
 */
export function useUpdateBookingMutation() {
  const { getAuthHeaders } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBookingDto }) => {
      const response = await $motobikertoursApi('/bookings/{id}', {
        method: 'PATCH',
        path: { id },
        headers: getAuthHeaders(),
        body: data,
      });
      return response;
    },
    onSuccess: (data) => {
      ElMessage.success(t('booking.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t('booking.updateFailed');
      ElMessage.error(message);
    },
  });
}

/**
 * Composable for canceling a booking
 */
export function useCancelBookingMutation() {
  const { getAuthHeaders } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await $motobikertoursApi('/bookings/{id}/cancel', {
        method: 'POST',
        path: { id: bookingId },
        headers: getAuthHeaders(),
      });
      return response;
    },
    onSuccess: (data) => {
      ElMessage.success(t('booking.cancelSuccess'));
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t('booking.cancelFailed');
      ElMessage.error(message);
    },
  });
}

/**
 * Composable for confirming a booking (Admin only)
 */
export function useConfirmBookingMutation() {
  const { getAuthHeaders } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await $motobikertoursApi('/bookings/{id}/confirm', {
        method: 'POST',
        path: { id: bookingId },
        headers: getAuthHeaders(),
      });
      return response;
    },
    onSuccess: (data) => {
      ElMessage.success(t('booking.confirmSuccess'));
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || t('booking.confirmFailed');
      ElMessage.error(message);
    },
  });
}
