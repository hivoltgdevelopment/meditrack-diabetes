// ESLint flat config (v9)
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  // ignore non-source assets
  { ignores: ["docs/**", ".github/**", "dist/**", "build/**", "*.png", "*.jpg", "*.jpeg", "*.webp", "*.svg"] },

  // base JS rules
  js.configs.recommended,

  // TS rules (safe defaults)
  ...tseslint.configs.recommended,

  // browser globals
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      // keep it gentle
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-console": "off"
    }
  }
];
