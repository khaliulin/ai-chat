import tailwindcss from 'tailwindcss';
import {
  iconsPluginCallback,
  screens,
  themeExtend,
} from './src/tailwind-config';
import plugin from 'tailwindcss/plugin';

const config: tailwindcss.Config = {
  content: ['./src/stories/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens,
    extend: {
      ...themeExtend,
    },
  },
  plugins: [plugin(iconsPluginCallback)],
};

export default config;
