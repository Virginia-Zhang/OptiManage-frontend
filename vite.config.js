import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue()],
  // Src alias configuration
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // proxy config

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    }
  }
})
