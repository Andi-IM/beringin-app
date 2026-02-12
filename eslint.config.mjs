import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Ignore build artifacts, dependencies, and config files
  {
    ignores: [
      '.next/**',
      '.edgeone/**',
      'node_modules/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      'jest.setup.js',
      'edge-functions/**',
    ],
  },
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  // Relax rules for test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['react', 'next', 'next/router', 'next/navigation'],
          patterns: ['@/infrastructure/**', '@/app/**'],
        },
      ],
    },
  },
  // UI pages - MVP allows direct infrastructure access, restrict only fetch
  {
    files: ['src/app/**/*.tsx', 'src/app/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'Data fetching should be handled in the Infrastructure layer via Repositories, not directly in the UI.',
        },
      ],
    },
  },
  {
    files: ['src/application/usecases/**/*.ts'],
    rules: {
      // Use cases can import from infrastructure for repository interfaces
      // This is acceptable in Clean Architecture: dependency injection
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
          suffix: ['UseCase'],
        },
      ],
    },
  },
  {
    files: ['src/infrastructure/repositories/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['class', 'interface'],
          format: ['PascalCase'],
          suffix: ['Repository'],
        },
      ],
    },
  },
  {
    files: ['src/domain/policies/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
          suffix: ['Policy'],
        },
      ],
    },
  },
  {
    files: ['src/domain/entities/**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
          suffix: ['Entity'],
        },
      ],
    },
  },
]

export default eslintConfig
