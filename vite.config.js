import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['*']
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