import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/ai-chat/',
  resolve: {
    alias: {
      '@cdek/primereact': path.resolve(__dirname, 'primereact-master/src/index.ts'),
    },
  },
})
