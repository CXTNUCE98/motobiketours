import { computed, getCurrentInstance, onServerPrefetch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { ContactChannel, LocalizedText, PublicSiteSettings } from '~/types/siteSettings';

const CHANNEL_NAMES: Record<ContactChannel['type'], string> = {
  zalo: 'Zalo',
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
  viber: 'Viber',
  line: 'Line',
  kakaotalk: 'KakaoTalk',
  telegram: 'Telegram',
  wechat: 'WeChat',
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  other: '',
};

/**
 * Cấu hình website do admin chỉnh: liên hệ, kênh chat, hướng dẫn viên, nội dung trang chủ, tỷ giá.
 * Lấy sẵn khi render phía server để số điện thoại, địa chỉ... có trong HTML (SEO, không nhấp nháy).
 */
export const useSiteSettings = () => {
  const { locale } = useI18n();

  const query = useQuery({
    queryKey: ['site-settings'],
    queryFn: async ({ signal }) =>
      (await $motobikertoursApi('/settings/public', { signal })) as PublicSiteSettings,
    staleTime: 60_000,
  });

  if (getCurrentInstance()) {
    // Lỗi API thì vẫn render phần còn lại của trang, các khối cấu hình tự ẩn
    onServerPrefetch(() => query.suspense().then(() => undefined, () => undefined));
  }

  const settings = computed(() => query.data.value);
  const contact = computed(() => settings.value?.contact);

  /** Bản theo ngôn ngữ đang xem; tiếng Anh trống thì dùng tiếng Việt */
  const localized = (text?: LocalizedText | null) => {
    if (!text) return '';
    return (locale.value === 'en' ? text.en : text.vi) || text.vi || text.en || '';
  };

  const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
  const channelName = (channel: ContactChannel) => channel.label || CHANNEL_NAMES[channel.type] || channel.url;

  return {
    query,
    settings,
    contact,
    general: computed(() => settings.value?.general),
    about: computed(() => settings.value?.about),
    home: computed(() => settings.value?.home),
    primaryPhone: computed(() => contact.value?.phones[0] ?? null),
    primaryEmail: computed(() => contact.value?.emails[0] ?? ''),
    localized,
    phoneHref,
    channelName,
  };
};
