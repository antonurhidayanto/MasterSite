import react from '@vitejs/plugin-react';
import { defineConfig } from "vite";
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "site",
      filename: "remoteEntry.js",
      remotes: {
        globalUtils: "https://global-sim.dev90s.digital/assets/remoteEntry.js",
        
      },
      exposes: {
        "./ExposedSite": "./src/components/ExposedSite.tsx",
      },
      shared: [
        "react",
        "react-dom",
        "motion",
        "react-router",
        "tailwindcss",
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: "esnext",
    cssCodeSplit: false,
    minify: false
  },
  server: {
    host: "localhost",
    port: 9001,
    strictPort: true,
  },
  preview: {
    host: "localhost",
    port: 9001,
    strictPort: true,
  },
});
