import { UrlService } from '../../services/url_tools.js';
import { urlSummaryTrafficSchema, urlCompetitorsSchema, urlKeywordsSchema, urlMissingKeywordsSchema, UrlSummaryTrafficParams, UrlCompetitorsParams, UrlKeywordsParams, UrlMissingKeywordsParams } from '../../utils/validation.js';
import { UrlSummaryTrafficResponse, UrlCompetitorsResponse, UrlKeywordsResponse, UrlMissingKeywordsResponse } from '../../types/serpstat.js';

import { jest, describe, it, expect, beforeEach } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

const MOCK_LEFT_LINES = 100500;
const MOCK_PAGE_NUMBER = 1;
const MOCK_TOTAL_RESULTS = 468;

describe('urlSummaryTrafficSchema', () => {
    it('validates correct parameters', () => {
        const params: UrlSummaryTrafficParams = {
            se: 'g_us',
            domain: 'ebay.com',
            urlContains: '/mobile/'
        };
        expect(() => urlSummaryTrafficSchema.parse(params)).not.toThrow();
    });

    it('rejects missing required fields', () => {
        const params = { se: 'g_us' };
        expect(() => urlSummaryTrafficSchema.parse(params)).toThrow();
    });

    it('validates optional output_data parameter', () => {
        const params = {
            se: 'g_us',
            domain: 'ebay.com',
            urlContains: '/mobile/',
            output_data: 'traffic' as const
        };
        expect(() => urlSummaryTrafficSchema.parse(params)).not.toThrow();
    });
});

describe('urlCompetitorsSchema', () => {
    it('validates correct parameters', () => {
        const params: UrlCompetitorsParams = {
            se: 'g_us',
            url: 'https://www.nike.com',
            page: 1,
            size: 10
        };
        expect(() => urlCompetitorsSchema.parse(params)).not.toThrow();
    });

    it('rejects invalid URL format', () => {
        const params = {
            se: 'g_us',
            url: 'not-a-valid-url'
        };
        expect(() => urlCompetitorsSchema.parse(params)).toThrow();
    });

    it('validates with sort parameter', () => {
        const params = {
            se: 'g_us',
            url: 'https://www.nike.com',
            sort: { cnt: 'desc' as const }
        };
        expect(() => urlCompetitorsSchema.parse(params)).not.toThrow();
    });
});

describe('urlKeywordsSchema', () => {
    it('validates correct parameters', () => {
        const params: UrlKeywordsParams = {
            se: 'g_us',
            url: 'https://www.nike.com/men',
            page: 1,
            size: 10
        };
        expect(() => urlKeywordsSchema.parse(params)).not.toThrow();
    });

    it('validates with filters', () => {
        const params = {
            se: 'g_us',
            url: 'https://www.nike.com/men',
            filters: {
                cost_from: 1,
                cost_to: 10,
                position_from: 1,
                position_to: 20
            }
        };
        expect(() => urlKeywordsSchema.parse(params)).not.toThrow();
    });

    it('validates with intents', () => {
        const params = {
            se: 'g_us',
            url: 'https://www.nike.com/men',
            withIntents: true,
            filters: {
                intents_contain: ['commercial' as const]
            }
        };
        expect(() => urlKeywordsSchema.parse(params)).not.toThrow();
    });
});

describe('urlMissingKeywordsSchema', () => {
    it('validates correct parameters', () => {
        const params: UrlMissingKeywordsParams = {
            url: 'https://www.nike.com',
            se: 'g_us',
            page: 1,
            size: 10
        };
        expect(() => urlMissingKeywordsSchema.parse(params)).not.toThrow();
    });

    it('validates with filters', () => {
        const params = {
            url: 'https://www.nike.com',
            se: 'g_us',
            filters: {
                cost_from: 0.3,
                weight_from: 2
            }
        };
        expect(() => urlMissingKeywordsSchema.parse(params)).not.toThrow();
    });

    it('validates with sort parameter', () => {
        const params = {
            url: 'https://www.nike.com',
            se: 'g_us',
            sort: { weight: 'asc' as const }
        };
        expect(() => urlMissingKeywordsSchema.parse(params)).not.toThrow();
    });
});

describe('UrlService.getUrlSummaryTraffic', () => {
    let service: UrlService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new UrlService(mockConfig);
    });

    it('returns result from API', async () => {
        const params: UrlSummaryTrafficParams = {
            se: 'g_us',
            domain: 'ebay.com',
            urlContains: '/mobile/'
        };
        const mockResult: UrlSummaryTrafficResponse = {
            urls: 5,
            traffic: 14,
            keywords: 5,
            summary_info: {
                left_lines: MOCK_LEFT_LINES
            }
        };

        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });
        const result = await service.getUrlSummaryTraffic(params);
        expect(result).toEqual(mockResult);
    });

    it('throws error when no result data received', async () => {
        const params: UrlSummaryTrafficParams = {
            se: 'g_us',
            domain: 'ebay.com',
            urlContains: '/mobile/'
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: null });
        await expect(service.getUrlSummaryTraffic(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('calls API with correct method name', async () => {
        const params: UrlSummaryTrafficParams = {
            se: 'g_us',
            domain: 'ebay.com',
            urlContains: '/mobile/'
        };
        const mockResult: UrlSummaryTrafficResponse = {
            urls: 5,
            summary_info: { left_lines: MOCK_LEFT_LINES }
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });

        await service.getUrlSummaryTraffic(params);

        expect(makeRequestSpy).toHaveBeenCalledWith(expect.objectContaining({
            method: 'SerpstatUrlProcedure.getSummaryTraffic'
        }));
    });
});

