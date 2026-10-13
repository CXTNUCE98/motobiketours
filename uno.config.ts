import type { UserConfig } from 'unocss';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export const unoConfig: UserConfig = {
  theme: {
    // Font, bo góc và màu của design system — giá trị thật nằm ở src/assets/css/tokens.css
    fontFamily: {
      sans: 'var(--font-sans)',
      serif: 'var(--font-serif)',
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      DEFAULT: 'var(--radius-md)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      full: 'var(--radius-pill)',
    },
    colors: {
      // Dùng: text-ink, text-muted, bg-page, bg-subtle, bg-surface, border-line, text-accent, bg-accent...
      page: 'var(--color-bg)',
      subtle: 'var(--color-bg-subtle)',
      surface: 'var(--color-surface)',
      ink: 'var(--color-text)',
      muted: 'var(--color-text-muted)',
      line: 'var(--color-border)',
      accent: {
        DEFAULT: 'var(--color-accent)',
        hover: 'var(--color-accent-hover)',
        on: 'var(--color-on-accent)',
      },
      inverse: {
        DEFAULT: 'var(--color-inverse-bg)',
        text: 'var(--color-inverse-text)',
        muted: 'var(--color-inverse-muted)',
        accent: 'var(--color-inverse-accent)',
      },
      primary: {
        DEFAULT: 'var(--el-color-primary)',
        light: {
          3: 'var(--el-color-primary-light-3)',
          5: 'var(--el-color-primary-light-5)',
          7: 'var(--el-color-primary-light-7)',
          8: 'var(--el-color-primary-light-8)',
          9: 'var(--el-color-primary-light-9)',
        },
        dark: {
          2: 'var(--el-color-primary-dark-2)',
        },
      },

      success: {
        DEFAULT: 'var(--el-color-success)',
        light: {
          3: 'var(--el-color-success-light-3)',
          5: 'var(--el-color-success-light-5)',
          7: 'var(--el-color-success-light-7)',
          8: 'var(--el-color-success-light-8)',
          9: 'var(--el-color-success-light-9)',
        },
        dark: {
          2: 'var(--el-color-success-dark-2)',
        },
      },

      warning: {
        DEFAULT: 'var(--el-color-warning)',
        light: {
          3: 'var(--el-color-warning-light-3)',
          5: 'var(--el-color-warning-light-5)',
          7: 'var(--el-color-warning-light-7)',
          8: 'var(--el-color-warning-light-8)',
          9: 'var(--el-color-warning-light-9)',
        },
        dark: {
          2: 'var(--el-color-warning-dark-2)',
        },
      },

      danger: {
        DEFAULT: 'var(--el-color-danger)',

        light: {
          3: 'var(--el-color-danger-light-3)',
          5: 'var(--el-color-danger-light-5)',
          7: 'var(--el-color-danger-light-7)',
          8: 'var(--el-color-danger-light-8)',
          9: 'var(--el-color-danger-light-9)',
        },
        dark: {
          2: 'var(--el-color-danger-dark-2)',
        },
      },

      error: {
        DEFAULT: 'var(--el-color-error)',
        light: {
          3: 'var(--el-color-error-light-3)',
          5: 'var(--el-color-error-light-5)',
          7: 'var(--el-color-error-light-7)',
          8: 'var(--el-color-error-light-8)',
          9: 'var(--el-color-error-light-9)',
        },
        dark: {
          2: 'var(--el-color-error-dark-2)',
        },
      },

      info: {
        DEFAULT: 'var(--el-color-info)',
        light: {
          3: 'var(--el-color-info-light-3)',
          5: 'var(--el-color-info-light-5)',
          7: 'var(--el-color-info-light-7)',
          8: 'var(--el-color-info-light-8)',
          9: 'var(--el-color-info-light-9)',
        },
        dark: {
          2: 'var(--el-color-info-dark-2)',
        },
      },

      bg: {
        DEFAULT: 'var(--el-bg-color)',
        page: 'var(--el-bg-color-page)',
        overlay: 'var(--el-bg-color-overlay)',
      },

      text: {
        primary: 'var(--el-text-color-primary)',
        regular: 'var(--el-text-color-regular)',
        secondary: 'var(--el-text-color-secondary)',
        placeholder: 'var(--el-text-color-placeholder)',
        disabled: 'var(--el-text-color-disabled)',
      },

      border: {
        DEFAULT: 'var(--el-border-color)',
        light: 'var(--el-border-color-light)',
        lighter: 'var(--el-border-color-lighter)',
        extraLight: 'var(--el-border-color-extra-light)',
        dark: 'var(--el-border-color-dark)',
        darker: 'var(--el-border-color-darker)',
        hover: 'var(--el-border-color-hover)',
      },

      fill: {
        DEFAULT: 'var(--el-fill-color)',
        light: 'var(--el-fill-color-light)',
        lighter: 'var(--el-fill-color-lighter)',
        extraLight: 'var(--el-fill-color-extra-light)',
        dark: 'var(--el-fill-color-dark)',
        darker: 'var(--el-fill-color-darker)',
        blank: 'var(--el-fill-color-blank)',
      },

      disabled: {
        bg: 'var(--el-disabled-bg-color)',
        text: 'var(--el-disabled-text-color)',
        border: 'var(--el-disabled-border-color)',
      },

      overlay: {
        DEFAULT: 'var(--el-overlay-color)',
        light: 'var(--el-overlay-color-light)',
        lighter: 'var(--el-overlay-color-lighter)',
      },

      mask: {
        DEFAULT: 'var(--el-mask-color)',
        extraLight: 'var(--el-mask-color-extra-light)',
      },
      svgMonochromeGrey: 'var(--el-svg-monochrome-grey)',
    },
    boxShadow: {
      danger: '0 0 0 1px var(--el-color-danger) inset',
    },
  },
  shortcuts: [
    ['text-helper', 'text-13px leading-20px mb-4px font-medium'],
    ['flex-center', 'flex items-center justify-center'],
    ['el-form-label', '[&_.el-form-item\\_\\_label]:(mb-2px! font-semibold!)'],
  ],
  presets: [
    presetTypography(),
    presetAttributify(),
    presetIcons({
      warn: true,
      collections: {
        ep: () => import('@iconify-json/ep/icons.json').then((i) => i.default as any),
        carbon: () => import('@iconify-json/carbon/icons.json').then((i) => i.default as any),
      },
    }),
    presetUno(),
  ],
  safelist: [],
  rules: [
    ['box-shadow', { 'box-shadow': 'var(--el-box-shadow)' }],
    ['box-shadow-light', { 'box-shadow': 'var(--el-box-shadow-light)' }],
    ['box-shadow-lighter', { 'box-shadow': 'var(--el-box-shadow-lighter)' }],
    ['box-shadow-dark', { 'box-shadow': 'var(--el-box-shadow-dark)' }],
    ['break-word', { 'word-break': 'break-word' }],
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  preflights: [
    {
      getCSS: () => `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes heroPattern {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-slower { animation: float 7s ease-in-out infinite; }
        .animate-fade-in-down { animation: fadeInDown 0.6s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out 0.2s both; }
        .animate-fade-in-up-delay { animation: fadeInUp 0.6s ease-out 0.4s both; }
        .animate-bounce-in { animation: bounceIn 0.6s ease-out; }
        .animate-hero-pattern { animation: heroPattern 20s linear infinite; }
      `,
    },
  ],
};

export default defineConfig(unoConfig);
