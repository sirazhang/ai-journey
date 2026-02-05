import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  build: {
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.* statements in production
        drop_console: true,
        drop_debugger: true,
        // Keep console.error for critical error logging
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    },
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer-motion': ['framer-motion'],
          'date-fns': ['date-fns']
        }
      }
    }
  }
})
