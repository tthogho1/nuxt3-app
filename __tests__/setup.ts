import { vi } from 'vitest'

vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      mongodbKey: 'test_key'
    },
    mongodbAtlasGraphqlCountryUrl: 'https://test.url'
  })
}))