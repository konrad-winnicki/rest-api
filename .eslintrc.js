module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        //"jest/globals": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            files: ["contexts/{backend,frontend}/*/src/**/*.ts"],
            rules: {
              "hexagonal-architecture/enforce": ["error"],
            },
          },
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "hexagonal-architecture",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/no-var-requires": "off"
    },
    "ignorePatterns": [
        'dist/**'
      ],
    "root": true
}
