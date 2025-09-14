import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'log-build',
      buildStart() {
        console.log('Build starting...');
      },
      buildEnd(error) {
        if (error) {
          console.error('Build failed:', error);
        } else {
          console.log('Build completed successfully');
        }
      }
    }
  ],
  base: '/admin/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      onwarn(warning, warn) {
        console.log('Rollup warning:', warning);
        warn(warning);
      }
    }
  },
  logLevel: 'info'
}) 