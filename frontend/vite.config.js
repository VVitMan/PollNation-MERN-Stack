import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Optional: setup file to extend Jest matchers like jest-dom
    provider: 'c8', // Use c8 for coverage
      reportsDirectory: './coverage', // Output directory for coverage reports
      all: true, // Include all files in coverage
      include: ['src/**/*.{js,jsx,ts,tsx}'], // Files to include
      exclude: ['node_modules', 'dist', '**/*.test.{js,ts}'], // Files to exclude
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,      // Use the same port (optional)
    proxy: {
      '/api': {
        target: 'http://54.83.86.180:3000', // Backend API
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
