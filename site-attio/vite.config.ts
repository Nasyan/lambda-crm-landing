import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Порт 5174 занят старым лендингом — этот поднимаем на 5175.
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: false },
})
