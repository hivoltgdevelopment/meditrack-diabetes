import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/meditrack-diabetes/",
  build: { outDir: "dist", sourcemap: true }
});
