import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// Flat config (ESLint 9 / Next 16). `next lint` was removed in Next 16, so
// linting runs through the ESLint CLI (`npm run lint` -> `eslint`).
//
// The storefront is TypeScript (strict). We apply the Next plugin's
// core-web-vitals rules + the classic react-hooks rules, and use the
// typescript-eslint parser for .ts/.tsx (parser only — we don't enable the full
// type-aware rule set, keeping the bar focused on Next/hooks correctness).
const eslintConfig = [
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  nextPlugin.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  {
    plugins: { "react-hooks": reactHooks },
    // The classic hooks rules that `next lint` has always enforced. We do not
    // turn on react-hooks v7's newer rules (set-state-in-effect, etc.) here:
    // they flag long-standing patterns throughout this purchased template and
    // are out of scope for a framework version bump.
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // The SONA storefront renders plain <img> on purpose: imagery is styled
      // by the `.sona-img` class (grayscale filter + CSS object-fit) and uses
      // remote hosts, which `next/image` would complicate. Deliberate choice.
      "@next/next/no-img-element": "off",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", "public/**"],
  },
];

export default eslintConfig;
