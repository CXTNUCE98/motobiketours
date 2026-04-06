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

/**
 * Danh sách quốc gia tĩnh — không phụ thuộc API bên thứ ba.
 * API cũ (open.oapi.vn) bị lỗi SSL certificate nên chuyển sang static data.
 */
const COUNTRIES: Country[] = [
  { id: '1', name: 'Afghanistan', niceName: 'Afghanistan', iso: 'AF', iso3: 'AFG', numCode: 4, phoneCode: 93, flag: '🇦🇫' },
  { id: '2', name: 'Albania', niceName: 'Albania', iso: 'AL', iso3: 'ALB', numCode: 8, phoneCode: 355, flag: '🇦🇱' },
  { id: '3', name: 'Algeria', niceName: 'Algeria', iso: 'DZ', iso3: 'DZA', numCode: 12, phoneCode: 213, flag: '🇩🇿' },
  { id: '4', name: 'Argentina', niceName: 'Argentina', iso: 'AR', iso3: 'ARG', numCode: 32, phoneCode: 54, flag: '🇦🇷' },
  { id: '5', name: 'Australia', niceName: 'Australia', iso: 'AU', iso3: 'AUS', numCode: 36, phoneCode: 61, flag: '🇦🇺' },
  { id: '6', name: 'Austria', niceName: 'Austria', iso: 'AT', iso3: 'AUT', numCode: 40, phoneCode: 43, flag: '🇦🇹' },
  { id: '7', name: 'Bangladesh', niceName: 'Bangladesh', iso: 'BD', iso3: 'BGD', numCode: 50, phoneCode: 880, flag: '🇧🇩' },
  { id: '8', name: 'Belgium', niceName: 'Belgium', iso: 'BE', iso3: 'BEL', numCode: 56, phoneCode: 32, flag: '🇧🇪' },
  { id: '9', name: 'Brazil', niceName: 'Brazil', iso: 'BR', iso3: 'BRA', numCode: 76, phoneCode: 55, flag: '🇧🇷' },
  { id: '10', name: 'Cambodia', niceName: 'Cambodia', iso: 'KH', iso3: 'KHM', numCode: 116, phoneCode: 855, flag: '🇰🇭' },
  { id: '11', name: 'Canada', niceName: 'Canada', iso: 'CA', iso3: 'CAN', numCode: 124, phoneCode: 1, flag: '🇨🇦' },
  { id: '12', name: 'Chile', niceName: 'Chile', iso: 'CL', iso3: 'CHL', numCode: 152, phoneCode: 56, flag: '🇨🇱' },
  { id: '13', name: 'China', niceName: 'China', iso: 'CN', iso3: 'CHN', numCode: 156, phoneCode: 86, flag: '🇨🇳' },
  { id: '14', name: 'Colombia', niceName: 'Colombia', iso: 'CO', iso3: 'COL', numCode: 170, phoneCode: 57, flag: '🇨🇴' },
  { id: '15', name: 'Croatia', niceName: 'Croatia', iso: 'HR', iso3: 'HRV', numCode: 191, phoneCode: 385, flag: '🇭🇷' },
  { id: '16', name: 'Czech Republic', niceName: 'Czech Republic', iso: 'CZ', iso3: 'CZE', numCode: 203, phoneCode: 420, flag: '🇨🇿' },
  { id: '17', name: 'Denmark', niceName: 'Denmark', iso: 'DK', iso3: 'DNK', numCode: 208, phoneCode: 45, flag: '🇩🇰' },
  { id: '18', name: 'Egypt', niceName: 'Egypt', iso: 'EG', iso3: 'EGY', numCode: 818, phoneCode: 20, flag: '🇪🇬' },
  { id: '19', name: 'Finland', niceName: 'Finland', iso: 'FI', iso3: 'FIN', numCode: 246, phoneCode: 358, flag: '🇫🇮' },
  { id: '20', name: 'France', niceName: 'France', iso: 'FR', iso3: 'FRA', numCode: 250, phoneCode: 33, flag: '🇫🇷' },
  { id: '21', name: 'Germany', niceName: 'Germany', iso: 'DE', iso3: 'DEU', numCode: 276, phoneCode: 49, flag: '🇩🇪' },
  { id: '22', name: 'Greece', niceName: 'Greece', iso: 'GR', iso3: 'GRC', numCode: 300, phoneCode: 30, flag: '🇬🇷' },
  { id: '23', name: 'Hong Kong', niceName: 'Hong Kong', iso: 'HK', iso3: 'HKG', numCode: 344, phoneCode: 852, flag: '🇭🇰' },
  { id: '24', name: 'Hungary', niceName: 'Hungary', iso: 'HU', iso3: 'HUN', numCode: 348, phoneCode: 36, flag: '🇭🇺' },
  { id: '25', name: 'India', niceName: 'India', iso: 'IN', iso3: 'IND', numCode: 356, phoneCode: 91, flag: '🇮🇳' },
  { id: '26', name: 'Indonesia', niceName: 'Indonesia', iso: 'ID', iso3: 'IDN', numCode: 360, phoneCode: 62, flag: '🇮🇩' },
  { id: '27', name: 'Ireland', niceName: 'Ireland', iso: 'IE', iso3: 'IRL', numCode: 372, phoneCode: 353, flag: '🇮🇪' },
  { id: '28', name: 'Israel', niceName: 'Israel', iso: 'IL', iso3: 'ISR', numCode: 376, phoneCode: 972, flag: '🇮🇱' },
  { id: '29', name: 'Italy', niceName: 'Italy', iso: 'IT', iso3: 'ITA', numCode: 380, phoneCode: 39, flag: '🇮🇹' },
  { id: '30', name: 'Japan', niceName: 'Japan', iso: 'JP', iso3: 'JPN', numCode: 392, phoneCode: 81, flag: '🇯🇵' },
  { id: '31', name: 'Korea, Republic of', niceName: 'South Korea', iso: 'KR', iso3: 'KOR', numCode: 410, phoneCode: 82, flag: '🇰🇷' },
  { id: '32', name: 'Laos', niceName: 'Laos', iso: 'LA', iso3: 'LAO', numCode: 418, phoneCode: 856, flag: '🇱🇦' },
  { id: '33', name: 'Malaysia', niceName: 'Malaysia', iso: 'MY', iso3: 'MYS', numCode: 458, phoneCode: 60, flag: '🇲🇾' },
  { id: '34', name: 'Mexico', niceName: 'Mexico', iso: 'MX', iso3: 'MEX', numCode: 484, phoneCode: 52, flag: '🇲🇽' },
  { id: '35', name: 'Myanmar', niceName: 'Myanmar', iso: 'MM', iso3: 'MMR', numCode: 104, phoneCode: 95, flag: '🇲🇲' },
  { id: '36', name: 'Nepal', niceName: 'Nepal', iso: 'NP', iso3: 'NPL', numCode: 524, phoneCode: 977, flag: '🇳🇵' },
  { id: '37', name: 'Netherlands', niceName: 'Netherlands', iso: 'NL', iso3: 'NLD', numCode: 528, phoneCode: 31, flag: '🇳🇱' },
  { id: '38', name: 'New Zealand', niceName: 'New Zealand', iso: 'NZ', iso3: 'NZL', numCode: 554, phoneCode: 64, flag: '🇳🇿' },
  { id: '39', name: 'Norway', niceName: 'Norway', iso: 'NO', iso3: 'NOR', numCode: 578, phoneCode: 47, flag: '🇳🇴' },
  { id: '40', name: 'Pakistan', niceName: 'Pakistan', iso: 'PK', iso3: 'PAK', numCode: 586, phoneCode: 92, flag: '🇵🇰' },
  { id: '41', name: 'Philippines', niceName: 'Philippines', iso: 'PH', iso3: 'PHL', numCode: 608, phoneCode: 63, flag: '🇵🇭' },
  { id: '42', name: 'Poland', niceName: 'Poland', iso: 'PL', iso3: 'POL', numCode: 616, phoneCode: 48, flag: '🇵🇱' },
  { id: '43', name: 'Portugal', niceName: 'Portugal', iso: 'PT', iso3: 'PRT', numCode: 620, phoneCode: 351, flag: '🇵🇹' },
  { id: '44', name: 'Romania', niceName: 'Romania', iso: 'RO', iso3: 'ROU', numCode: 642, phoneCode: 40, flag: '🇷🇴' },
  { id: '45', name: 'Russia', niceName: 'Russia', iso: 'RU', iso3: 'RUS', numCode: 643, phoneCode: 7, flag: '🇷🇺' },
  { id: '46', name: 'Saudi Arabia', niceName: 'Saudi Arabia', iso: 'SA', iso3: 'SAU', numCode: 682, phoneCode: 966, flag: '🇸🇦' },
  { id: '47', name: 'Singapore', niceName: 'Singapore', iso: 'SG', iso3: 'SGP', numCode: 702, phoneCode: 65, flag: '🇸🇬' },
  { id: '48', name: 'South Africa', niceName: 'South Africa', iso: 'ZA', iso3: 'ZAF', numCode: 710, phoneCode: 27, flag: '🇿🇦' },
  { id: '49', name: 'Spain', niceName: 'Spain', iso: 'ES', iso3: 'ESP', numCode: 724, phoneCode: 34, flag: '🇪🇸' },
  { id: '50', name: 'Sri Lanka', niceName: 'Sri Lanka', iso: 'LK', iso3: 'LKA', numCode: 144, phoneCode: 94, flag: '🇱🇰' },
  { id: '51', name: 'Sweden', niceName: 'Sweden', iso: 'SE', iso3: 'SWE', numCode: 752, phoneCode: 46, flag: '🇸🇪' },
  { id: '52', name: 'Switzerland', niceName: 'Switzerland', iso: 'CH', iso3: 'CHE', numCode: 756, phoneCode: 41, flag: '🇨🇭' },
  { id: '53', name: 'Taiwan', niceName: 'Taiwan', iso: 'TW', iso3: 'TWN', numCode: 158, phoneCode: 886, flag: '🇹🇼' },
  { id: '54', name: 'Thailand', niceName: 'Thailand', iso: 'TH', iso3: 'THA', numCode: 764, phoneCode: 66, flag: '🇹🇭' },
  { id: '55', name: 'Turkey', niceName: 'Turkey', iso: 'TR', iso3: 'TUR', numCode: 792, phoneCode: 90, flag: '🇹🇷' },
  { id: '56', name: 'Ukraine', niceName: 'Ukraine', iso: 'UA', iso3: 'UKR', numCode: 804, phoneCode: 380, flag: '🇺🇦' },
  { id: '57', name: 'United Arab Emirates', niceName: 'United Arab Emirates', iso: 'AE', iso3: 'ARE', numCode: 784, phoneCode: 971, flag: '🇦🇪' },
  { id: '58', name: 'United Kingdom', niceName: 'United Kingdom', iso: 'GB', iso3: 'GBR', numCode: 826, phoneCode: 44, flag: '🇬🇧' },
  { id: '59', name: 'United States', niceName: 'United States', iso: 'US', iso3: 'USA', numCode: 840, phoneCode: 1, flag: '🇺🇸' },
  { id: '60', name: 'Viet Nam', niceName: 'Vietnam', iso: 'VN', iso3: 'VNM', numCode: 704, phoneCode: 84, flag: '🇻🇳' },
];

/**
 * Trả về danh sách quốc gia từ static data.
 * Giữ nguyên interface useQuery để không cần sửa component nào.
 */
export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      return COUNTRIES;
    },
    staleTime: Infinity, // Static data, không bao giờ stale
  });
};
