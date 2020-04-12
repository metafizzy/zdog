/* eslint-env node */

module.exports = {
  plugins: [ 'metafizzy' ],
  extends: 'plugin:metafizzy/browser',
  env: {
    browser: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 5,
  },
  rules: {
    'no-var': 'off',
    'max-params': [ 'error', {
      max: 5,
    } ],
  },
};
