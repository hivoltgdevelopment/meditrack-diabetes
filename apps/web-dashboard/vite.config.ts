// apps/web-dashboard/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Set this to your repo name for GitHub Pages.
// Change to "/" if you later use a custom domain (CNAME).
const isGhPages = true; // set false if deploying elsewhere
const base = isGhPages ? "/meditrack-diabetes/" : "/";

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
{
  "compilerOptions": {
    "types": ["vite/client"],
    "moduleResolution": "node",
    "module": "ESNext",
    "target": "ESNext",
    "jsx": "react-jsx"
  }
}
