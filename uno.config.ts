import type {
  UserConfig,
} from 'unocss'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export const unoConfig: UserConfig = {
  theme: {
    colors: {
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
        ep: () => import('@iconify-json/ep/icons.json').then(i => i.default as any),
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default as any),
      },
    }),
    presetUno(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: {
          name: 'Inter',
          weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
          italic: true,
        },
        jakarta: {
          name: 'Plus Jakarta Sans',
          weights: ['200', '300', '400', '500', '600', '700', '800', '900'],
          italic: true,
        },
      },
    }),
  ],
  safelist: [],
  rules: [
    ['box-shadow', { 'box-shadow': 'var(--el-box-shadow)' }],
    ['box-shadow-light', { 'box-shadow': 'var(--el-box-shadow-light)' }],
    ['box-shadow-lighter', { 'box-shadow': 'var(--el-box-shadow-lighter)' }],
    ['box-shadow-dark', { 'box-shadow': 'var(--el-box-shadow-dark)' }],
    ['break-word', { 'word-break': 'break-word' }],
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
}

export default defineConfig(unoConfig)
