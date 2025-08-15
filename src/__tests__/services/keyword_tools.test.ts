import { KeywordService } from '../../services/keyword_tools';
import { KeywordGetParams, keywordGetSchema } from '../../utils/validation';
import { KeywordGetResponse } from '../../types/serpstat';
import { GetKeywordsHandler } from '../../handlers/keyword_tools';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

describe('keywordGetSchema', () => {
    it('validates correct parameters', () => {
        const params: KeywordGetParams = {
            keyword: 'iphone',
            se: 'g_us',
            page: 1,
            size: 10
        };
        expect(() => keywordGetSchema.parse(params)).not.toThrow();
    });
    it('rejects missing keyword', () => {
        const params = { se: 'g_us' };
        expect(() => keywordGetSchema.parse(params)).toThrow();
    });
    it('rejects invalid se', () => {
        const params = { keyword: 'iphone', se: 'g_xx' };
        expect(() => keywordGetSchema.parse(params)).toThrow();
    });
    it('rejects too long keyword', () => {
        const params = { keyword: 'a'.repeat(101), se: 'g_us' };
        expect(() => keywordGetSchema.parse(params)).toThrow();
    });
});

describe('KeywordService.getKeywords', () => {
    let service: KeywordService;
    let mockConfig: any;
    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new KeywordService(mockConfig);
    });
    it('returns result from API', async () => {
        const params: KeywordGetParams = { keyword: 'iphone', se: 'g_us' };
        const mockResult: KeywordGetResponse = {
            data: [
                {
                    keyword: 'iphone 1 to 6',
                    cost: 1.76,
                    concurrency: 100,
                    found_results: 4350000000,
                    region_queries_count: 2240000,
                    region_queries_count_wide: 0,
                    types: ['kn_graph_card'],
                    geo_names: [],
                    social_domains: ['wikipedia'],
                    right_spelling: 'iphone 1 to 6',
                    lang: 'en',
                    keyword_length: 4,
                    difficulty: 62,
                    intents: ['informational']
                }
            ],
            summary_info: { page: 1, total: 1, left_lines: 100 }
        };
        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1', result: mockResult });
        const result = await service.getKeywords(params);
        expect(result).toEqual(mockResult);
    });
    it('throws if no result', async () => {
        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1' });
        await expect(service.getKeywords({ keyword: 'iphone', se: 'g_us' })).rejects.toThrow('No result data received from Serpstat API');
    });
});

describe('GetKeywordsHandler', () => {
    it('returns success response for valid call', async () => {
        const handler = new GetKeywordsHandler();
        const mockResult: KeywordGetResponse = {
            data: [],
            summary_info: { page: 1, total: 0, left_lines: 100 }
        };
        jest.spyOn(handler['keywordService'], 'getKeywords').mockResolvedValue(mockResult);
        const res = await handler.handle({ name: 'get_keywords', arguments: { keyword: 'iphone', se: 'g_us' } });
        expect(res.isError).toBeFalsy();
        expect(res.content).toBeDefined();
        expect(JSON.stringify(res.content)).toContain('summary_info');
    });
    it('returns error for invalid params', async () => {
        const handler = new GetKeywordsHandler();
        const res = await handler.handle({ name: 'get_keywords', arguments: { se: 'g_us' } });
        expect(res.isError).toBeTruthy();
        expect(res.content?.[0]?.text).toContain('Invalid parameters');
    });
});

