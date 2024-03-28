import type { OptionsConfig } from '@antfu/eslint-config'

// @ts-ignore
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

export function pergelEslintConfig(input?: {
  tailwindcss?: OptionsConfig
  pergel?: OptionsConfig
}) {
  return [
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
        'ts/consistent-type-definitions': 'off',
      },
      ...input?.tailwindcss ?? {},
    },
    {
      ignores: [
        'node_modules/',
        'dist/',
        '**/node_modules/**',
        '**/dist/**',
        '**/.nuxt',
        '**/.output',
        '**/.output/**',
        '**/.dist',
        '**/.github',
        '**/coverage',
        '**/nuxt.d.ts',
        '**/.DS_Store',
        '**/.vscode',
        '**/README.json',
        '**/templates/*.json',
        '**/templates.json',
        'packages-core/pergel/nuxt.js',
        '**/pergel/**',
        '**/migrations/**',
        'migrations',
        // Capacitor specific ignores
        '**/ios/**',
        '**/android/**',
      ],
      ...input?.pergel ?? {},
    },
    {
      rules: {
        'node/prefer-global/process': 'off',
      },
    },
  ]
}

export default pergelEslintConfig
