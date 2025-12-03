import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Pastikan nama repo ini SAMA PERSIS dengan yang ada di URL GitHub kamu
  base: "/tugas-mki-frontlog/", 
})