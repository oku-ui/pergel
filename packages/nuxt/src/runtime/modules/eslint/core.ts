import type { UserConfigItem } from '@antfu/eslint-config'
import defu from 'defu'

// @ts-ignore
import tailwindcssPlugin from 'eslint-plugin-tailwindcss'

export function pergelEslintConfig(input: {
  tailwindcss: UserConfigItem
  pergel: UserConfigItem
}): UserConfigItem[] {
  const tailwindcss = defu(input.tailwindcss, {
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
  } satisfies UserConfigItem) as UserConfigItem

  const pergel = defu(input.pergel, {
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
    ],
  } satisfies UserConfigItem) as UserConfigItem

  return [
    tailwindcss,
    pergel,
  ]
}

export default pergelEslintConfig
