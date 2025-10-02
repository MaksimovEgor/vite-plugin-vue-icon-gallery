import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import typescript from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

const prettierRules = {
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  tabWidth: 2,
  printWidth: 100
}

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript ESLint recommended rules
  ...typescript.configs.recommended,

  // Vue recommended rules
  ...vue.configs['flat/recommended'],

  // Prettier config to disable conflicting rules
  prettierConfig,

  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript.plugin,
      prettier,
      import: importPlugin
    },
    rules: {
      'prettier/prettier': ['error', prettierRules],

      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',

      // Vue rules
      'vue/multi-word-component-names': 'off',
      'vue/one-component-per-file': 'off',
      'vue/multiline-html-element-content-newline': ['error', { allowEmptyLines: false }],
      'vue/attribute-hyphenation': ['error', 'never', { ignore: [] }],
      'vue/v-on-event-hyphenation': ['error', 'never', { ignore: [] }],

      // Import rules
      'import/order': [
        'warn',
        { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'] }
      ],
      'import/newline-after-import': ['error', { count: 1 }],

      // General rules
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      curly: ['error', 'all']
    }
  },

  // Specific rules for Vue files
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vue.parser,
      parserOptions: {
        parser: typescript.parser,
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },

  // Ignore patterns
  {
    ignores: [
      'public/**',
      'node_modules/**',
      'dist/**',
      'src/components/app-ui/vue-awesome-paginate/**',
      'src/components/app-svg/**',
      '.history/**',
      '.findUnusedExports.json'
    ]
  }
]
