import { getRequestIP } from 'h3';

// @ts-ignore
export default defineEventHandler(async (event) => {
  const clientIp = getRequestIP(event, { xForwardedFor: true });
  const isLocal =
    !clientIp ||
    clientIp === '127.0.0.1' ||
    clientIp === '::1' ||
    clientIp.startsWith('192.168.') ||
    clientIp.startsWith('10.');

  /** 1. Thử ipapi.co */
  try {
    const url = isLocal ? 'https://ipapi.co/json/' : `https://ipapi.co/${clientIp}/json/`;
    const response = await $fetch<any>(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 3000, // Timeout nhanh 3s
    });

    if (response && response.latitude) {
      console.log('📍 Geolocation: SUCCESS (ipapi.co)', response.city);
      return {
        latitude: response.latitude,
        longitude: response.longitude,
        city: response.city,
        country: response.country_name,
      };
    }
  } catch (e) {
    console.warn('📍 Geolocation: ipapi.co failed');
  }

  /** 2. Fallback sang ip-api.com (Rất mạnh cho local development) */
  try {
    const url = isLocal ? 'http://ip-api.com/json' : `http://ip-api.com/json/${clientIp}`;
    const response = await $fetch<any>(url, { timeout: 3000 });

    if (response && response.status === 'success') {
      console.log('📍 Geolocation: SUCCESS (ip-api.com)', response.city);
      return {
        latitude: response.lat,
        longitude: response.lon,
        city: response.city,
        country: response.country,
      };
    }
  } catch (e) {
    console.error('📍 Geolocation: All providers failed');
  }

  // Cuối cùng nếu không được thì trả về null
  return {
    latitude: null,
    longitude: null,
    error: true,
  };
});
