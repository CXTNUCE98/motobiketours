import { ref, computed } from 'vue';
import { useGeolocation } from '@vueuse/core';

/**
 * Định nghĩa cấu trúc dữ liệu lưu trữ cache vị trí
 */
interface GeoCache {
  lat: number;
  lng: number;
  time: number;
}

const KEY_CACHE = 'andago_geo_cache';
const TIME_LIVE_CACHE = 5 * 60 * 1000; // 5 phút

// Trạng thái toàn cục (Global State)
const latGlobal = ref<{ latitude: number; longitude: number } | null>(null);
const isSupport = ref(false);
const errorGeo = ref<any>(null);
const isLoadingGeo = ref(false);

/**
 * Composable quản lý vị trí người dùng toàn cục với cơ chế lưu trữ đệm (Caching)
 */
export function useGeolocationStore() {
  const { coords, isSupported, error, resume } = useGeolocation({
    immediate: false, // Chúng ta sẽ chủ động gọi qua init
  });

  /**
   * Khởi tạo và lấy vị trí
   */
  const initGeolocation = () => {
    if (!process.client) return;

    // Đồng bộ trạng thái hỗ trợ
    isSupport.value = isSupported.value;

    // 1. Kiểm tra Cache trước
    const cacheGeo = localStorage.getItem(KEY_CACHE);
    if (cacheGeo) {
      try {
        const data: GeoCache = JSON.parse(cacheGeo);
        const hiệnTại = Date.now();

        // Nếu cache còn mới (< TIME_LIVE_CACHE)
        if (hiệnTại - data.time < TIME_LIVE_CACHE) {
          latGlobal.value = {
            latitude: data.lat,
            longitude: data.lng,
          };
          console.log('📍 Geolocation: Sử dụng vị trí từ cache', latGlobal.value);
        }
      } catch (err) {
        console.error('Lỗi đọc cache geolocation', err);
      }
    }

    // 2. Bắt đầu lấy vị trí mới từ trình duyệt
    isLoadingGeo.value = true;
    resume();
  };

  /**
   * Theo dõi sự thay đổi của coords từ VueUse
   */
  watch(
    coords,
    (newGeo) => {
      if (newGeo && newGeo.latitude !== Infinity && newGeo.latitude !== 0) {
        latGlobal.value = {
          latitude: newGeo.latitude,
          longitude: newGeo.longitude,
        };

        // Cập nhật cache
        const dataGeo: GeoCache = {
          lat: newGeo.latitude,
          lng: newGeo.longitude,
          time: Date.now(),
        };
        localStorage.setItem(KEY_CACHE, JSON.stringify(dataGeo));

        // Khi có data thành công, reset trạng thái loading và lỗi
        isLoadingGeo.value = false;
        errorGeo.value = null;
      }
    },
    { immediate: true },
  );

  /**
   * Theo dõi lỗi
   */
  watch(error, (err) => {
    if (err) {
      errorGeo.value = err;
      isLoadingGeo.value = false;
    }
  });

  return {
    coords: computed(() => latGlobal.value),
    isSupported: computed(() => isSupported.value), // Sử dụng trực tiếp từ VueUse để đảm bảo reactivity
    error: computed(() => errorGeo.value),
    isLoading: computed(() => isLoadingGeo.value),
    initGeolocation: initGeolocation,
  };
}
