import { useQuery } from '@tanstack/vue-query';

export interface Country {
  id: string;
  name: string;
  niceName: string;
  iso: string;
  iso3: string;
  numCode: number | null;
  phoneCode: number;
  flag: string;
}

export interface CountryResponse {
  total: number;
  data: Country[];
  code: string;
  message: string | null;
}

/**
 * Lấy danh sách quốc gia từ API public
 */
export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      const response = await $fetch<CountryResponse>('https://open.oapi.vn/location/countries');
      return response.data;
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache trong 24 giờ
  });
};
