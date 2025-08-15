// eslint.config.js (flat, ESLint v9)
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "node_modules/",
      "dist/",
      "web-build/",
      ".expo/",
      "supabase/.temp/",
      ".supabase/",
    ],
    languageOptions: {
      parserOptions: {
        // no project type-check here; tsc handles it in `npm run typecheck`
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      // reasonable TS defaults
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  // React-specific tweaks (web + RN)
  {
    files: ["apps/**/src/**/*.{ts,tsx}", "apps/**/app/**/*.{ts,tsx}"],
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
];
