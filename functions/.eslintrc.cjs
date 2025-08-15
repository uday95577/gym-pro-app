// IMPORTANT: This file MUST be named ".eslintrc.cjs"
// The .cjs extension is crucial for Node.js to understand this as a CommonJS module.

module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // This line fixes the 'require', 'exports', and 'module' errors
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    ecmaVersion: 8, // Use a specific ECMAScript version
  },
  rules: {
    "quotes": ["error", "double"],
    "max-len": "off", // Turn off max line length rule
    "require-jsdoc": "off", // Turn off JSDoc requirement
  },
};
