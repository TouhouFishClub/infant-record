import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueI18n from "@intlify/vite-plugin-vue-i18n";

import { join, resolve } from "path";
export default defineConfig({
  mode: "development",
  resolve: {
    alias: {
      "@": join(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    vueI18n({
      include: resolve(__dirname, "./locales/**"),
    }),
  ],
  define: { "process.env": {} },
  css: {
    preprocessorOptions: {
      scss: { additionalData: ` @import "@/styles/variables.scss";` },
    },
  },
  server: {
    proxy: {
      // 字符串简写写法
      '/p': 'http://localhost:3080',
      // 选项写法
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
});
