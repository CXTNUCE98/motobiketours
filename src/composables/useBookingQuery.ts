import { useQuery } from '@tanstack/vue-query';
import type { FilterBookingDto } from '~/types/booking';

/**
 * Composable for getting list of bookings
 */
export function useBookingListQuery(filters: FilterBookingDto) {
  const { getAuthHeaders } = useAuth();

  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: async ({ signal }) => {
      const response = await $motobikertoursApi('/bookings', {
        query: filters,
        headers: getAuthHeaders(),
        signal,
      });
      return response;
    },
    staleTime: 30 * 1000, // 30 sec — bookings change on user action
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
    queryFn: async ({ signal }) => {
      if (!bookingId.value) return null;

      const response = await $motobikertoursApi('/bookings/{id}', {
        path: { id: bookingId.value },
        headers: getAuthHeaders(),
        signal,
      });
      return response;
    },
    enabled: computed(() => !!bookingId.value),
    staleTime: 30 * 1000, // 30 sec — booking detail
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
    queryKey: ['my-bookings', computed(() => JSON.stringify(unref(filtersRef)))],
    queryFn: async ({ signal }) => {
      const response = await $motobikertoursApi('/bookings/my-bookings', {
        query: filtersRef.value,
        headers: getAuthHeaders(),
        signal,
      });
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 sec — my bookings
  });
}
