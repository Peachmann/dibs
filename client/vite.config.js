import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  if (command !== 'build') {
    return {
      plugins: [react()],
      server: {
        host: 'dibs-app-dev.com',
        port: 80
      }
    };
  } else {
    return {
      plugins: [react()]
    };
  }
});
