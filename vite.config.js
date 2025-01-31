import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist' // Vercel은 기본적으로 이 폴더를 인식
  }
})
