import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import { resolve } from 'path';
// @ts-ignore
import { fileURLToPath } from 'url';
// @ts-ignore
import { dirname } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'demo'),
  publicDir: resolve(__dirname, 'public'),
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: resolve(__dirname, 'tailwind.config.js'),
        }),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: resolve(__dirname, 'dist-demo'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  }
});

