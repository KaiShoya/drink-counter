import { defineFlatConfigs } from '@nuxt/eslint-config'
import stylistic from '@stylistic/eslint-plugin'
import vue from 'eslint-plugin-vue'

export default defineFlatConfigs({
  ignores: [
    'database.types.ts',
    '.vscode/**',
    '.nuxt/**',
    '.output/**',
  ],
  plugins: {
    '@stylistic': stylistic,
    vue,
  },
  rules: {
    // 'comma-dangle': [
    //   'error',
    //   'always-multiline',
    // ],
    'vue/multi-word-component-names': 0,
    'vue/block-order': [
      'error',
      {
        order: ['spec', 'script', 'template', 'style'],
      },
    ],
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/space-before-function-paren': ['error', 'always'],
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
  },
})
