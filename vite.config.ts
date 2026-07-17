import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://chenniwang.github.io/leetcode-tracker/
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
