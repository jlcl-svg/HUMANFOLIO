import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Isso garante que o código 'process.env' não quebre no navegador
    'process.env': {}
  }
});