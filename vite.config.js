import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 1. Increases the limit to 1000kb to reduce warning noise
    chunkSizeWarningLimit: 1000,
    
    // 2. Ensures modern CSS features like @property are handled correctly
    cssTarget: 'chrome80', 

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Further split large libraries if needed
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('framer-motion')) return 'vendor-animation';
            return 'vendor';
          }
        },
      },
    },
  },
})