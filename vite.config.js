import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // By removing the server.proxy configuration,
  // we simplify the setup and will handle the API path directly in our component.
})
