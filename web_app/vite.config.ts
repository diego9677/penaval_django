import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // publicDir: './public',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (file) => {
          return `assets/css/[name].min.css`
        },
        entryFileNames: (file) => {
          return 'assets/js/[name].min.js'
        }
      }
    }
  }
})
