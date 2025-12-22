import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useCurrency = () => {
  const { locale } = useI18n();

  // 1 USD = 24,000 VND (approximate exchange rate)
  const USD_TO_VND_RATE = 24000;

  const currencyCode = computed(() => (locale.value === 'vi' ? 'VND' : 'USD'));
  const currencySymbol = computed(() => (locale.value === 'vi' ? 'đ' : '$'));

  /**
   * Formats price based on current locale
   * @param priceUsd Price in USD
   */
  const formatPrice = (priceUsd: number | string | undefined | null) => {
    if (priceUsd === undefined || priceUsd === null || priceUsd === '') return '';

    // If it's already a string (e.g. "Liên hệ"), return it as is
    if (typeof priceUsd === 'string' && isNaN(Number(priceUsd))) return priceUsd;

    const numericPrice = typeof priceUsd === 'string' ? Number(priceUsd) : priceUsd;

    if (locale.value === 'vi') {
      const priceVnd = Math.round(numericPrice * USD_TO_VND_RATE);
      // Format with dots as thousands separator and add 'đ' suffix
      return new Intl.NumberFormat('vi-VN').format(priceVnd) + ' đ';
    }

    // Return with '$' prefix for 'en'
    return '$' + new Intl.NumberFormat('en-US').format(numericPrice);
  };

  const convertToVnd = (priceUsd: number) => {
    return Math.round(priceUsd * USD_TO_VND_RATE);
  };

  return {
    locale,
    currencyCode,
    currencySymbol,
    formatPrice,
    convertToVnd,
    USD_TO_VND_RATE,
  };
};
