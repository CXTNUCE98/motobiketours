/**
 * Đọc giá trị một CSS custom property (token trong assets/css/tokens.css) tại runtime.
 * Dùng khi thư viện cần màu cụ thể thay vì var(...) — ví dụ màu đường vẽ của Leaflet.
 */
export function readCssVar(name: string, fallback = 'currentColor'): string {
  if (typeof window === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
