import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works at a project path
  // (github.io/<repo>/), a user-site root, or a custom domain.
  base: './',
})
