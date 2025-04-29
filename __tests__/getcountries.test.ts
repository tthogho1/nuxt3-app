import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEvent, readBody } from 'h3';
import { createRequest, createResponse } from 'node-mocks-http';

import handler from '../server/api/getCountries';
import 'dotenv/config';

// // Mocking external and runtime configurations
vi.mock('#imports', () => ({
  useRuntimeConfig: () => ({
    public: {
      mongodbKey: process.env.NUXT_PUBLIC_MONGODB_KEY,
    },
    mongodbAtlasGraphqlCountryUrl: process.env.NUXT_MONGODB_ATLAS_GRAPHQL_COUNTRY_URL,
    hasuraGraphqlUrl: process.env.NUXT_HASURA_GRAPHQL_URL,
    hasuraGraphqlAdminSecret: process.env.NUXT_HASURA_GRAPHQL_ADMIN_SECRET,
  }),
}));

// global.fetch = vi.fn();

describe('Country Data Retrieval API', () => {
  // Node.jsリクエスト/レスポンスの生成
  const nodeReq = createRequest({
    method: 'POST',
    url: '/api/submit',
    headers: { 'Content-Type': 'application/json' },
    body: { test: 123 },
  });
  const nodeRes = createResponse();
  // H3Eventの生成
  const mockEvent = createEvent(nodeReq, nodeRes);

  const mockCountriesData = {
    data: {
      countries: [
        { code: 'JP', country: '日本' },
        { code: 'US', country: 'アメリカ合衆国' },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.only('Successfully retrieves and formats country data', async () => {
    const result = await handler(mockEvent);

    // Check the result data
    expect(result.data.countries).toBeDefined();
    expect(Array.isArray(result.data.countries)).toBe(true);
    expect(result.data.countries.length).toBeGreaterThanOrEqual(20);
  });

  it('Throws an exception for API errors', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({}),
    } as Response);

    // Expect an error due to a failed fetch call
    await expect(handler(mockEvent)).rejects.toThrow('Network response was not ok.');
  });

  it('Continues processing if readBody errors out', async () => {
    vi.mocked(readBody).mockRejectedValue(new Error('Body parse error'));

    const result = await handler(mockEvent);

    expect(global.fetch).toHaveBeenCalled(); // Ensure API call occurs regardless
    expect(result).toEqual({
      ...mockCountriesData,
      data: {
        countries: [
          { country_code: 'JP', country: '日本' },
          { country_code: 'US', country: 'アメリカ合衆国' },
        ],
      },
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
      data: { countries: [] },
    });
  });

  it('Processes query parameters correctly', async () => {
    // Mock event with query parameters
    const eventWithQuery = {
      ...mockEvent,
      context: {
        params: { filter: 'Asia' },
      },
    } as any;

    await handler(eventWithQuery);

    // Verify the GraphQL query includes the filter
    expect(global.fetch).toHaveBeenCalledWith(
      'https://test-graphql-url.com',
      expect.objectContaining({
        body: expect.stringContaining('Asia'),
      })
    );
  });
});