describe('UrlService.getUrlCompetitors', () => {
    let service: UrlService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new UrlService(mockConfig);
    });

    it('returns result from API', async () => {
        const params: UrlCompetitorsParams = {
            se: 'g_us',
            url: 'https://www.nike.com'
        };
        const mockResult: UrlCompetitorsResponse = {
            data: [
                { domain: 'footlocker.com', url: 'https://www.footlocker.com/category/brands/nike.html', cnt: 89 }
            ],
            summary_info: {
                page: MOCK_PAGE_NUMBER,
                total: MOCK_TOTAL_RESULTS,
                left_lines: MOCK_LEFT_LINES
            }
        };

        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });
        const result = await service.getUrlCompetitors(params);
        expect(result).toEqual(mockResult);
    });

    it('throws error when no result data received', async () => {
        const params: UrlCompetitorsParams = {
            se: 'g_us',
            url: 'https://www.nike.com'
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: null });
        await expect(service.getUrlCompetitors(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('calls API with correct method name', async () => {
        const params: UrlCompetitorsParams = {
            se: 'g_us',
            url: 'https://www.nike.com'
        };
        const mockResult: UrlCompetitorsResponse = {
            data: [],
            summary_info: { page: MOCK_PAGE_NUMBER, total: 0, left_lines: MOCK_LEFT_LINES }
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });

        await service.getUrlCompetitors(params);

        expect(makeRequestSpy).toHaveBeenCalledWith(expect.objectContaining({
            method: 'SerpstatUrlProcedure.getUrlCompetitors'
        }));
    });
});

describe('UrlService.getUrlKeywords', () => {
    let service: UrlService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new UrlService(mockConfig);
    });

    it('returns result from API', async () => {
        const params: UrlKeywordsParams = {
            se: 'g_us',
            url: 'https://www.nike.com/men'
        };
        const mockResult: UrlKeywordsResponse = {
            data: [
                {
                    domain: 'nike.com',
                    subdomain: 'www.nike.com',
                    keyword: 'nike men usa',
                    keyword_length: 3,
                    url: 'https://www.nike.com/men',
                    position: 1,
                    types: ['related_search'],
                    found_results: 102000000,
                    cost: 2.32,
                    concurrency: 100,
                    region_queries_count: 90,
                    region_queries_count_wide: null,
                    geo_names: ['usa'],
                    traff: 13,
                    difficulty: 75,
                    dynamic: 0,
                    intents: ['commercial']
                }
            ],
            summary_info: {
                page: MOCK_PAGE_NUMBER,
                total: 50,
                left_lines: MOCK_LEFT_LINES
            }
        };

        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });
        const result = await service.getUrlKeywords(params);
        expect(result).toEqual(mockResult);
    });

    it('throws error when no result data received', async () => {
        const params: UrlKeywordsParams = {
            se: 'g_us',
            url: 'https://www.nike.com/men'
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: null });
        await expect(service.getUrlKeywords(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('calls API with correct method name', async () => {
        const params: UrlKeywordsParams = {
            se: 'g_us',
            url: 'https://www.nike.com/men'
        };
        const mockResult: UrlKeywordsResponse = {
            data: [],
            summary_info: { page: MOCK_PAGE_NUMBER, total: 0, left_lines: MOCK_LEFT_LINES }
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });

        await service.getUrlKeywords(params);

        expect(makeRequestSpy).toHaveBeenCalledWith(expect.objectContaining({
            method: 'SerpstatUrlProcedure.getUrlKeywords'
        }));
    });
});

describe('UrlService.getUrlMissingKeywords', () => {
    let service: UrlService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new UrlService(mockConfig);
    });

    it('returns result from API', async () => {
        const params: UrlMissingKeywordsParams = {
            url: 'https://www.nike.com',
            se: 'g_us'
        };
        const mockResult: UrlMissingKeywordsResponse = {
            data: [
                {
                    geo_names: [],
                    region_queries_count: 368000,
                    types: ['related_search'],
                    cost: 0.44,
                    region_queries_count_wide: 0,
                    keyword: 'sneakers',
                    concurrency: 100,
                    weight: 2
                }
            ],
            summary_info: {
                page: MOCK_PAGE_NUMBER,
                left_lines: MOCK_LEFT_LINES
            }
        };

        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });
        const result = await service.getUrlMissingKeywords(params);
        expect(result).toEqual(mockResult);
    });

    it('throws error when no result data received', async () => {
        const params: UrlMissingKeywordsParams = {
            url: 'https://www.nike.com',
            se: 'g_us'
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: null });
        await expect(service.getUrlMissingKeywords(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('calls API with correct method name', async () => {
        const params: UrlMissingKeywordsParams = {
            url: 'https://www.nike.com',
            se: 'g_us'
        };
        const mockResult: UrlMissingKeywordsResponse = {
            data: [],
            summary_info: { page: MOCK_PAGE_NUMBER, left_lines: MOCK_LEFT_LINES }
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValue({ result: mockResult });

        await service.getUrlMissingKeywords(params);

        expect(makeRequestSpy).toHaveBeenCalledWith(expect.objectContaining({
            method: 'SerpstatUrlProcedure.getUrlMissingKeywords'
        }));
    });
});
