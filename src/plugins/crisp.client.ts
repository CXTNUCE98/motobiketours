export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const websiteId = config.public.crispWebsiteId;

  if (!websiteId) {
    console.warn('Crisp Website ID is missing. Please set NUXT_PUBLIC_CRISP_WEBSITE_ID in your environment.');
    return;
  }

  if (process.client) {
    const { user } = useAuth();
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    // 1. Chặn hỏi email
    window.$crisp.push(['set', 'chat:ask:email', [false]]);

    (function () {
      const d = document;
      const s = d.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      d.getElementsByTagName('head')[0].appendChild(s);
    })();

    // 2. Logic Smart Reset & Identity Sync
    watch(
      user,
      (newUser) => {
        if (newUser?.id && newUser?.crispSignature && window.$crisp) {
          const userEmail = newUser.email.toLowerCase();
          const lastEmail = localStorage.getItem('crisp_last_email');

          // NẾU phát hiện đổi người dùng (Email khác với lần cuối login)
          // THÌ mới thực hiện Reset Session để bảo mật
          if (lastEmail && lastEmail !== userEmail) {
            window.$crisp.push(['do', 'session:reset']);
            console.log('Crisp: Different user detected, resetting session for privacy');
          }

          // Lưu lại email hiện tại để so sánh cho lần sau
          localStorage.setItem('crisp_last_email', userEmail);

          // Đồng bộ danh tính (Lúc này lịch sử sẽ còn nếu trùng người dùng cũ)
          window.$crisp.push(['set', 'user:email', [userEmail, newUser.crispSignature]]);
          window.$crisp.push(['set', 'user:nickname', [newUser.userName]]);
          if (newUser.avatar) {
            window.$crisp.push(['set', 'user:avatar', [newUser.avatar]]);
          }

          // Hiện lại thanh chat
          window.$crisp.push(['do', 'chat:show']);
          console.log('Crisp: Identity synced for', userEmail);
        } else if (!newUser && window.$crisp) {
          // KHI LOGOUT: Chỉ ẩn thanh chat, KHÔNG reset ngay để giữ lịch sử cho chính họ
          window.$crisp.push(['do', 'chat:hide']);
          console.log('Crisp: Chat hidden on logout');
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
