/**
 * Chuẩn hóa URL ảnh người dùng dán vào. Website chạy https nên ảnh http sẽ bị trình duyệt
 * chặn (mixed content): tự đổi http/"//" sang https, URL không hợp lệ trả về null.
 */
export function normalizeImageUrl(raw: string): string | null {
    let value = raw.trim();
    if (!value) return null;
    if (value.startsWith('//')) value = `https:${value}`;
    else if (/^http:\/\//i.test(value)) value = value.replace(/^http:/i, 'https:');
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname ? url.href : null;
    } catch {
        return null;
    }
}

/**
 * Tải thử ảnh để chắc URL trỏ thẳng tới file ảnh (không phải một trang web)
 * và máy chủ ảnh cho phép hiển thị ở trang khác
 */
export function probeImage(url: string, timeout = 15_000): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => {
            img.src = '';
            reject(new Error('timeout'));
        }, timeout);
        img.onload = () => {
            clearTimeout(timer);
            if (img.naturalWidth > 0) resolve();
            else reject(new Error('empty'));
        };
        img.onerror = () => {
            clearTimeout(timer);
            reject(new Error('error'));
        };
        img.src = url;
    });
}
