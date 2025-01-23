import { defineConfig } from 'vite'

export default defineConfig({
  base: '/turbines/freecad/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}) 