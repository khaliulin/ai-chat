import { StorybookConfig } from '@storybook/react-vite';
import { type InlineConfig, mergeConfig } from 'vite';

const config: StorybookConfig = {
  core: {
    builder: '@storybook/builder-vite',
    disableTelemetry: true, // 👈 Disables telemetry
  },
  stories: [
    '../src/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/hooks/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    // '@storybook/addon-onboarding',
    '@github-ui/storybook-addon-performance-panel',
  ],
  docs: {
    // docsMode: true,
  },
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config: InlineConfig) => {
    // Находим индекс плагина dts и убираем его из конфига для Storybook
    // const plugins = config.plugins?.filter((p: any) => {
    //   // Имя плагина vite-plugin-dts обычно 'vite:dts' или можно проверить по конструктору
    //   return p?.name !== 'vite:dts';
    // });

    // config — это конфиг Vite, который использует Storybook
    return mergeConfig(config, {
      // plugins, // Возвращаем конфиг без плагина генерации типов
      build: {
        lib: false, // Отключаем режим библиотеки
        outDir: '../storybook-static-temp', // Временная папка, чтобы не мешать
        rollupOptions: {
          external: [],
          output: { globals: {} },
        },
      },
    });
  },
};

export default config;
