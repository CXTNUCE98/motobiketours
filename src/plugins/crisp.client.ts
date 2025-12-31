export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const websiteId = config.public.crispWebsiteId;

  if (!websiteId) {
    console.warn('Crisp Website ID is missing. Please set NUXT_PUBLIC_CRISP_WEBSITE_ID in your environment.');
    return;
  }

  if (process.client) {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    (function () {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();

    // Đồng bộ thông tin user nếu đã đăng nhập
    const { user } = useAuth();
    watch(
      user,
      (newUser) => {
        if (newUser && window.$crisp) {
          window.$crisp.push(['set', 'user:email', [newUser.email]]);
          window.$crisp.push(['set', 'user:nickname', [newUser.userName]]);
          if (newUser.avatar) {
            window.$crisp.push(['set', 'user:avatar', [newUser.avatar]]);
          }
        } else if (!newUser && window.$crisp) {
          window.$crisp.push(['do', 'session:reset']);
        }
      },
      { immediate: true },
    );

    // Optional: Hide chat on specific routes if needed
    const router = useRouter();
    router.afterEach((to) => {
      // Ví dụ: Ẩn chat ở trang admin nếu có
      // if (to.path.startsWith('/admin')) {
      //     window.$crisp.push(['do', 'chat:hide']);
      // } else {
      //     window.$crisp.push(['do', 'chat:show']);
      // }
    });
  }
});

// Khai báo kiểu dữ liệu cho window.$crisp
declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}
