// @ts-check
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint
  .config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    tseslint.configs.eslintRecommended,
    ...compat.config({
      extends: [
        // 'next', 'next/core-web-vitals',
        'prettier',
        'plugin:jsx-a11y/recommended',
      ],
    }),
    {
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
          ecmaFeatures: {
            jsx: true,
          },
        },
        globals: {
          ...globals.node,
          ...globals.browser,
          ...globals.amd,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      // extends: ['next', 'next/core-web-vitals', 'plugin:jsx-a11y/recommended', 'prettier'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',

        // Remove anchor check if using anchor as a direct child of next/link component
        'jsx-a11y/anchor-is-valid': [
          'error',
          {
            components: ['Link'],
            specialLink: ['hrefLeft', 'hrefRight'],
            aspects: ['invalidHref', 'preferButton'],
          },
        ],
        // Check for alt attribute on next/image component
        'jsx-a11y/alt-text': [
          'error',
          {
            img: ['Image'],
          },
        ],

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    }
  )
  .map(c => {
    return {
      ...c,
      ignores: [...(c.ignores ?? []), 'widget/dist', 'public/script.js'],
    }
  })
