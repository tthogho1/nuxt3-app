// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

import path from 'path'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: './', // テスト用の別設定を指定可能
        domEnvironment: 'jsdom' // 環境オプションのカスタマイズ
      }
    }
  }
})
