import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/SpeckKit-Project-Development/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
