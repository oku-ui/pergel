import antfu from '@antfu/eslint-config'

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
    ],
  },
  {
    rules: {
      'no-console': 'warn',
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'n/prefer-global/process': 'off',
      'node/prefer-global/process': 'off',
      'ts/consistent-type-definitions': 'off',
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
