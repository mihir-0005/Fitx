import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // Allow Render to access the server
    port: process.env.PORT || 5173,  // Use Render's PORT or fallback to 5173
  }
});