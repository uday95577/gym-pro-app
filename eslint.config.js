import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    // This section applies to your entire project
    files: ["**/*.{js,jsx}"], // Apply to all JS/JSX files
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      react: pluginReactConfig,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },
  {
    // This section now correctly configures the linter to ignore module type issues
    // for the backend, as Vercel handles it automatically.
    ignores: ["api/"],
  }
];
