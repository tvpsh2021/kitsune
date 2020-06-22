module.exports = {
  "env": {
    "commonjs": true,
    // "es6": true,
    "browser": true,
    "webextensions": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "semi": ["error", "always"],
    "object-curly-spacing": ["error", "always"]
  }
};
