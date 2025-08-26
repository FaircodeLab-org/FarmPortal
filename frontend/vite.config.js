import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,         // listen on 0.0.0.0 (helps on WSL/containers)
//     port: 3000,
//     allowedHosts: [
//       /\.ngrok-(free|dev)\.app$/  // allow any ngrok domain
//     ],
//     proxy: {
//       // Keep local proxy for dev; won’t be used once API is public, but harmless.
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         ws: true,
//       }
//     },
//     hmr: {
//       // These two make HMR work through HTTPS tunnels
//       protocol: 'wss',
//       clientPort: 443
//       // (Optional) If you use a reserved static ngrok domain, set:
//       // host: 'your-reserved-name.ngrok.dev'
//     }
//   }
// })
// frontend/vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     // This allows ngrok's public URL to connect to your Vite dev server
//     host: '0.0.0.0', // Listen on all network interfaces
//     hmr: {
//       clientPort: 443, // Use 443 for secure websockets with ngrok
//       host: new URL(process.env.VITE_FRONTEND_URL || 'http://localhost:3000').hostname
//     },
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000', // This can stay for local dev
//         changeOrigin: true
//       }
//     }
//   }
// })

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     host: '0.0.0.0',
//     hmr: {
//       protocol: 'ws',
//       host: 'localhost',
//       port: 3000
//     },
//     // This is the key part - disable host check
//     strictPort: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true
//       }
//     }
//   }
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     host: '0.0.0.0'
//   }
// })

// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//   // Load .env file based on the current mode (e.g., 'development')
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     plugins: [react()],
//     server: {
//       port: 3000,
//       host: '0.0.0.0', // This is crucial to listen on all network interfaces in WSL

//       // THIS IS THE DIRECT FIX FOR YOUR NGROK ERROR
//       // It explicitly allows the public host provided by ngrok.
//       allowedHosts: [
//         // Get the hostname (e.g., "6e87c7b1732d.ngrok-free.app") from your .env file
//         env.VITE_FRONTEND_URL ? new URL(env.VITE_FRONTEND_URL).hostname : 'localhost',
//       ],
      
//       // Configuration for Hot Module Replacement (HMR) to work with ngrok
//       hmr: {
//         protocol: 'wss', // Use secure websocket
//         host: env.VITE_FRONTEND_URL ? new URL(env.VITE_FRONTEND_URL).hostname : 'localhost',
//         clientPort: 443,
//       },
//     }
//   }
// // })
// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');

//   return {
//     plugins: [react()],
//     server: {
//       port: 3000,
//       host: '0.0.0.0',
      
//       // Allow ngrok host
//       allowedHosts: [
//         env.VITE_FRONTEND_URL ? new URL(env.VITE_FRONTEND_URL).hostname : 'localhost',
//       ],
      
//       // HMR configuration for ngrok
//       hmr: {
//         protocol: 'wss',
//         host: env.VITE_FRONTEND_URL ? new URL(env.VITE_FRONTEND_URL).hostname : 'localhost',
//         clientPort: 443,
//       },
      
//       // PROXY CONFIGURATION - THIS IS WHAT WAS MISSING!
//       proxy: {
//         '/api': {
//           target: 'http://localhost:5000',
//           changeOrigin: true
//         }
//       }
//     }
//   }
// })