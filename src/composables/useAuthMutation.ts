import { useMutation } from '@tanstack/vue-query';
import type { LoginDto, CreateUserDto, AuthResponseDto } from '~/types/api';

/**
 * Mutation cho việc đăng nhập
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginDto): Promise<AuthResponseDto> => {
      return await $motobikertoursApi('/auth/login', {
        method: 'POST',
        body: data,
      });
    },
  });
};

/**
 * Mutation cho việc đăng ký
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: CreateUserDto): Promise<AuthResponseDto> => {
      return await $motobikertoursApi('/auth/register', {
        method: 'POST',
        body: data,
      });
    },
  });
};
