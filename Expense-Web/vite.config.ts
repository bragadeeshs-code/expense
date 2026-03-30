import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_URL || "/";
  return {
    plugins: [react(), tailwindcss()],
    base: base,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/auth": {
          target: "https://stg.z-transact.yavar.ai/auth",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, ""),
        },
      },
    },
  };
});
