// Cấu hình website do admin chỉnh (GET /settings/public)

export interface LocalizedText {
  vi: string;
  en: string;
}

export interface ContactChannel {
  type:
    | 'zalo'
    | 'whatsapp'
    | 'messenger'
    | 'viber'
    | 'line'
    | 'kakaotalk'
    | 'telegram'
    | 'wechat'
    | 'facebook'
    | 'instagram'
    | 'tiktok'
    | 'youtube'
    | 'other';
  label: string;
  url: string;
  note: LocalizedText;
}

export interface PublicSiteSettings {
  general: {
    siteName: string;
    websiteUrl: string;
    usdToVndRate: number;
  };
  contact: {
    phones: Array<{ number: string; label: string }>;
    emails: string[];
    address: string;
    hours: LocalizedText;
    mapEmbedUrl: string;
    channels: ContactChannel[];
  };
  about: {
    guides: Array<{ name: string; role: LocalizedText; photo: string }>;
  };
  home: {
    heroSlides: Array<{ image: string; caption: LocalizedText }>;
    testimonials: Array<{ name: string; role: LocalizedText; avatar: string; quote: LocalizedText }>;
  };
}
