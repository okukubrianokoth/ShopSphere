import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,       // React frontend port
    strictPort: true, // throws error if port is taken
  },
});
