import { KeywordService } from '../../services/keyword_tools.js';
import { KeywordGetParams, keywordGetSchema, getRelatedKeywordsSchema, GetRelatedKeywordsParams, keywordsInfoSchema, KeywordsInfoParams, keywordSuggestionsSchema, KeywordSuggestionsParams } from '../../utils/validation.js';
import { KeywordGetResponse, GetRelatedKeywordsResponse, KeywordsInfoResponse, KeywordSuggestionsResponse } from '../../types/serpstat.js';
import { GetKeywordsHandler, GetRelatedKeywordsHandler, GetKeywordsInfoHandler, GetKeywordSuggestionsHandler } from '../../handlers/keyword_tools.js';
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

describe('getRelatedKeywordsSchema', () => {
    it('validates correct parameters', () => {
        const params: GetRelatedKeywordsParams = {
            keyword: 'iphone',
            se: 'g_us',
            page: 1,
            size: 10
        };
        expect(() => getRelatedKeywordsSchema.parse(params)).not.toThrow();
    });
    it('rejects missing keyword', () => {
        const params = { se: 'g_us' };
        expect(() => getRelatedKeywordsSchema.parse(params)).toThrow();
    });
    it('rejects invalid se', () => {
        const params = { keyword: 'iphone', se: 'g_xx' };
        expect(() => getRelatedKeywordsSchema.parse(params)).toThrow();
    });
    it('rejects too long keyword', () => {
        const params = { keyword: 'a'.repeat(201), se: 'g_us' };
        expect(() => getRelatedKeywordsSchema.parse(params)).toThrow();
    });
});

describe('KeywordService.getRelatedKeywords', () => {
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
        const params: GetRelatedKeywordsParams = { keyword: 'iphone', se: 'g_us' };
        const mockResult: GetRelatedKeywordsResponse = {
            data: [
                {
                    keyword: 'iphone 12',
                    cost: 1.5,
                    concurrency: 80,
                    region_queries_count: 100000,
                    difficulty: 50,
                    weight: 10,
                    types: ['organic'],
                    geo_names: ['US'],
                    right_spelling: true,
                    keyword_length: 2,
                    intents: ['informational']
                }
            ],
            summary_info: { page: 1, total: 1, left_lines: 100 }
        };
        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1', result: mockResult });
        const result = await service.getRelatedKeywords(params);
        expect(result).toEqual(mockResult);
    });
    it('throws if no result', async () => {
        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1' });
        await expect(service.getRelatedKeywords({ keyword: 'iphone', se: 'g_us' })).rejects.toThrow('No result data received from Serpstat API');
    });
});

describe('GetRelatedKeywordsHandler', () => {
    it('returns success response for valid call', async () => {
        const handler = new GetRelatedKeywordsHandler();
        const mockResult: GetRelatedKeywordsResponse = {
            data: [],
            summary_info: { page: 1, total: 0, left_lines: 100 }
        };
        jest.spyOn(handler['keywordService'], 'getRelatedKeywords').mockResolvedValue(mockResult);
        const res = await handler.handle({ name: 'get_related_keywords', arguments: { keyword: 'iphone', se: 'g_us' } });
        expect(res.isError).toBeFalsy();
        expect(res.content).toBeDefined();
        expect(JSON.stringify(res.content)).toContain('summary_info');
    });
    it('returns error for invalid params', async () => {
        const handler = new GetRelatedKeywordsHandler();
        const res = await handler.handle({ name: 'get_related_keywords', arguments: { se: 'g_us' } });
        expect(res.isError).toBeTruthy();
        expect(res.content?.[0]?.text).toBeDefined();
    });
});

describe('keywordsInfoSchema', () => {
    it('validates correct parameters', () => {
        const params: KeywordsInfoParams = {
            keywords: ['iphone', 'samsung'],
            se: 'g_us',
            withIntents: true
        };
        expect(() => keywordsInfoSchema.parse(params)).not.toThrow();
    });

    it('rejects missing keywords', () => {
        const params = { se: 'g_us' };
        expect(() => keywordsInfoSchema.parse(params)).toThrow();
    });

    it('rejects empty keywords array', () => {
        const params = { keywords: [], se: 'g_us' };
        expect(() => keywordsInfoSchema.parse(params)).toThrow();
    });

    it('rejects too many keywords', () => {
        const params = { keywords: new Array(1001).fill('test'), se: 'g_us' };
        expect(() => keywordsInfoSchema.parse(params)).toThrow();
    });

    it('rejects invalid se', () => {
        const params = { keywords: ['iphone'], se: 'invalid_se' };
        expect(() => keywordsInfoSchema.parse(params)).toThrow();
    });

    it('validates with filters', () => {
        const params: KeywordsInfoParams = {
            keywords: ['iphone'],
            se: 'g_us',
            filters: {
                cost_from: 1,
                concurrency_to: 80,
                region_queries_count_from: 1000,
                intents_contain: ['commercial']
            }
        };
        expect(() => keywordsInfoSchema.parse(params)).not.toThrow();
    });

    it('validates with sort', () => {
        const params: KeywordsInfoParams = {
            keywords: ['iphone'],
            se: 'g_us',
            sort: {
                cost: 'desc',
                region_queries_count: 'asc'
            }
        };
        expect(() => keywordsInfoSchema.parse(params)).not.toThrow();
    });
});

