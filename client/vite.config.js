import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

import manifest from './manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      includeAssets: ["logo-32x32.png", "logo-144x144.png"],
      devOptions: { enabled: false },
      workbox: { globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'] }
    })
  ]
});
