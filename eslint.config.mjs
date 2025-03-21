import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    ignores: [
      'database.types.ts',
      '.vscode/**',
    ],
  },
  {
    rules: {
      // 'comma-dangle': [
      //   'error',
      //   'always-multiline',
      // ],
      'vue/multi-word-component-names': 0,
    },
  },
])
  .override('nuxt/stylistic', {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/space-before-function-paren': ['error', 'always'],
    },
  })

// export default defineConfig([{
//     extends: compat.extends(
//         "plugin:vue/vue3-recommended",
//         "eslint:recommended",
//         "@nuxtjs/eslint-config-typescript",
//     ),

//     languageOptions: {
//         globals: {
//             ...globals.browser,
//         },
//     },

//     rules: {
//         "comma-dangle": ["error", "always-multiline"],
//         "vue/multi-word-component-names": ["off"],
//     },
// }]);
