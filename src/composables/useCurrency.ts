import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const useCurrency = () => {
    const { locale } = useI18n();

    const USD_TO_VND_RATE = 24000;

    const currencyCode = computed(() => (locale.value === 'vi' ? 'VND' : 'USD'));
    const currencySymbol = computed(() => (locale.value === 'vi' ? '₫' : '$'));

    const formatPrice = (priceUsd: number | string) => {
        if (typeof priceUsd === 'string') return priceUsd;

        if (locale.value === 'vi') {
            const priceVnd = Math.round(priceUsd * USD_TO_VND_RATE);
            return new Intl.NumberFormat('vi-VN').format(priceVnd) + ' ₫';
        }

        return '$' + new Intl.NumberFormat('en-US').format(priceUsd);
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
