import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const serverHost = mode === 'dev' ? '0.0.0.0' : 'localhost';

  return {
    plugins: [react()],
    server: {
      host: serverHost,
      port: 8000,
    },
    define: {
      'import.meta.env': env,  // carga el .env correcto
    },
    test: {
      environment: "jsdom",
      globals: true,
      coverage: {
        exclude: [
          'src/main.jsx',       // Ignora main.jsx
          'vite.config.js',     // Ignora vite.config.js
          'eslint.config.js',   // Ignora eslint.config.js
          '**/*.test.{js,jsx,ts,tsx}', // Exclude all test files
          '**/__tests__/**',    // Exclude __tests__ directories
          'set-local-ip.js',    // Ignora set-local-ip.js
        ],
      },
    },
  }
})