module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['prettier'],
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
    'plugin:prettier/recommended',
    'prettier/vue'
  ],
  rules: {
    'end-of-line': 0,
    'prettier/prettier': ['error'],
    'vue/singleline-html-element-content-newline': 0,
    'no-return-assign': ['error', 'except-parens'],
    'no-shadow': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-destructuring': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
