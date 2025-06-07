import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  base: './',
  plugins: [
    viteSingleFile(),
  ],
  build: {
    outDir: 'public',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  preview: {
    allowedHosts: ['.loca.lt'],
  }
})
