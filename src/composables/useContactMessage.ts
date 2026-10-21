export interface ContactMessageBody {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  title: string;
  content: string;
}

/**
 * Gửi form liên hệ về backend: admin nhận thông báo trên trang quản trị và email
 * theo cấu hình "Thông báo" trong admin
 */
export const sendContactMessage = (body: ContactMessageBody) =>
  $motobikertoursApi('/contact-messages', { method: 'POST', body });
