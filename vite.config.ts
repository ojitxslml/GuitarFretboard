import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Establece la ruta base para los recursos
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
