import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  
  base: './',
  
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json']
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'tone': ['tone'],
          'midi': ['midi-player-js', 'midi-writer-js']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    open: true
  }
})
