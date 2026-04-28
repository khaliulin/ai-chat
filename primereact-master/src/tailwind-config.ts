import { PluginAPI } from 'tailwindcss/types/config';
import {
  colors,
  borderRadius,
  borderWidth,
  boxShadow,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  opacity,
  sizing,
  spacing,
  transitionDuration,
  transitionTimingFunction,
} from './tokens/primitives';

export {
  colors,
  borderRadius,
  borderWidth,
  boxShadow,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  opacity,
  sizing,
  spacing,
  transitionDuration,
  transitionTimingFunction,
} from './tokens/primitives';

const generateColor = (color: string, arr: (number | string)[]) => {
  const initial: Record<string | number, string> = {};

  return arr.reduce((res, value) => {
    res[value] = `var(--${color}-${value})`;
    return res;
  }, initial);
};

const arr_50_950 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const screens = {
  sm: '1px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
};

export const zIndex = {
  '1000': '1000',
  '1010': '1010',
  '1100': '1100',
  '1110': '1110',
};

export const additionalColors = {
  // Common
  current: 'currentColor',
  transparent: 'transparent',
  // Primary
  primary: {
    ...generateColor('primary', arr_50_950),
    DEFAULT: 'var(--primary-500)',
  },
  // Service
  error: {
    ...generateColor('error', arr_50_950),
  },
  warn: {
    ...generateColor('warn', arr_50_950),
  },
  success: {
    ...generateColor('success', arr_50_950),
  },
  info: {
    ...generateColor('info', arr_50_950),
  },
  help: {
    ...generateColor('help', arr_50_950),
  },
  //Surface
  surface: {
    ...generateColor('surface', arr_50_950),
    ground: 'var(--surface-ground)',
    overlay: 'var(--surface-overlay)',
    section: 'var(--surface-section)',
    'ground-hover': 'var(--surface-ground-hover)',
    'section-hover': 'var(--surface-section-hover)',
    'card-on-ground': 'var(--surface-card-on-ground)',
    'card-on-ground-hover': 'var(--surface-card-on-ground-hover)',
    'card-on-section': 'var(--surface-card-on-section)',
    'card-on-section-hover': 'var(--surface-card-on-section-hover)',
    border: 'var(--surface-border)',
    hover: 'var(--surface-hover)',
    transparent: 'var(--surface-transparent)',
  },
  // Text
  'color-secondary': 'var(--text-color-secondary)',
  'color-primary': 'var(--primary-color-text)',
  color: 'var(--text-color)',
  'hover-color': 'var(--text-hoverColor)',
  'primary-color': 'var(--text-primaryColor)',
  'hover-primary-color': 'var(--text-hoverPrimaryColor)',
  'secondary-color': 'var(--text-secondaryColor)',
  'hover-secondary-color': 'var(--text-hoverSecondaryColor)',
  'muted-color': 'var(--text-mutedColor)',
  'hover-muted-color': 'var(--text-hoverMutedColor)',
  'disabled-color': 'var(--text-disabledColor)',
  'info-color': 'var(--text-infoColor)',
  'success-color': 'var(--text-successColor)',
  'danger-color': 'var(--text-dangerColor)',
  'warning-color': 'var(--text-warningColor)',
  'help-color': 'var(--text-helpColor)',
  'extend-color-primary-static': 'var(--text-extend-colorPrimaryStatic)',
  'extend-color-secondary-static': 'var(--text-extend-colorSecondaryStatic)',
  'extend-color-inverted': 'var(--text-extend-colorInverted)',
};

export const additionalBoxShadow = {
  md: '0 3px 5px #00000005,0 0 2px #0000000d,0 1px 4px #00000014',
};

export const additionalFontFamily = {
  primary: 'var(--font-family)',
  secondary: 'var(--font-family-secondary)',
};

/**
 * Для иконок, чтобы можно было использовать icon-2xl, md:icon-3xl и тд
 *
 * @param matchUtilities
 * @param theme
 */
export const iconsPluginCallback = ({
  matchUtilities,
  theme,
}: {
  matchUtilities: PluginAPI['matchUtilities'];
  theme: PluginAPI['theme'];
}): void => {
  const fontSize = theme('fontSize') ?? {};

  matchUtilities(
    {
      icon: value => ({
        'svg&': {
          width: value,
          height: value,
        },
      }),
    },
    {
      values: Object.fromEntries(
        Object.entries(fontSize).map(([key, value]) => [key, value[0]])
      ),
    }
  );
};

export const themeExtend = {
  colors: {
    ...colors,
    ...additionalColors,
  },
  borderRadius: {
    ...borderRadius,
    '4xl': '1.75rem',
  },
  borderWidth: {
    ...borderWidth,
  },
  boxShadow: {
    ...boxShadow,
    ...additionalBoxShadow,
  },
  fontFamily: {
    ...fontFamily,
    ...additionalFontFamily,
  },
  fontSize: {
    ...fontSize,
  },
  fontWeight: {
    ...fontWeight,
  },
  lineHeight: {
    ...lineHeight,
  },
  opacity: {
    ...opacity,
  },
  spacing: {
    ...spacing,
    ...sizing,
  },
  transitionDuration: {
    ...transitionDuration,
  },
  transitionTimingFunction: {
    ...transitionTimingFunction,
  },
  zIndex: {
    ...zIndex,
  },
};
