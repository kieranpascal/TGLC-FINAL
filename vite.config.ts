import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load only explicitly public VITE_* build-time variables; keep server secrets
  // (such as BREVO_API_KEY) strictly in Cloudflare Pages / Workers runtime env.
  loadEnv(mode, process.cwd(), 'VITE_');

  return {
    base: '/',
    envPrefix: 'VITE_',
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'motion/react', 'lucide-react'],
    },
    build: {
      outDir: 'dist',
      target: 'es2022',
      sourcemap: false,
      chunkSizeWarningLimit: 650,
    },
    ssr: {
      target: 'node',
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
