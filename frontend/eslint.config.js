import js from "@eslint/js"
import tseslint from "typescript-eslint"
import astroParser from "astro-eslint-parser"
import astroPlugin from "eslint-plugin-astro"

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
      },
    },
    plugins: {
      astro: astroPlugin,
    },
  },
  {
    ignores: ["dist/", "node_modules/", ".astro/"],
  },
]
