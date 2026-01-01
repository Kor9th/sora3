import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
    proxy: {
      "/signup": "http://127.0.0.1:8000",
      "/token": "http://127.0.0.1:8000",
      "/users": "http://127.0.0.1:8000",
      "/verify": "http://127.0.0.1:8000",
    },
  },
});
