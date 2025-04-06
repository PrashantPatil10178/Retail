import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Required for external access like Ngrok
    port: 5173, // Port you're exposing
    allowedHosts: ["falcon-sincere-gelding.ngrok-free.app"],
  },
});
