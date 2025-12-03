import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ganti baris ini agar sesuai nama repo di error log kamu:
  base: "/tugas-mki-frontlog/", 
})