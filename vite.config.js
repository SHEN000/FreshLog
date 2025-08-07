import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // 確保這行有
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://43.199.27.51",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // 保持路徑不變
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request:", req.method, req.url);
          });
        },
      },
    },
  },
});
