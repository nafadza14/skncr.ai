
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Defines process.env.API_KEY for use in the browser build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
});