describe('KeywordService.getKeywordsInfo', () => {
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
        const params: KeywordsInfoParams = { 
            keywords: ['iphone', 'samsung'], 
            se: 'g_us',
            withIntents: true 
        };
        const mockResult: KeywordsInfoResponse = {
            data: [
                {
                    keyword: 'iphone',
                    cost: 0.27,
                    concurrency: 100,
                    found_results: 6350000000,
                    region_queries_count: 450000,
                    region_queries_count_wide: 0,
                    types: ['also_asks', 'kn_graph_card'],
                    geo_names: [],
                    social_domains: ['youtube', 'instagram'],
                    right_spelling: null,
                    lang: 'en',
                    difficulty: 39,
                    suggestions_count: 0,
                    keywords_count: 21431,
                    intents: ['informational']
                }
            ],
            summary_info: { page: 1, left_lines: 999988 }
        };

        jest.spyOn(service, 'makeRequest').mockResolvedValue({ 
            id: 'test', 
            result: mockResult 
        });

        const result = await service.getKeywordsInfo(params);
        expect(result).toEqual(mockResult);
        expect(service.makeRequest).toHaveBeenCalledWith({
            id: expect.stringContaining('get_keywords_info_'),
            method: 'SerpstatKeywordProcedure.getKeywordsInfo',
            params
        });
    });

    it('throws error when no result', async () => {
        const params: KeywordsInfoParams = { keywords: ['iphone'], se: 'g_us' };
        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: 'test' });
        
        await expect(service.getKeywordsInfo(params)).rejects.toThrow('No result data received from Serpstat API');
    });
});

describe('GetKeywordsInfoHandler', () => {
    let handler: GetKeywordsInfoHandler;

    beforeEach(() => {
        handler = new GetKeywordsInfoHandler();
    });

    it('returns correct name', () => {
        expect(handler.getName()).toBe('get_keywords_info');
    });

    it('returns correct description', () => {
        const description = handler.getDescription();
        expect(description).toContain('keyword overview');
        expect(description).toContain('volume');
        expect(description).toContain('CPC');
        expect(description).toContain('competition');
    });

    it('returns correct input schema', () => {
        const schema = handler.getInputSchema();
        expect(schema).toHaveProperty('type', 'object');
        expect(schema).toHaveProperty('properties');
        expect((schema as any).properties).toHaveProperty('keywords');
        expect((schema as any).properties).toHaveProperty('se');
        expect((schema as any).required).toContain('keywords');
        expect((schema as any).required).toContain('se');
    });

    it('handles valid call', async () => {
        const mockResult: KeywordsInfoResponse = {
            data: [{
                keyword: 'iphone',
                cost: 0.27,
                concurrency: 100,
                found_results: 6350000000,
                region_queries_count: 450000,
                region_queries_count_wide: 0,
                types: ['also_asks'],
                geo_names: [],
                social_domains: ['youtube'],
                right_spelling: null,
                lang: 'en',
                difficulty: 39,
                suggestions_count: 0,
                keywords_count: 21431
            }],
            summary_info: { page: 1, left_lines: 999988 }
        };

        jest.spyOn(handler['keywordService'], 'getKeywordsInfo').mockResolvedValue(mockResult);

        const call = {
            name: 'get_keywords_info',
            arguments: { keywords: ['iphone'], se: 'g_us' }
        };

        const response = await handler.handle(call);
        expect(response.content).toHaveLength(1);
        expect(response.content[0].type).toBe('text');
        
        const responseData = JSON.parse(response.content[0].text);
        expect(responseData).toEqual(mockResult);
        expect(handler['keywordService'].getKeywordsInfo).toHaveBeenCalledWith({ 
            keywords: ['iphone'], 
            se: 'g_us' 
        });
    });

    it('handles invalid parameters', async () => {
        const call = {
            name: 'get_keywords_info',
            arguments: { se: 'g_us' } // missing keywords
        };

        const response = await handler.handle(call);
        expect(response.isError).toBe(true);
        expect(response.content[0].text).toContain('Invalid parameters');
        expect(response.content[0].text).toContain('keywords: Required');
    });
});

describe('keywordSuggestionsSchema', () => {
    it('validates correct parameters', () => {
        const params: KeywordSuggestionsParams = {
            keyword: 'iphone',
            se: 'g_us',
            page: 1,
            size: 10
        };
        expect(() => keywordSuggestionsSchema.parse(params)).not.toThrow();
    });

    it('rejects missing keyword', () => {
        const params = { se: 'g_us' };
        expect(() => keywordSuggestionsSchema.parse(params)).toThrow();
    });

    it('rejects invalid se', () => {
        const params = { keyword: 'iphone', se: 'g_xx' };
        expect(() => keywordSuggestionsSchema.parse(params)).toThrow();
    });

    it('rejects too long keyword', () => {
        const params = { keyword: 'a'.repeat(201), se: 'g_us' };
        expect(() => keywordSuggestionsSchema.parse(params)).toThrow();
    });

    it('validates with filters', () => {
        const params: KeywordSuggestionsParams = {
            keyword: 'iphone',
            se: 'g_us',
            filters: {
                minus_keywords: ['rent', 'lease']
            }
        };
        expect(() => keywordSuggestionsSchema.parse(params)).not.toThrow();
    });
});

