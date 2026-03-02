import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'
import path from 'path'

export default defineConfig({
  plugins: [
    commonjs(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@systems': path.resolve(__dirname, '../systems'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
})
