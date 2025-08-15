import { DomainService } from '../../services/domain_tools';
import { Config } from '../../utils/config';
import { DomainsInfoParams, competitorsGetSchema, CompetitorsGetParams, domainKeywordsSchema, DomainKeywordsParams, domainUrlsSchema, DomainUrlsParams, domainRegionsCountSchema, DomainRegionsCountParams, domainUniqKeywordsSchema, DomainUniqKeywordsParams } from '../../utils/validation';
import { DomainKeywordsResponse, DomainUrlsResponse, DomainRegionsCountResponse, DomainUniqKeywordsResponse } from '../../types/serpstat';
import { DomainRegionsCountHandler, GetDomainUniqKeywordsHandler } from '../../handlers/domain_tools';
import { jest, beforeEach, describe, it, expect } from '@jest/globals';


process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';


describe('DomainService', () => {
    let service: DomainService;
    let mockConfig: Config;
    //let jest   = jest;
    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: "error",
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new DomainService(mockConfig);
    });

    describe('getDomainsInfo', () => {
        it('should validate input parameters', async () => {
            const validParams: DomainsInfoParams = {
                domains: ['example.com'],
                se: 'g_us',
            };
            expect(validParams.domains).toHaveLength(1);
            expect(validParams.se).toBe('g_us');
        });

        it('should handle multiple domains', () => {
            const params: DomainsInfoParams = {
                domains: ['example.com', 'test.com', 'demo.org'],
                se: 'g_uk',
                filters: {
                    traff_from: 1000,
                    visible_from: 0.5,
                },
            };
            expect(params.domains).toHaveLength(3);
            expect(params.filters?.traff_from).toBe(1000);
        });

        it('should fail with empty domains array', () => {
            const params: DomainsInfoParams = {
                domains: [],
                se: 'g_us',
            };
            expect(params.domains).toHaveLength(0);
        });

        it('should allow missing filters', () => {
            const params: DomainsInfoParams = {
                domains: ['example.com'],
                se: 'g_us',
            };
            expect(params.filters).toBeUndefined();
        });

        it('should handle edge case: one domain, no filters', () => {
            const params: DomainsInfoParams = {
                domains: ['single.com'],
                se: 'g_us',
            };
            expect(params.domains).toHaveLength(1);
            expect(params.filters).toBeUndefined();
        });

        it('should handle filters with zero values', () => {
            const params: DomainsInfoParams = {
                domains: ['zero.com'],
                se: 'g_us',
                filters: {
                    traff_from: 0,
                    visible_from: 0,
                },
            };
            expect(params.filters?.traff_from).toBe(0);
            expect(params.filters?.visible_from).toBe(0);
        });

        it('should handle missing se', () => {
            // @ts-expect-error
            const params: DomainsInfoParams = {
                domains: ['example.com'],
            };
            expect(params.se).toBeUndefined();
        });
    });

    describe('getCompetitors', () => {
        it('should validate correct parameters', () => {
            const validParams: CompetitorsGetParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 10,
                filters: {
                    visible: 1,
                    traff: 1000,
                    minus_domains: ['test.com']
                }
            };
            expect(() => competitorsGetSchema.parse(validParams)).not.toThrow();
        });

        it('should fail validation for invalid domain', () => {
            const invalidParams = {
                domain: 'bad_domain',
                se: 'g_us',
                size: 10
            };
            expect(() => competitorsGetSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for missing required fields', () => {
            const invalidParams = {
                domain: 'example.com',
                size: 10
            };
            expect(() => competitorsGetSchema.parse(invalidParams)).toThrow();
        });

        it('should call getCompetitors and return competitors data', async () => {
            const mockConfig = {
                serpstatApiToken: 'test-token',
                serpstatApiUrl: 'https://api.serpstat.com/v4',
                logLevel: "error",
                maxRetries: 1,
                requestTimeout: 5000,
            };
            // @ts-ignore
            const service = new DomainService(mockConfig);
            const params: CompetitorsGetParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 2
            };
            // Mock makeRequest

            // @ts-ignore
            service.makeRequest = jest.fn().mockResolvedValue({
                result: {
                    data: [
                        { domain: 'competitor1.com', visible: 10, traff: 100, keywords: 50, relevance: 0.9 },
                        { domain: 'competitor2.com', visible: 8, traff: 80, keywords: 40, relevance: 0.8 }
                    ],
                    summary_info: { page: 1, left_lines: 100 }
                }
            });
            const result = await service.getCompetitors(params);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].domain).toBe('competitor1.com');
        });

        it('should throw error if no result returned', async () => {
            const mockConfig = {
                serpstatApiToken: 'test-token',
                serpstatApiUrl: 'https://api.serpstat.com/v4',
                logLevel: "error",
                maxRetries: 1,
                requestTimeout: 5000,
            };
            // @ts-ignore
            const service = new DomainService(mockConfig);
            const params: CompetitorsGetParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 2
            };

            // @ts-ignore
            service.makeRequest = jest.fn().mockResolvedValue({});
            await expect(service.getCompetitors(params)).rejects.toThrow('No result data received from Serpstat API');
        });
    });

    describe('getDomainKeywords', () => {
        it('should validate correct parameters', () => {
            const validParams: DomainKeywordsParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 10,
                page: 1
            };
            expect(() => domainKeywordsSchema.parse(validParams)).not.toThrow();
        });

        it('should fail validation for invalid domain', () => {
            const invalidParams = {
                domain: 'bad_domain',
                se: 'g_us',
                size: 10
            };
            expect(() => domainKeywordsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for missing required fields', () => {
            const invalidParams = {
                size: 10
            };
            expect(() => domainKeywordsSchema.parse(invalidParams)).toThrow();
        });

        it('should call getDomainKeywords and return keywords data', async () => {
            const params: DomainKeywordsParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 2,
                page: 1
            };
            const mockResponse: DomainKeywordsResponse = {
                data: [
                    {
                        domain: 'example.com',
                        keyword: 'nike soccer',
                        keyword_length: 2,
                        url: 'https://example.com/soccer',
                        position: 1,
                        types: ['related_search'],
                        found_results: 1000000,
                        cost: 1.5,
                        traff: 100,
                        difficulty: 20,
                        concurrency: 2,
                        region_queries_count: 100,
                        intents: ['informational']
                    }
                ],
                summary_info: {
                    page: 1,
                    size: 2,
                    total: 1,
                    left_lines: 1000
                }
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
            const result = await service.getDomainKeywords(params);
            expect(result.data).toHaveLength(1);
            expect(result.data[0].keyword).toBe('nike soccer');
        });

        it('should throw error if no result returned', async () => {
            const params: DomainKeywordsParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 2,
                page: 1
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
            await expect(service.getDomainKeywords(params)).rejects.toThrow('No result data received from Serpstat API');
        });
    });

    describe('getDomainUrls', () => {
        it('should validate correct parameters', () => {
            const validParams: DomainUrlsParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 10,
                page: 1
            };
            expect(() => domainUrlsSchema.parse(validParams)).not.toThrow();
        });

        it('should fail validation for invalid domain', () => {
            const invalidParams = {
                domain: 'bad_domain',
                se: 'g_us',
                size: 10
            };
            expect(() => domainUrlsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for missing required fields', () => {
            const invalidParams = {
                size: 10
            };
            expect(() => domainUrlsSchema.parse(invalidParams)).toThrow();
        });

        it('should call getDomainUrls and return urls data', async () => {
            const params: DomainUrlsParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 2,
                page: 1
            };
            const mockResponse: DomainUrlsResponse = {
                data: [
                    { url: 'https://example.com/page1', keywords: 10 },
                    { url: 'https://example.com/page2', keywords: 5 }
                ],
                summary_info: {
                    page: 1,
                    size: 2,
                    total: 2,
                    left_lines: 1000
                }
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
            const result = await service.getDomainUrls(params);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].url).toBe('https://example.com/page1');
        });

        it('should throw error if no result returned', async () => {
            const params: DomainUrlsParams = {
                domain: 'example.com',
                se: 'g_us',
                size: 2,
                page: 1
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
            await expect(service.getDomainUrls(params)).rejects.toThrow('No result data received from Serpstat API');
        });
    });

    describe('domainRegionsCountSchema', () => {
        it('validates correct params', () => {
            const params: DomainRegionsCountParams = { domain: 'example.com', sort: 'db_name', order: 'asc' };
            expect(() => domainRegionsCountSchema.parse(params)).not.toThrow();
        });
        it('rejects invalid domain', () => {
            expect(() => domainRegionsCountSchema.parse({ domain: 'bad_domain' })).toThrow();
        });
    });

    describe('getDomainRegionsCount', () => {
        it('should call makeRequest and return data', async () => {
            const mockResult: DomainRegionsCountResponse = {
                data: [
                    { country_name_en: 'United States', db_name: 'g_us', domain: 'example.com', keywords_count: 123 }
                ],
                summary_info: {
                    analysed_domain: 'example.com', sort: 'db_name', order: 'asc', regions_db_count: 1, total_keywords: 123, left_lines: 1000
                }
            };
            // @ts-ignore
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResult });
            const params: DomainRegionsCountParams = { domain: 'example.com', sort: 'db_name', order: 'asc' };
            const res = await service.getDomainRegionsCount(params);
            expect(res).toEqual(mockResult);
            expect(service.makeRequest).toHaveBeenCalled();
        });
    });

    describe('DomainRegionsCountHandler', () => {
        it('should return result for valid params', async () => {
            const handler = new DomainRegionsCountHandler();
            // @ts-ignore
            handler['domainService'].getDomainRegionsCount = jest.fn().mockResolvedValue({
                data: [],
                summary_info: {
                    analysed_domain: 'example.com', sort: 'db_name', order: 'asc', regions_db_count: 0, total_keywords: 0, left_lines: 1000
                }
            });
            const params = { domain: 'example.com', sort: 'db_name', order: 'asc' };
            const res = await handler.handle({ name: 'get_domain_regions_count', arguments: params });
            expect(res.content).toBeDefined();
            expect(res.content[0].text).toBeDefined();
            const parsed = JSON.parse(res.content[0].text);
            expect(parsed.summary_info.analysed_domain).toBe('example.com');
            expect(handler['domainService'].getDomainRegionsCount).toHaveBeenCalled();
        });
    });

    describe('domainUniqKeywordsSchema', () => {
        it('validates correct parameters', () => {
            const params: DomainUniqKeywordsParams = {
                se: 'g_us',
                domains: ['nike.com', 'adidas.com'],
                minusDomain: 'puma.com',
                page: 1,
                size: 10,
                filters: { queries_from: 1000, queries_to: 2000 }
            };
            expect(() => domainUniqKeywordsSchema.parse(params)).not.toThrow();
        });
        it('rejects invalid domains', () => {
            const params = {
                se: 'g_us',
                domains: ['bad_domain'],
                minusDomain: 'puma.com',
            };
            expect(() => domainUniqKeywordsSchema.parse(params)).toThrow();
        });
        it('rejects duplicate domains', () => {
            const params = {
                se: 'g_us',
                domains: ['nike.com', 'nike.com'],
                minusDomain: 'puma.com',
            };
            expect(() => domainUniqKeywordsSchema.parse(params)).toThrow();
        });
    });

    describe('DomainService.getDomainUniqKeywords', () => {
        let service: DomainService;
        let mockConfig: Config;
        beforeEach(() => {
            mockConfig = {
                serpstatApiToken: 'test-token',
                serpstatApiUrl: 'https://api.serpstat.com/v4',
                logLevel: 'error',
                maxRetries: 1,
                requestTimeout: 5000,
            };
            service = new DomainService(mockConfig);
        });
        it('returns result from API', async () => {
            const params: DomainUniqKeywordsParams = {
                se: 'g_us',
                domains: ['nike.com', 'adidas.com'],
                minusDomain: 'puma.com',
            };
            const mockResult: DomainUniqKeywordsResponse = {
                data: [
                    {
                        domain: 'nike.com',
                        subdomain: 'www.nike.com',
                        keyword: 'test',
                        keyword_length: 1,
                        url: 'https://nike.com',
                        position: 1,
                        date: '2025-01-01',
                        types: [],
                        found_results: 1,
                        cost: 1,
                        concurrency: 1,
                        region_queries_count: 1,
                        region_queries_count_wide: 1,
                        geo_names: [],
                        traff: 1,
                        difficulty: 1,
                        dynamic: 0,
                        'adidas.com': 2,
                        'nike.com': 1
                    }
                ],
                summary_info: { page: 1, total: 1, left_lines: 100 }
            };
            jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1', result: mockResult });
            const result = await service.getDomainUniqKeywords(params);
            expect(result).toEqual(mockResult);
        });
        it('throws if no result', async () => {
            jest.spyOn(service, 'makeRequest').mockResolvedValue({ id: '1' });
            await expect(service.getDomainUniqKeywords({ se: 'g_us', domains: ['nike.com'], minusDomain: 'puma.com' })).rejects.toThrow('No result data received from Serpstat API');
        });
    });

    describe('GetDomainUniqKeywordsHandler', () => {
        it('returns success response for valid call', async () => {
            const handler = new GetDomainUniqKeywordsHandler();
            const mockResult: DomainUniqKeywordsResponse = {
                data: [],
                summary_info: { page: 1, total: 0, left_lines: 100 }
            };
            jest.spyOn(handler['domainService'], 'getDomainUniqKeywords').mockResolvedValue(mockResult);
            const res = await handler.handle({ name: 'get_domain_uniq_keywords', arguments: { se: 'g_us', domains: ['nike.com'], minusDomain: 'puma.com' } });
            expect(res.isError).toBeFalsy();
            expect(res.content).toBeDefined();
            expect(JSON.stringify(res.content)).toContain('summary_info');
        });
        it('returns error for invalid params', async () => {
            const handler = new GetDomainUniqKeywordsHandler();
            const res = await handler.handle({ name: 'get_domain_uniq_keywords', arguments: { se: 'g_us', domains: ['bad_domain'], minusDomain: 'puma.com' } });
            expect(res.isError).toBeTruthy();
            expect(res.content?.[0]?.text).toContain('Invalid parameters');
        });
    });
});
