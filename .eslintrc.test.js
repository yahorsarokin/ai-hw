module.exports = {
  env: {
    jest: true,
    "jest/globals": true,
  },
  extends: [
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/react",
  ],
  plugins: ["jest", "jest-dom", "testing-library"],
  rules: {
    // Jest-specific rules
    "jest/expect-expect": "error",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jest/valid-describe-callback": "error",
    "jest/consistent-test-it": ["error", { fn: "it" }],
    "jest/prefer-expect-assertions": "off",
    "jest/prefer-to-be": "warn",
    "jest/prefer-to-contain": "warn",
    "jest/prefer-to-be-null": "warn",
    "jest/prefer-to-be-undefined": "warn",
    "jest/require-top-level-describe": "error",
    "jest/no-test-return-statement": "error",

    // Testing Library rules
    "testing-library/await-async-query": "error",
    "testing-library/no-await-sync-query": "error",
    "testing-library/no-debugging-utils": "warn",
    "testing-library/no-dom-import": "error",
    "testing-library/prefer-find-by": "warn",
    "testing-library/prefer-screen-queries": "error",
    "testing-library/render-result-naming-convention": "error",
    "testing-library/no-wait-for-multiple-assertions": "error",
    "testing-library/no-wait-for-side-effects": "error",
    "testing-library/prefer-user-event": "warn",

    // Jest DOM rules
    "jest-dom/prefer-checked": "warn",
    "jest-dom/prefer-enabled-disabled": "warn",
    "jest-dom/prefer-required": "warn",
    "jest-dom/prefer-to-have-attribute": "warn",
    "jest-dom/prefer-to-have-text-content": "warn",

    // General test code quality
    "max-lines": ["error", { max: 500, skipComments: true }],
    "max-nested-callbacks": ["error", 5],
    complexity: ["warn", 10],
  },
  overrides: [
    {
      files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
      env: {
        jest: true,
      },
    },
  ],
};
