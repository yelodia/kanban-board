import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import injectHtml from 'vite-plugin-html-inject'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    injectHtml()
  ]
})
