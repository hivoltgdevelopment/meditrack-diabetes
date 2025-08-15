import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you later use a custom domain (CNAME), change base to "/"
export default defineConfig({
  plugins: [react()],
  base: "/meditrack-diabetes/",
  build: { outDir: "dist" },
});
