import { defineFlatConfigs } from '@nuxt/eslint-config'

export default defineFlatConfigs({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  ignores: [
    'database.types.ts',
    '.vscode/**',
  ],
  rules: {
    // 'comma-dangle': [
    //   'error',
    //   'always-multiline',
    // ],
    'vue/multi-word-component-names': 0,
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/space-before-function-paren': ['error', 'always'],
  },
})
