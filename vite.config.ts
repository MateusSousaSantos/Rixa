import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      // SVG files ending with '?react' will be transformed into React components
      include: "**/*.svg?react",
    }),
  ],
})
