import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['./scripts/jscolor.js']
  },
  build: {
    minify: 'esbuild',
    target: "esnext",
    rollupOptions: {
      external: [
        "ipfs", "walletconnect",
      ],
    },
  }
})

// https://vitejs.dev/config/
// module.exports = {
//   optimizeDeps: {
//     exclude: ['ipfs-http-client', 'electron-fetch']
//   }
//  }