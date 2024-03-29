import antfu from '@antfu/eslint-config'
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

export default antfu(
  {},
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt',
      '**/.output',
      '**/.github',
      '**/coverage',
      '**/nuxt.d.ts',
      '**/.DS_Store',
      '**/.vscode',
      '**/**.yml',
      '**/**.md',
      'packages/nuxt/playground/pergel',
      'packages/nuxt/pergel',
      '**/README.yaml',
      '**/README.json',
      '**/templates/*.json',
      '**/templates.json',
      'packages-core/pergel/nuxt.js',
      '**/pergel/**',
      '**/ios/**',
      '**/android/**',
    ],
  },
  {
    files: ['**/*.vue'],
    plugins: {
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      'vue/html-self-closing': 'off',
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/enforces-negative-arbitrary-values': 'warn',
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/migration-from-tailwind-2': 'off',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'import/first': 'off',
      'symbol-description': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'symbol-description': 'off',
    },
  },
  {
    rules: {
      'no-console': 'warn',
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'n/prefer-global/process': 'off',
      'node/prefer-global/process': 'off',
      'ts/consistent-type-definitions': 'off',
      'ts/ban-ts-comment': 'off',
      'ts/prefer-ts-expect-error': 'off',
    },
  },
  {
    files: [
      '**/tests/**/*.ts',
    ],
    rules: {
      'unused-imports/no-unused-vars': 'off',
    },
  },
)
