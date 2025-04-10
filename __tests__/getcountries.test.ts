import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineEventHandler, readBody } from 'h3';



import handler from '../server/api/getCountries';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

vi.mock('nuxt', () => ({
  useRuntimeConfig: vi.fn().mockReturnValue({
    public: {
      mongodbKey: 'test_key'
    },
    mongodbAtlasGraphqlCountryUrl: 'https://test-graphql-url.com'
  })
}));

global.fetch = vi.fn();

describe('国データ取得API', () => {
  const mockEvent = {} as any;
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
    
    // readBodyのモック
    (vi.mocked(readBody) as any).mockResolvedValue({});
    
    // fetchのモック
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockCountriesData,
    } as Response);
  });

  it('正常に国データを取得して整形できること', async () => {
    // テスト実行
    const result = await handler(mockEvent);
    
    // GraphQL APIが正しく呼び出されたか検証
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
    
    // 結果の検証
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

  it('APIエラー時に例外をスローすること', async () => {
    // fetchのモックをエラーケース用に上書き
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({})
    } as Response);
    
    // エラーがスローされることを検証
    await expect(handler(mockEvent)).rejects.toThrow('Network response was not ok.');
  });

  it('readBodyでエラーが発生しても処理が続行されること', async () => {
    // readBodyのモックをエラーケース用に上書き
    vi.mocked(readBody).mockRejectedValue(new Error('Body parse error'));
    
    // テスト実行
    const result = await handler(mockEvent);
    
    // エラーが発生してもAPIが呼び出され、結果が返されることを検証
    expect(global.fetch).toHaveBeenCalled();
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
});
