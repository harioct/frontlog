import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GANTI 'gamevault' dengan nama repository GitHub kamu yang sebenarnya
  // Pastikan diawali dan diakhiri dengan tanda garis miring '/'
  base: "/frontlog/", 
})