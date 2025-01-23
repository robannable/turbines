import { defineConfig } from 'vite'

export default defineConfig({
  base: '/turbines/freecad/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
}) 