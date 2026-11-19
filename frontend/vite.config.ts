import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, ".", "");
  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const apiProxyTarget =
    processEnv?.VITE_API_PROXY_TARGET ??
    fileEnv.VITE_API_PROXY_TARGET ??
    "http://localhost:4000";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: "0.0.0.0",
      port: 4174,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true
        },
        "/uploads": {
          target: apiProxyTarget,
          changeOrigin: true
        }
      }
    },
    preview: {
      host: "0.0.0.0",
      port: 4174
    }
  };
});
