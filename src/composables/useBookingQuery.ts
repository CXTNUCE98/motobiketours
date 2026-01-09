import { useQuery } from '@tanstack/vue-query';
import type { FilterBookingDto } from '~/types/booking';

/**
 * Composable for getting list of bookings
 */
export function useBookingListQuery(filters: FilterBookingDto) {
  const { getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      const response = await $motobikertoursApi('/bookings', {
        query: filters,
        headers: getAuthHeaders(),
      });
      return response;
    },
  });
}

/**
 * Composable for getting booking detail
 */
export function useBookingDetailQuery(id: Ref<string> | string) {
  const { getAuthHeaders } = useAuth();
  const bookingId = isRef(id) ? id : ref(id);

  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId.value) return null;

      const response = await $motobikertoursApi('/bookings/{id}', {
        path: { id: bookingId.value },
        headers: getAuthHeaders(),
      });
      return response;
    },
    enabled: computed(() => !!bookingId.value),
  });
}

/**
 * Composable for getting current user's bookings
 */
export function useMyBookingsQuery(
  filters: Ref<FilterBookingDto> | ComputedRef<FilterBookingDto> | FilterBookingDto = {},
) {
  const { getAuthHeaders, isAuthenticated } = useAuth();

  // Convert to ref if it's not already
  const filtersRef = isRef(filters) ? filters : ref(filters);

  return useQuery({
    queryKey: ['my-bookings', filtersRef],
    queryFn: async () => {
      const response = await $motobikertoursApi('/bookings/my-bookings', {
        query: filtersRef.value,
        headers: getAuthHeaders(),
      });
      return response;
    },
    enabled: isAuthenticated,
  });
}
