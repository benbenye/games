module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ['prettier'],
  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
    'eslint-config-prettier'
  ],
  rules: {
    'prettier/prettier': ['error'],
    'vue/max-attributes-per-line': [2, {
      singleline: 5,
      multiline: {
        max: 1,
        allowFirstLine: false
      }
    }],
    'no-return-assign': ['error', 'except-parens'],
    'no-shadow': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
