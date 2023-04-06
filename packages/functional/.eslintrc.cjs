module.exports = {
  root: true,
  extends: ["@srmcguirt/eslint-config", "./.eslintrc-auto-import.json"],
  plugins: [],
  parserOptions: {
    project: ["tsconfig.eslint.json"],
    tsconfigRootDir: __dirname,
  },
  rules: {},
  ignorePatterns: ["dist/**"],
};
