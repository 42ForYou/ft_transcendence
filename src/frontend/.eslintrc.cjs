"use strict";

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["prettier", "plugin:prettier/recommended", "plugin:react/recommended"],
  plugins: ["prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    strict: ["error", "global"], // "use strict"
    camelcase: "off", // camelCase 사용
    "no-var": "error", // var is not allowed
    // indent: ["error", 2], // 2 spaces
    "linebreak-style": ["error", "unix"], // LF
    quotes: ["error", "double"], // use double quotes
    semi: ["error", "always"], // always use semicolon
    eqeqeq: ["error", "always"], // always use ===
    "prettier/prettier": "error", // Prettier
    "prefer-const": "error", // use const
    "func-style": ["error", "expression"], // 함수 표현식 스타일 권장
    "prefer-rest-params": "error", // Rest 파라미터 사용 권장
    "prefer-spread": "error", // spread 연산자 사용 권장
    "react/prop-types": "off",
    "react/display-name": "off",
  },
};
