import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    rollupOptions: {
      // Portfolio + standalone demo pages (served at /demo/<name>/)
      input: {
        main: 'index.html',
        los: 'demo/los/index.html',
      },
    },
  },
})
