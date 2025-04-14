// vitest.config.ts
//import { defineVitestConfig } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '#imports': path.resolve(__dirname, '.nuxt/imports.d.ts'),
      '#app': path.resolve(__dirname, 'node_modules/nuxt/dist/app')
    }
  }
})