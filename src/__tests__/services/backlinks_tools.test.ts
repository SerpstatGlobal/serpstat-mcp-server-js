import { BacklinksService } from '../../services/backlinks_tools.js';
import { BacklinksSummaryParams, backlinksSummarySchema, AnchorsParams, anchorsSchema, GetActiveBacklinksParams, getActiveBacklinksSchema } from '../../utils/validation.js';
import { BacklinksSummaryResponse, AnchorsResponse, ActiveBacklinksResponse } from '../../types/serpstat.js';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

describe('BacklinksService', () => {
    let service: BacklinksService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: "error",
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new BacklinksService(mockConfig);
    });

    it('should validate correct parameters', () => {
        const validParams: BacklinksSummaryParams = {
            query: 'example.com',
            searchType: 'domain_with_subdomains'
        };
        expect(() => backlinksSummarySchema.parse(validParams)).not.toThrow();
    });

    it('should fail validation for invalid domain', () => {
        const invalidParams = {
            query: 'bad_domain',
            searchType: 'domain'
        };
        expect(() => backlinksSummarySchema.parse(invalidParams)).toThrow();
    });

    it('should fail validation for missing required fields', () => {
        const invalidParams = {
            searchType: 'domain'
        };
        expect(() => backlinksSummarySchema.parse(invalidParams)).toThrow();
    });

    it('should call getBacklinksSummary and return summary data', async () => {
        const params: BacklinksSummaryParams = {
            query: 'example.com',
            searchType: 'domain'
        };
        const mockResponse: BacklinksSummaryResponse = {
            data: {
                sersptat_domain_rank: 60,
                referring_domains: 100,
                referring_domains_change: 1,
                redirected_domains: 0,
                referring_malicious_domains: 0,
                referring_malicious_domains_change: 0,
                referring_ip_addresses: 10,
                referring_ip_addresses_change: 0,
                referring_subnets: 5,
                referring_subnets_change: 0,
                backlinks: 200,
                backlinks_change: 2,
                backlinks_from_mainpages: 10,
                backlinks_from_mainpages_change: 0,
                nofollow_backlinks: 100,
                nofollow_backlinks_change: 0,
                dofollow_backlinks: 100,
                dofollow_backlinks_change: 0,
                text_backlinks: 150,
                text_backlinks_change: 0,
                image_backlinks: 50,
                image_backlinks_change: 0,
                redirect_backlinks: 0,
                redirect_backlinks_change: 0,
                canonical_backlinks: 0,
                canonical_backlinks_change: 0,
                alternate_backlinks: 0,
                alternate_backlinks_change: 0,
                rss_backlinks: 0,
                rss_backlinks_change: 0,
                frame_backlinks: 0,
                frame_backlinks_change: 0,
                form_backlinks: 0,
                form_backlinks_change: 0,
                external_domains: 10,
                external_domains_change: 0,
                external_malicious_domains: 0,
                external_malicious_domains_change: 0,
                external_links: 20,
                external_links_change: 0
            },
            summary_info: {
                left_lines: 9999,
                sort: null,
                order: null
            }
        };
        // @ts-expect-error
        service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
        const result = await service.getBacklinksSummary(params);
        expect(result.data.sersptat_domain_rank).toBe(60);
        expect(result.summary_info.left_lines).toBe(9999);
    });

    it('should throw error if no result returned', async () => {
        const params: BacklinksSummaryParams = {
            query: 'example.com',
            searchType: 'domain'
        };
        // @ts-expect-error
        service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
        await expect(service.getBacklinksSummary(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    describe('getAnchors', () => {
        it('should validate correct domain parameters', () => {
            const validParams: AnchorsParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            expect(() => anchorsSchema.parse(validParams)).not.toThrow();
        });

        it('should validate correct URL parameters', () => {
            const validParams: AnchorsParams = {
                query: 'serpstat.com/blog/',
                searchType: 'part_url',
                size: 10
            };
            expect(() => anchorsSchema.parse(validParams)).not.toThrow();
        });

        it('should validate correct full URL parameters', () => {
            const validParams: AnchorsParams = {
                query: 'https://example.com/page',
                searchType: 'url',
                size: 50
            };
            expect(() => anchorsSchema.parse(validParams)).not.toThrow();
        });

        it('should fail validation for invalid domain', () => {
            const invalidParams = {
                query: 'bad_domain',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            expect(() => anchorsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid URL format', () => {
            const invalidParams = {
                query: 'not-a-valid-url-at-all',
                searchType: 'part_url',
                page: 1,
                size: 100
            };
            expect(() => anchorsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for missing required fields', () => {
            const invalidParams = {
                searchType: 'domain'
            };
            expect(() => anchorsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid page size', () => {
            const invalidParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 1500
            };
            expect(() => anchorsSchema.parse(invalidParams)).toThrow();
        });

        it('should call getAnchors and return anchors data', async () => {
            const params: AnchorsParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            const mockResponse: AnchorsResponse = {
                data: [
                    {
                        anchor: 'example link',
                        dofollow_backlinks: 50,
                        nofollow_backlinks: 25,
                        total_backlinks: 75,
                        referring_domains: 10
                    },
                    {
                        anchor: 'another link',
                        dofollow_backlinks: 30,
                        nofollow_backlinks: 15,
                        total_backlinks: 45,
                        referring_domains: 8
                    }
                ],
                summary_info: {
                    left_lines: 9999,
                    count: 2,
                    sort: null,
                    order: null
                }
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
            const result = await service.getAnchors(params);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].anchor).toBe('example link');
            expect(result.data[0].total_backlinks).toBe(75);
            expect(result.summary_info.count).toBe(2);
            expect(result.summary_info.left_lines).toBe(9999);
        });

        it('should throw error if no result returned', async () => {
            const params: AnchorsParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
            await expect(service.getAnchors(params)).rejects.toThrow('No result data received from Serpstat API');
        });

        it('should handle optional parameters correctly', () => {
            const minimalParams: AnchorsParams = {
                query: 'example.com',
                searchType: 'domain'
            };
            expect(() => anchorsSchema.parse(minimalParams)).not.toThrow();

            const paramsWithOptional: AnchorsParams = {
                query: 'example.com',
                searchType: 'domain_with_subdomains',
                page: 2,
                size: 50,
                sort: 'refDomains',
                order: 'desc'
            };
            expect(() => anchorsSchema.parse(paramsWithOptional)).not.toThrow();
        });
    });

    describe('getActiveBacklinks', () => {
        it('should validate correct domain parameters', () => {
            const validParams: GetActiveBacklinksParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            expect(() => getActiveBacklinksSchema.parse(validParams)).not.toThrow();
        });

        it('should validate correct URL parameters', () => {
            const validParams: GetActiveBacklinksParams = {
                query: 'serpstat.com/blog/',
                searchType: 'part_url',
                size: 10
            };
            expect(() => getActiveBacklinksSchema.parse(validParams)).not.toThrow();
        });

        it('should validate correct full URL parameters', () => {
            const validParams: GetActiveBacklinksParams = {
                query: 'https://example.com/page',
                searchType: 'url',
                size: 50,
                sort: 'domain_rank',
                order: 'desc'
            };
            expect(() => getActiveBacklinksSchema.parse(validParams)).not.toThrow();
        });

        it('should validate complex filter parameters', () => {
            const validParams: GetActiveBacklinksParams = {
                query: 'example.com',
                searchType: 'domain',
                complexFilter: [
                    [
                        {
                            field: 'url_from',
                            compareType: 'notContains',
                            value: ['spam']
                        },
                        {
                            field: 'anchor',
                            compareType: 'contains',
                            value: ['example']
                        }
                    ],
                    [
                        {
                            additional_filters: 'no_subdomains'
                        }
                    ]
                ]
            };
            expect(() => getActiveBacklinksSchema.parse(validParams)).not.toThrow();
        });

        it('should fail validation for invalid domain', () => {
            const invalidParams = {
                query: 'bad_domain',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            expect(() => getActiveBacklinksSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid URL format', () => {
            const invalidParams = {
                query: 'not-a-valid-url-at-all',
                searchType: 'part_url',
                page: 1,
                size: 100
            };
            expect(() => getActiveBacklinksSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for missing required fields', () => {
            const invalidParams = {
                searchType: 'domain'
            };
            expect(() => getActiveBacklinksSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid page size', () => {
            const invalidParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 1500
            };
            expect(() => getActiveBacklinksSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid sort field', () => {
            const invalidParams = {
                query: 'example.com',
                searchType: 'domain',
                sort: 'invalid_field'
            };
            expect(() => getActiveBacklinksSchema.parse(invalidParams)).toThrow();
        });

        it('should call getActiveBacklinks and return backlinks data', async () => {
            const params: GetActiveBacklinksParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 2
            };
            const mockResponse: ActiveBacklinksResponse = {
                data: [
                    {
                        url_from: 'https://www.topicalauthority.digital/',
                        url_to: 'https://example.com/blog/post',
                        nofollow: 'follow',
                        link_type: 'href',
                        links_ext: 92,
                        link_text: 'Read More',
                        first_seen: '2023-07-02',
                        last_visited: '2024-11-23 21:32:02',
                        domain_rank: '25'
                    },
                    {
                        url_from: 'https://www.schweiz-navigator.de/',
                        url_to: 'https://example.com/login/',
                        nofollow: 'follow',
                        link_type: 'redirect',
                        links_ext: 1,
                        link_text: '',
                        first_seen: '2022-07-25',
                        last_visited: '2025-01-30 20:22:03',
                        domain_rank: '18'
                    }
                ],
                summary_info: {
                    left_lines: 9999,
                    page: 1,
                    count: 2,
                    total: 62,
                    sort: 'url_from',
                    order: 'desc'
                }
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
            const result = await service.getActiveBacklinks(params);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].url_from).toBe('https://www.topicalauthority.digital/');
            expect(result.data[0].link_type).toBe('href');
            expect(result.data[0].domain_rank).toBe('25');
            expect(result.summary_info.count).toBe(2);
            expect(result.summary_info.total).toBe(62);
            expect(result.summary_info.left_lines).toBe(9999);
        });

        it('should throw error if no result returned', async () => {
            const params: GetActiveBacklinksParams = {
                query: 'example.com',
                searchType: 'domain'
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
            await expect(service.getActiveBacklinks(params)).rejects.toThrow('No result data received from Serpstat API');
        });

        it('should handle optional parameters correctly', () => {
            const minimalParams: GetActiveBacklinksParams = {
                query: 'example.com'
            };
            expect(() => getActiveBacklinksSchema.parse(minimalParams)).not.toThrow();

            const paramsWithOptional: GetActiveBacklinksParams = {
                query: 'example.com',
                searchType: 'domain_with_subdomains',
                page: 2,
                size: 50,
                sort: 'check',
                order: 'desc',
                linkPerDomain: 1
            };
            expect(() => getActiveBacklinksSchema.parse(paramsWithOptional)).not.toThrow();
        });

        it('should handle all sort fields correctly', () => {
            const sortFields = ['url_from', 'anchor', 'link_nofollow', 'links_external', 'link_type', 'url_to', 'check', 'add', 'domain_rank'];

            sortFields.forEach(sort => {
                const params: GetActiveBacklinksParams = {
                    query: 'example.com',
                    searchType: 'domain',
                    sort: sort as any
                };
                expect(() => getActiveBacklinksSchema.parse(params)).not.toThrow();
            });
        });

        it('should handle all search types correctly', () => {
            const searchTypes = ['domain', 'domain_with_subdomains', 'url', 'part_url'];

            searchTypes.forEach(searchType => {
                let query = 'example.com';
                if (searchType === 'url') {
                    query = 'https://example.com/page';
                } else if (searchType === 'part_url') {
                    query = 'example.com/page';
                }

                const params: GetActiveBacklinksParams = {
                    query,
                    searchType: searchType as any
                };
                expect(() => getActiveBacklinksSchema.parse(params)).not.toThrow();
            });
        });
    });
});
