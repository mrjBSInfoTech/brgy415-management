import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy':
        "default-src 'self' http://localhost:5000 http://localhost:5173 https://*.up.railway.app; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob: http://localhost:5000 https://*.up.railway.app https://maps.googleapis.com https://maps.gstatic.com https://*.google.com; frame-src 'self' https://www.google.com https://maps.google.com; connect-src 'self' http://localhost:5000 ws://localhost:5173 ws://localhost:5174 https://*.up.railway.app https://places.googleapis.com https://maps.googleapis.com; frame-ancestors 'self'; form-action 'self';",
    },
  },
})
