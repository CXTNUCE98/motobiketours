import { getRequestIP } from 'h3';

// API (BE-an-tour) giới hạn tần suất theo IP. Website gọi API từ server Nuxt (SSR và proxy
// /api/__api_party), nên API chỉ thấy IP server Nuxt và mọi khách dùng chung một hạn mức.
// Gửi kèm IP thật của khách cùng secret dùng chung (API_PROXY_SECRET bên BE) để API đếm riêng từng khách.
// IP lấy từ X-Forwarded-For (Vercel ghi đè header này nên khách không giả được), SSR thì Nuxt chuyển tiếp header đó.
const PROXY_SECRET_HEADER = 'x-proxy-secret';
const CLIENT_IP_HEADER = 'x-client-ip';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('api-party:request', (ctx, event) => {
    // Trình duyệt gửi được header tùy ý qua body của proxy: luôn xóa rồi tự đặt lại
    const headers = new Headers(ctx.options.headers);
    headers.delete(PROXY_SECRET_HEADER);
    headers.delete(CLIENT_IP_HEADER);

    const { apiProxySecret } = useRuntimeConfig(event);
    if (apiProxySecret) {
      headers.set(PROXY_SECRET_HEADER, apiProxySecret);
      const clientIp = getRequestIP(event, { xForwardedFor: true });
      if (clientIp) headers.set(CLIENT_IP_HEADER, clientIp);
    }
    ctx.options.headers = headers;
  });
});
