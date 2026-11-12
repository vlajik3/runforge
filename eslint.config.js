import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.agents', 'tmp', '.idea']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      curly: ['error', 'all'],
      'no-void': 'error',
      'no-restricted-syntax': [
        'error',
        { selector: 'TSAsExpression', message: 'Не используйте приведения через as.' },
        {
          selector: 'TryStatement',
          message: 'Используйте принятый механизм обработки ошибок без try/catch.',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: ['interface', 'typeAlias'], format: ['PascalCase'], prefix: ['I'] },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },
]);
