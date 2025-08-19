import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  {
    // This section applies to your entire project
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }, // Allow both browser and node globals
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      react: pluginReactConfig,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Not needed with modern React/Vite
      "react/prop-types": "off", // Disable prop-types for this project
    },
  },
  {
    // --- THIS IS THE NEW, IMPORTANT PART ---
    // This section applies ONLY to files inside the 'api' folder
    files: ["api/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node, // Use ONLY Node.js globals for the API
      },
      sourceType: "commonjs", // Specify that API files use require/module.exports
    },
  },
];
