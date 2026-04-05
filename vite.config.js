import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expone en la red local para que el celular acceda por QR
    port: 3000,
  }
})

