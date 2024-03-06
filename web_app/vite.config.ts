import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // publicDir: './public',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: () => {
          return `assets/css/[name].min.css`
        },
        entryFileNames: () => {
          return 'assets/js/[name].min.js'
        }
      }
    }
  }
})
