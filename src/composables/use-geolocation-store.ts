import { ref, computed, watch } from 'vue';
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
const isUsingIPFallback = ref(false);

interface GeoIPResponse {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  isMock?: boolean;
  error?: boolean;
}

/**
 * Composable quản lý vị trí người dùng toàn cục với cơ chế lưu trữ đệm (Caching) và IP Fallback
 */
export function useGeolocationStore() {
  const { coords, isSupported, error, resume } = useGeolocation({
    immediate: false, // Chúng ta sẽ chủ động gọi qua init
  });

  /**
   * Lấy vị trí dựa trên IP qua Server API nội bộ
   */
  const fetchIPLocation = async () => {
    try {
      console.log('📍 Geolocation: Đang thử lấy vị trí qua IP...');
      const data = await $fetch<GeoIPResponse>('/api/geo/ip');
      if (data && data.latitude && data.longitude) {
        // Chỉ cập nhật nếu chưa có tọa độ CHÍNH XÁC từ GPS/Trình duyệt
        if (!latGlobal.value || isUsingIPFallback.value) {
          latGlobal.value = {
            latitude: data.latitude,
            longitude: data.longitude,
          };
          isUsingIPFallback.value = true;
          isLoadingGeo.value = false;
          errorGeo.value = null;
          console.log('📍 Geolocation: Sử dụng vị trí từ IP (Fallback)', latGlobal.value);
        }
      }
    } catch (err) {
      console.error('📍 Geolocation: Lỗi lấy vị trí qua IP', err);
    }
  };

  /**
   * Khởi tạo và lấy vị trí
   */
  const initGeolocation = async () => {
    if (!process.client) return;

    // Đồng bộ trạng thái hỗ trợ
    isSupport.value = isSupported.value;

    // 1. Kiểm tra Cache trước
    const cacheGeo = localStorage.getItem(KEY_CACHE);
    if (cacheGeo) {
      try {
        const data: GeoCache = JSON.parse(cacheGeo);
        const hiệnTại = Date.now();

        if (hiệnTại - data.time < TIME_LIVE_CACHE) {
          latGlobal.value = {
            latitude: data.lat,
            longitude: data.lng,
          };
          isUsingIPFallback.value = false; // Tạm coi cache là chính xác
          console.log('📍 Geolocation: Sử dụng vị trí từ cache', latGlobal.value);
        }
      } catch (err) {
        console.error('Lỗi đọc cache geolocation', err);
      }
    }

    // 2. Kích hoạt lấy vị trí song song
    isLoadingGeo.value = true;

    // Luôn lấy IP Location trước/song song để có dữ liệu nhanh nhất
    fetchIPLocation();

    // Kích hoạt Browser Geolocation
    resume();
  };

  /**
   * Theo dõi sự thay đổi của coords từ VueUse (Browser API)
   */
  watch(
    coords,
    (newGeo) => {
      if (newGeo && newGeo.latitude !== Infinity && newGeo.latitude !== 0) {
        // Luôn ưu tiên vị trí từ Trình duyệt/GPS vì nó chính xác hơn IP
        latGlobal.value = {
          latitude: newGeo.latitude,
          longitude: newGeo.longitude,
        };
        isUsingIPFallback.value = false;

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
        console.log('📍 Geolocation: Cập nhật vị trí chính xác từ Trình duyệt', latGlobal.value);
      }
    },
    { immediate: true },
  );

  /**
   * Theo dõi lỗi từ Browser API
   */
  watch(error, (err) => {
    if (err) {
      // Nếu đã có tọa độ (từ IP hoặc Cache) thì không coi đây là lỗi chặn ứng dụng
      if (latGlobal.value) {
        console.warn('📍 Geolocation: Browser API gặp lỗi nhưng đã có IP/Cache fallback', err);
        errorGeo.value = null;
      } else {
        errorGeo.value = err;
      }
      isLoadingGeo.value = false;
    }
  });

  return {
    coords: computed(() => latGlobal.value),
    isSupported: computed(() => isSupported.value),
    error: computed(() => errorGeo.value),
    isLoading: computed(() => isLoadingGeo.value),
    isFallback: computed(() => isUsingIPFallback.value),
    initGeolocation: initGeolocation,
  };
}
