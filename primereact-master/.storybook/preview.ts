import { definePreview, ReactRenderer } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { DocsTypes } from '@storybook/addon-docs';
import addonPerformancePanel from '@github-ui/storybook-addon-performance-panel';
import '@cdek-it/typography/dist/index.min.css';
import '../src/utils/icons.scss';
import '../src/themes/theme-light/theme.scss';
import './tailwind.css';

const docs: DocsTypes['parameters']['docs'] = {
  toc: true, // 👈 Enables the table of contents
};

const preview = definePreview({
  addons: [addonPerformancePanel()],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs,
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  // tags: ['autodocs'],
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  globalTypes: {
    theme: {
      defaultValue: 'light',
    },
  },
});

export default preview;
