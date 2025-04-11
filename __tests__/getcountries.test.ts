import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEvent, readBody } from 'h3';
import { createRequest, createResponse } from 'node-mocks-http'

import { setup } from '@nuxt/test-utils'

import handler from '../server/api/getCountries';
//import { mockNuxtImport } from '@nuxt/test-utils/runtime';

// Mocking external and runtime configurations
vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      mongodbKey: 'test_key'
    },
    mongodbAtlasGraphqlCountryUrl: 'https://test.url'
  })
}))

//global.fetch = vi.fn();

describe('Country Data Retrieval API', () => {
  // Node.jsリクエスト/レスポンスの生成
  const nodeReq = createRequest({
    method: 'POST',
    url: '/api/submit',
    headers: { 'Content-Type': 'application/json' },
    body: { test: 123 }
  })
  const nodeRes = createResponse()
  // H3Eventの生成
  const mockEvent = createEvent(nodeReq, nodeRes)

  const mockCountriesData = {
    data: {
      countries: [
        { code: 'JP', country: '日本' },
        { code: 'US', country: 'アメリカ合衆国' }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Successfully retrieves and formats country data', async () => {
    await setup({
      server: true, // Nuxtサーバーを起動
      build: true,
      port: 3000,    // 任意のポート指定
      env: {
        NUXT_PUBLIC_MONGODB_KEY: 'test_key', // 直接指定も可能
        NUXT_MONGODB_ATLAS_GRAPHQL_COUNTRY_URL: 'https://test.url'
      }
    })

    it('環境変数読み込みテスト', () => {
      const config = useRuntimeConfig()
      expect(config.public.mongodbKey).toBe('test_key')
    })

    const result = await handler(mockEvent);
    // const result = await $fetch('/api/getCountries')
    // Verify the correct GraphQL API call
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-graphql-url.com',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'apiKey': 'test_key',
          'Content-Type': 'application/json'
        },
        body: expect.any(String)
      })
    );
    
    // Check the result formatting
    expect(result).toEqual({
      ...mockCountriesData,
      data: {
        countries: [
          { country_code: 'JP', country: '日本' },
          { country_code: 'US', country: 'アメリカ合衆国' }
        ]
      }
    });
  });

  it('Throws an exception for API errors', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({})
    } as Response);
    
    // Expect an error due to a failed fetch call
    await expect(handler(mockEvent)).rejects.toThrow('Network response was not ok.');
  });

  it('Continues processing if readBody errors out', async () => {
    vi.mocked(readBody).mockRejectedValue(new Error('Body parse error'));
    
    const result = await handler(mockEvent);
    
    expect(global.fetch).toHaveBeenCalled();  // Ensure API call occurs regardless
    expect(result).toEqual({
      ...mockCountriesData,
      data: {
        countries: [
          { country_code: 'JP', country: '日本' },
          { country_code: 'US', country: 'アメリカ合衆国' }
        ]
      }
    });
  });

  it('Handles fetch network errors gracefully', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network Error'));
    
    await expect(handler(mockEvent)).rejects.toThrow('Network Error');
  });

  it('Handles empty country data correctly', async () => {
    // Mock empty countries array
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ data: { countries: [] } }),
    } as Response);
    
    const result = await handler(mockEvent);
    
    expect(result).toEqual({
      data: { countries: [] }
    });
  });

  it('Processes query parameters correctly', async () => {
    // Mock event with query parameters
    const eventWithQuery = {
      ...mockEvent,
      context: {
        params: { filter: 'Asia' }
      }
    } as any;
    
    await handler(eventWithQuery);
    
    // Verify the GraphQL query includes the filter
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-graphql-url.com',
      expect.objectContaining({
        body: expect.stringContaining('Asia')
      })
    );
  });
});
