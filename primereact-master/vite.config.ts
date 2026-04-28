import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const isStorybook = process.env.STORYBOOK_BUILD === 'true';

export default defineConfig({
  plugins: [
    react(),
    !isStorybook &&
      dts({
        include: ['src/**/*'],
        exclude: [
          'src/**/*.stories.tsx',
          'src/**/*.test.tsx',
          'vite.config.ts',
        ],
        rollupTypes: true,
        outDir: 'dist/types',
        tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
      }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/theme-base/*',
          dest: 'theme-base',
        },
        {
          src: 'src/themes/*',
          dest: 'themes',
        },
        {
          src: 'src/utils/*',
          dest: 'utils',
        },
        {
          src: 'src/tokens/*.scss',
          dest: 'tokens',
        },
        {
          src: 'src/style.scss',
          dest: '',
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'tailwind-config': resolve(__dirname, 'src/tailwind-config.ts'),
      },
      name: 'CdekPrimereact',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^primereact\/.*/,
        /^@primeuix\/.*/,
      ],
      output: [
        {
          format: 'es',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs',
          chunkFileNames: '[name].mjs',
        },
        // Если нужно поддерживать CommonJS, раскомментируйте этот блок
        {
          format: 'cjs',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
        },
      ],
    },
    sourcemap: false,
    minify: false,
    // Отключаем обработку CSS ассетов в либе, если стили вынесены отдельно или инлайн
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['@storybook/addon-docs'],
  },
});
