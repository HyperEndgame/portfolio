import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// served behind zectron.net/portfolio (Next.js rewrite)
export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  preview: { allowedHosts: true },
})
