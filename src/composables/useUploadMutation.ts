import { useMutation } from '@tanstack/vue-query';

export interface UploadResponse {
  url: string;
  publicId: string;
}

/**
 * Composable dùng chung cho việc tải ảnh (upload) lên máy chủ.
 * Hỗ trợ định dạng multipart/form-data và cho phép chỉ định thư mục lưu trữ.
 *
 * @returns Đối tượng mutation từ TanStack Query
 */
export const useUploadMutation = () => {
  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API POST /upload?folder=xxx dạng multipart/form-data
      // Sử dụng as any vì endpoint /upload có thể chưa được cập nhật trong OpenAPI schema
      return await ($motobikertoursApi as any)('/upload', {
        method: 'POST',
        query: { folder },
        body: formData as any,
      });
    },
  });
};
