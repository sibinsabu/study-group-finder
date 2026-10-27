import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        register: resolve(import.meta.dirname, 'register.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard.html'),
        myGroups: resolve(import.meta.dirname, 'my-groups.html'),
        profile: resolve(import.meta.dirname, 'profile.html'),
      },
    },
  },
});
