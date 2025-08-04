import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  ignores: [
    '**/database.types.ts',
    '.vscode/**',
    '.nuxt/**',
    '.output/**',
  ],
  features: {
    stylistic: {
      semi: false,
      indent: 2, // 4 or 'tab'
      quotes: 'single',
    },
  },
  rules: {
    // 'comma-dangle': [
    //   'error',
    //   'always-multiline',
    // ],
    'vue/multi-word-component-names': 0,
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
  },
})
  .override('nuxt/stylistic', {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/space-before-function-paren': ['error', 'always'],
    },
  })