describe('KeywordService.getKeywordSuggestions', () => {
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
        const params: KeywordSuggestionsParams = { keyword: 'social security administration houston tx', se: 'g_us' };
        const mockResult: KeywordSuggestionsResponse = {
            data: [
                {
                    keyword: 'social security administration 290 houston tx',
                    geo_names: ['houston']
                },
                {
                    keyword: 'social security administration houston tx locations',
                    geo_names: ['houston']
                },
                {
                    keyword: 'social security administration office houston tx',
                    geo_names: []
                }
            ],
            summary_info: { page: 1, total: 26, left_lines: 9999933 }
        };

        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1', result: mockResult });
        const result = await service.getKeywordSuggestions(params);
        expect(result).toEqual(mockResult);
        expect(service.makeRequest).toHaveBeenCalledWith({
            id: expect.stringContaining('get_keyword_suggestions_'),
            method: 'SerpstatKeywordProcedure.getSuggestions',
            params
        });
    });

    it('throws if no result', async () => {
        jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1' });
        await expect(service.getKeywordSuggestions({ keyword: 'iphone', se: 'g_us' })).rejects.toThrow('No result data received from Serpstat API');
    });
});

describe('GetKeywordSuggestionsHandler', () => {
    let handler: GetKeywordSuggestionsHandler;

    beforeEach(() => {
        handler = new GetKeywordSuggestionsHandler();
    });

    it('returns correct name', () => {
        expect(handler.getName()).toBe('get_keyword_suggestions');
    });

    it('returns correct description', () => {
        const description = handler.getDescription();
        expect(description).toContain('search suggestions');
        expect(description).toContain('full-text search');
        expect(description).toContain('geographic names');
    });

    it('returns correct input schema', () => {
        const schema = handler.getInputSchema();
        expect(schema).toHaveProperty('type', 'object');
        expect(schema).toHaveProperty('properties');
        expect((schema as any).properties).toHaveProperty('keyword');
        expect((schema as any).properties).toHaveProperty('se');
        expect((schema as any).required).toContain('keyword');
        expect((schema as any).required).toContain('se');
    });

    it('handles valid call', async () => {
        const mockResult: KeywordSuggestionsResponse = {
            data: [
                {
                    keyword: 'iphone 15 pro max',
                    geo_names: []
                },
                {
                    keyword: 'iphone 15 pro max 512gb color',
                    geo_names: []
                }
            ],
            summary_info: { page: 1, total: 9, left_lines: 999280 }
        };

        jest.spyOn(handler['keywordService'], 'getKeywordSuggestions').mockResolvedValue(mockResult);

        const call = {
            name: 'get_keyword_suggestions',
            arguments: { keyword: 'iphone', se: 'g_us' }
        };

        const response = await handler.handle(call);
        expect(response.content).toHaveLength(1);
        expect(response.content[0].type).toBe('text');

        const responseData = JSON.parse(response.content[0].text);
        expect(responseData).toEqual(mockResult);
        expect(handler['keywordService'].getKeywordSuggestions).toHaveBeenCalledWith({
            keyword: 'iphone',
            se: 'g_us',
            size: 100 // default size should be applied
        });
    });

    it('handles invalid parameters', async () => {
        const call = {
            name: 'get_keyword_suggestions',
            arguments: { se: 'g_us' } // missing keyword
        };

        const response = await handler.handle(call);
        expect(response.isError).toBe(true);
        expect(response.content[0].text).toContain('Invalid parameters');
        expect(response.content[0].text).toContain('keyword: Required');
    });

    it('handles call with filters', async () => {
        const mockResult: KeywordSuggestionsResponse = {
            data: [{
                keyword: 'social security administration office houston tx',
                geo_names: []
            }],
            summary_info: { page: 1, total: 1, left_lines: 999999 }
        };

        jest.spyOn(handler['keywordService'], 'getKeywordSuggestions').mockResolvedValue(mockResult);

        const call = {
            name: 'get_keyword_suggestions',
            arguments: {
                keyword: 'social security administration houston tx',
                se: 'g_us',
                filters: {
                    minus_keywords: ['rent']
                },
                page: 1,
                size: 3
            }
        };

        const response = await handler.handle(call);
        expect(response.content).toHaveLength(1);
        expect(response.content[0].type).toBe('text');

        const responseData = JSON.parse(response.content[0].text);
        expect(responseData).toEqual(mockResult);
        expect(handler['keywordService'].getKeywordSuggestions).toHaveBeenCalledWith({
            keyword: 'social security administration houston tx',
            se: 'g_us',
            filters: {
                minus_keywords: ['rent']
            },
            page: 1,
            size: 3
        });
    });
});
