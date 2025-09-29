import { BacklinksService } from '../../services/backlinks_tools.js';
import { BacklinksSummaryParams, backlinksSummarySchema, AnchorsParams, anchorsSchema, GetActiveBacklinksParams, getActiveBacklinksSchema, GetReferringDomainsParams, getReferringDomainsSchema, getLostBacklinksSchema, getTopAnchorsSchema, getTopPagesByBacklinksSchema, GetTopPagesByBacklinksParams, getBacklinksIntersectionSchema, GetBacklinksIntersectionParams } from '../../utils/validation.js';
import { BacklinksSummaryResponse, AnchorsResponse, ActiveBacklinksResponse, ReferringDomainsResponse, BacklinksIntersectionResponse  } from '../../types/serpstat.js';
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
                        anchor: "www.serpstat.com",
                        refDomains: 10,
                        total: 11,
                        noFollow: 1
                    },
                    {
                        anchor: "serpstat.com/ru",
                        refDomains: 4,
                        total: 6,
                        noFollow: 3
                    }

                ],
                summary_info: {
                    left_lines: 9999,
                    page: 1,
                    count: 2,
                    total: 2,
                    sort: "anchor",
                    order: "desc"
                }
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
            const result = await service.getAnchors(params);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].anchor).toBe('www.serpstat.com');
            expect(result.data[0].total).toBe(11);
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
                query: 'example.com',
                searchType: 'domain'
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

    describe('getReferringDomains', () => {
        it('should validate correct domain parameters', () => {
            const validParams: GetReferringDomainsParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            expect(() => getReferringDomainsSchema.parse(validParams)).not.toThrow();
        });

        it('should validate domain with subdomains parameters', () => {
            const validParams: GetReferringDomainsParams = {
                query: 'serpstat.com',
                searchType: 'domain_with_subdomains',
                size: 10
            };
            expect(() => getReferringDomainsSchema.parse(validParams)).not.toThrow();
        });

        it('should validate complex filter parameters', () => {
            const validParams: GetReferringDomainsParams = {
                query: 'example.com',
                searchType: 'domain',
                complexFilter: [
                    [
                        {
                            field: 'domain_from',
                            compareType: 'contains',
                            value: ['.com']
                        },
                        {
                            field: 'domain_rank',
                            compareType: 'gte',
                            value: [1]
                        }
                    ],
                    [
                        {
                            additional_filters: 'no_subdomains'
                        }
                    ]
                ]
            };
            expect(() => getReferringDomainsSchema.parse(validParams)).not.toThrow();
        });

        it('should fail validation for invalid domain', () => {
            const invalidParams = {
                query: 'bad_domain',
                searchType: 'domain',
                page: 1,
                size: 100
            };
            expect(() => getReferringDomainsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for missing required fields', () => {
            const invalidParams = {
                searchType: 'domain'
            };
            expect(() => getReferringDomainsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid page size', () => {
            const invalidParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 1500
            };
            expect(() => getReferringDomainsSchema.parse(invalidParams)).toThrow();
        });

        it('should fail validation for invalid sort field', () => {
            const invalidParams = {
                query: 'example.com',
                searchType: 'domain',
                sort: 'invalid_field'
            };
            expect(() => getReferringDomainsSchema.parse(invalidParams)).toThrow();
        });

        it('should call getReferringDomains and return referring domains data', async () => {
            const params: GetReferringDomainsParams = {
                query: 'example.com',
                searchType: 'domain',
                page: 1,
                size: 2
            };
            const mockResponse: ReferringDomainsResponse = {
                data: [
                    {
                        domain_from: 'baba.com',
                        ref_pages: '2',
                        domainRank: '47'
                    },
                    {
                        domain_from: 'luba.com',
                        ref_pages: '3',
                        domainRank: '46'
                    }
                ],
                summary_info: {
                    left_lines: 9999,
                    page: 1,
                    count: 2,
                    total: 26,
                    sort: 'domain_rank',
                    order: 'desc'
                }
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockResponse }) as typeof service.makeRequest;
            const result = await service.getReferringDomains(params);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].domain_from).toBe('baba.com');
            expect(result.data[0].ref_pages).toBe('2');
            expect(result.data[0].domainRank).toBe('47');
            expect(result.summary_info.count).toBe(2);
            expect(result.summary_info.total).toBe(26);
            expect(result.summary_info.left_lines).toBe(9999);
        });

        it('should throw error if no result returned', async () => {
            const params: GetReferringDomainsParams = {
                query: 'example.com',
                searchType: 'domain'
            };
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
            await expect(service.getReferringDomains(params)).rejects.toThrow('No result data received from Serpstat API');
        });

        it('should handle optional parameters correctly', () => {
            const minimalParams: GetReferringDomainsParams = {
                query: 'example.com',
                searchType: 'domain'
            };
            expect(() => getReferringDomainsSchema.parse(minimalParams)).not.toThrow();

            const paramsWithOptional: GetReferringDomainsParams = {
                query: 'example.com',
                searchType: 'domain_with_subdomains',
                page: 2,
                size: 50,
                sort: 'domain_rank',
                order: 'desc'
            };
            expect(() => getReferringDomainsSchema.parse(paramsWithOptional)).not.toThrow();
        });

        it('should handle all sort fields correctly', () => {
            const sortFields = ['domain_links', 'domain_from', 'domain_rank', 'check'];

            sortFields.forEach(sort => {
                const params: GetReferringDomainsParams = {
                    query: 'example.com',
                    searchType: 'domain',
                    sort: sort as any
                };
                expect(() => getReferringDomainsSchema.parse(params)).not.toThrow();
            });
        });

        it('should handle all search types correctly', () => {
            const searchTypes = ['domain', 'domain_with_subdomains'];

            searchTypes.forEach(searchType => {
                const params: GetReferringDomainsParams = {
                    query: 'example.com',
                    searchType: searchType as any
                };
                expect(() => getReferringDomainsSchema.parse(params)).not.toThrow();
            });
        });

        it('should validate additional filters correctly', () => {
            const additionalFilters = ['no_subdomains', 'only_subdomains', 'only_hosts', 'last_week'];

            additionalFilters.forEach(filter => {
                const params: GetReferringDomainsParams = {
                    query: 'example.com',
                    searchType: 'domain',
                    complexFilter: [
                        [
                            {
                                additional_filters: filter as any
                            }
                        ]
                    ]
                };
                expect(() => getReferringDomainsSchema.parse(params)).not.toThrow();
            });
        });
    });

    describe('getLostBacklinks method', () => {
        const mockLostBacklinksResponse = {
            data: [
                {
                    url_from: "https://example.com/page1",
                    url_to: "https://target.com/product",
                    anchor: "Target Product",
                    date_add: "2023-10-15",
                    date_del: "2024-01-15",
                    check: "2024-01-15",
                    link_nofollow: "false",
                    link_external: "10",
                    link_type: "text",
                    domain_rank: 45
                },
                {
                    url_from: "https://blog.example.com/article",
                    url_to: "https://target.com/",
                    anchor: "Target Website",
                    date_add: "2023-09-20",
                    date_del: "2024-01-10",
                    check: "2024-01-10",
                    link_nofollow: "true",
                    link_external: "25",
                    link_type: "image",
                    domain_rank: 38
                }
            ],
            summary_info: {
                left_lines: 150,
                page: 1,
                count: 2,
                total: 152,
                sort: "check",
                order: "desc"
            }
        };

        it('should get lost backlinks successfully with minimal params', async () => {
            const params = {
                query: 'target.com',
                searchType: 'domain' as const
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockLostBacklinksResponse }) as typeof service.makeRequest;

            const result = await service.getLostBacklinks(params);

            expect(result).toEqual(mockLostBacklinksResponse);
        });

        it('should handle all parameters correctly', async () => {
            const params = {
                query: 'target.com',
                searchType: 'domain_with_subdomains' as const,
                sort: 'date_del' as const,
                order: 'asc' as const,
                complexFilter: [
                    [
                        {
                            name: 'link_nofollow' as const,
                            operator: 'eq' as const,
                            value: 'false'
                        }
                    ]
                ],
                additionalFilters: ['no_subdomains' as const],
                page: 2,
                size: 50
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockLostBacklinksResponse }) as typeof service.makeRequest;

            const result = await service.getLostBacklinks(params);

            expect(result).toEqual(mockLostBacklinksResponse);
        });

        it('should handle URL search type', async () => {
            const params = {
                query: 'https://target.com/specific-page',
                searchType: 'url' as const,
                sort: 'url_from' as const
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockLostBacklinksResponse }) as typeof service.makeRequest;

            const result = await service.getLostBacklinks(params);

            expect(result).toEqual(mockLostBacklinksResponse);
        });

        it('should handle complex filters correctly', async () => {
            const params = {
                query: 'target.com',
                searchType: 'domain' as const,
                complexFilter: [
                    [
                        {
                            name: 'links_external' as const,
                            operator: 'gte' as const,
                            value: 5
                        },
                        {
                            name: 'anchor' as const,
                            operator: 'contains' as const,
                            value: 'product'
                        }
                    ]
                ]
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockLostBacklinksResponse }) as typeof service.makeRequest;

            const result = await service.getLostBacklinks(params);

            expect(result).toEqual(mockLostBacklinksResponse);
        });

        it('should throw error when API returns no result', async () => {
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;

            const params = {
                query: 'target.com',
                searchType: 'domain' as const
            };

            await expect(service.getLostBacklinks(params)).rejects.toThrow('No result data received from Serpstat API');
        });
    });
});

// Lost Backlinks Schema Validation Tests
describe('getLostBacklinksSchema validation', () => {
    it('should validate required parameters', () => {
        const validParams = {
            query: 'example.com'
        };
        expect(() => getLostBacklinksSchema.parse(validParams)).not.toThrow();
    });

    it('should reject invalid query formats for domain search', () => {
        const invalidParams = {
            query: 'invalid-domain',
            searchType: 'domain'
        };
        expect(() => getLostBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should accept URLs for URL search types', () => {
        const validParams = {
            query: 'https://example.com/page',
            searchType: 'url'
        };
        expect(() => getLostBacklinksSchema.parse(validParams)).not.toThrow();
    });

    it('should validate optional parameters correctly', () => {
        const paramsWithOptional = {
            query: 'example.com',
            searchType: 'domain_with_subdomains' as const,
            sort: 'date_del' as const,
            order: 'desc' as const
        };
        expect(() => getLostBacklinksSchema.parse(paramsWithOptional)).not.toThrow();
    });

    it('should handle all sort fields correctly', () => {
        const sortFields = ['url_from', 'anchor', 'link_nofollow', 'links_external', 'link_type', 'url_to', 'check', 'date_del'];

        sortFields.forEach(sort => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                sort: sort as any
            };
            expect(() => getLostBacklinksSchema.parse(params)).not.toThrow();
        });
    });

    it('should handle all search types correctly', () => {
        const searchTypes = ['domain', 'domain_with_subdomains', 'url', 'part_url'];

        searchTypes.forEach(searchType => {
            const params = {
                query: searchType === 'url' || searchType === 'part_url' ? 'https://example.com' : 'example.com',
                searchType: searchType as any
            };
            expect(() => getLostBacklinksSchema.parse(params)).not.toThrow();
        });
    });

    it('should validate complex filter structure correctly', () => {
        const params = {
            query: 'example.com',
            searchType: 'domain' as const,
            complexFilter: [
                [
                    {
                        name: 'link_nofollow' as const,
                        operator: 'eq' as const,
                        value: 'false'
                    },
                    {
                        name: 'links_external' as const,
                        operator: 'gte' as const,
                        value: 10
                    }
                ]
            ]
        };
        expect(() => getLostBacklinksSchema.parse(params)).not.toThrow();
    });

    it('should validate additional filters correctly', () => {
        const additionalFilters = ['no_subdomains', 'only_subdomains', 'only_hosts', 'last_week', 'only_main_page'];

        additionalFilters.forEach(filter => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                additionalFilters: [filter as any]
            };
            expect(() => getLostBacklinksSchema.parse(params)).not.toThrow();
        });
    });

    it('should validate pagination parameters', () => {
        const params = {
            query: 'example.com',
            searchType: 'domain' as const,
            page: 3,
            size: 200
        };
        expect(() => getLostBacklinksSchema.parse(params)).not.toThrow();
    });

    it('should reject invalid pagination parameters', () => {
        const invalidParams = {
            query: 'example.com',
            searchType: 'domain' as const,
            page: 0, // Invalid: must be >= 1
            size: 2000 // Invalid: exceeds maximum
        };
        expect(() => getLostBacklinksSchema.parse(invalidParams)).toThrow();
    });
});

// Top Anchors Schema Validation Tests
describe('getTopAnchorsSchema validation', () => {
    it('should validate required parameters', () => {
        const validParams = {
            query: 'facebook.com'
        };
        expect(() => getTopAnchorsSchema.parse(validParams)).not.toThrow();
    });

    it('should apply default searchType', () => {
        const params = {
            query: 'facebook.com'
        };
        const parsed = getTopAnchorsSchema.parse(params);
        expect(parsed.searchType).toBe('domain');
    });

    it('should validate searchType enum values', () => {
        const validParams = {
            query: 'facebook.com',
            searchType: 'domain_with_subdomains' as const
        };
        expect(() => getTopAnchorsSchema.parse(validParams)).not.toThrow();
    });

    it('should reject invalid searchType values', () => {
        const invalidParams = {
            query: 'facebook.com',
            searchType: 'url' // Not allowed for this method
        };
        expect(() => getTopAnchorsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject invalid domain format', () => {
        const invalidParams = {
            query: 'invalid-domain',
            searchType: 'domain'
        };
        expect(() => getTopAnchorsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject missing required fields', () => {
        const invalidParams = {
            searchType: 'domain'
        };
        expect(() => getTopAnchorsSchema.parse(invalidParams)).toThrow();
    });

    it('should reject additional properties', () => {
        const invalidParams = {
            query: 'facebook.com',
            searchType: 'domain',
            extraProperty: 'not allowed'
        };
        expect(() => getTopAnchorsSchema.parse(invalidParams)).toThrow();
    });

    it('should validate domain length constraints', () => {
        const shortDomain = 'a.b'; // Too short
        const validDomain = 'facebook.com';

        expect(() => getTopAnchorsSchema.parse({ query: shortDomain })).toThrow();
        expect(() => getTopAnchorsSchema.parse({ query: validDomain })).not.toThrow();
    });
});

describe('BacklinksService - getTopAnchors', () => {
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

    describe('getTopAnchors method', () => {
        const mockTopAnchorsResponse = {
            data: [
                {
                    anchor: "",
                    backlinks_count: 7914025436,
                    domains_count: 17592749
                },
                {
                    anchor: "Facebook",
                    backlinks_count: 3319036490,
                    domains_count: 10189878
                },
                {
                    anchor: "facebook",
                    backlinks_count: 434658846,
                    domains_count: 1099827
                },
                {
                    anchor: "Facebook-f",
                    backlinks_count: 102491202,
                    domains_count: 537848
                },
                {
                    anchor: "Share",
                    backlinks_count: 127086911,
                    domains_count: 403456
                }
            ],
            summary_info: {
                sort: "referring_domains",
                order: "desc",
                left_lines: 9999887,
                referring_domains: 33399805,
                backlinks: 16307137490,
                unique_anchors: 75739546
            }
        };

        it('should get top anchors successfully with minimal params', async () => {
            const params = {
                query: 'facebook.com',
                searchType: 'domain' as const
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopAnchorsResponse }) as typeof service.makeRequest;

            const result = await service.getTopAnchors(params);

            expect(result).toEqual(mockTopAnchorsResponse);
            expect(result.data).toHaveLength(5);
            expect(result.data[0].anchor).toBe("");
            expect(result.data[1].anchor).toBe("Facebook");
        });

        it('should handle domain_with_subdomains search type', async () => {
            const params = {
                query: 'facebook.com',
                searchType: 'domain_with_subdomains' as const
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopAnchorsResponse }) as typeof service.makeRequest;

            const result = await service.getTopAnchors(params);

            expect(result).toEqual(mockTopAnchorsResponse);
            expect(result.summary_info.referring_domains).toBe(33399805);
            expect(result.summary_info.backlinks).toBe(16307137490);
            expect(result.summary_info.unique_anchors).toBe(75739546);
        });

        it('should throw error when API returns no result', async () => {
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;

            const params = {
                query: 'facebook.com',
                searchType: 'domain' as const
            };

            await expect(service.getTopAnchors(params)).rejects.toThrow('No result data received from Serpstat API');
        });
    });
});

// Top Pages by Backlinks Schema Validation Tests
describe('getTopPagesByBacklinksSchema validation', () => {
    it('should validate required parameters', () => {
        const validParams = {
            query: 'example.com'
        };
        expect(() => getTopPagesByBacklinksSchema.parse(validParams)).not.toThrow();
    });

    it('should apply default values', () => {
        const params = {
            query: 'example.com'
        };
        const parsed = getTopPagesByBacklinksSchema.parse(params);
        expect(parsed.searchType).toBe('domain');
        expect(parsed.sort).toBe('lastupdate');
        expect(parsed.order).toBe('desc');
        expect(parsed.page).toBe(1);
        expect(parsed.size).toBe(100);
    });

    it('should validate searchType enum values', () => {
        const validParams = {
            query: 'example.com',
            searchType: 'domain_with_subdomains' as const
        };
        expect(() => getTopPagesByBacklinksSchema.parse(validParams)).not.toThrow();
    });

    it('should reject invalid searchType values', () => {
        const invalidParams = {
            query: 'example.com',
            searchType: 'url' // Not allowed for this method
        };
        expect(() => getTopPagesByBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should validate all sort fields correctly', () => {
        const sortFields = ['ips', 'count', 'domains', 'url_to', 'lastupdate'];

        sortFields.forEach(sort => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                sort: sort as any
            };
            expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
        });
    });

    it('should reject invalid sort field', () => {
        const invalidParams = {
            query: 'example.com',
            searchType: 'domain',
            sort: 'invalid_field'
        };
        expect(() => getTopPagesByBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should validate complex filter structure correctly', () => {
        const params = {
            query: 'example.com',
            searchType: 'domain' as const,
            complexFilter: [
                [
                    {
                        field: 'ips' as const,
                        compareType: 'gte' as const,
                        value: [5]
                    },
                    {
                        field: 'url_to' as const,
                        compareType: 'contains' as const,
                        value: ['blog']
                    }
                ]
            ]
        };
        expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
    });

    it('should validate additional filters correctly', () => {
        const params = {
            query: 'example.com',
            searchType: 'domain' as const,
            complexFilter: [
                [
                    {
                        additional_filters: 'no_subdomains' as const
                    }
                ]
            ]
        };
        expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
    });

    it('should validate complex filter structure with mixed types', () => {
        const params = {
            query: 'example.com',
            searchType: 'domain' as const,
            complexFilter: [
                [
                    {
                        field: 'count' as const,
                        compareType: 'between' as const,
                        value: [10, 100]
                    }
                ],
                [
                    {
                        additional_filters: 'only_main_page' as const
                    }
                ]
            ]
        };
        expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
    });

    it('should reject invalid domain format', () => {
        const invalidParams = {
            query: 'invalid-domain',
            searchType: 'domain'
        };
        expect(() => getTopPagesByBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should reject missing required fields', () => {
        const invalidParams = {
            searchType: 'domain'
        };
        expect(() => getTopPagesByBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should validate pagination parameters', () => {
        const params = {
            query: 'example.com',
            searchType: 'domain' as const,
            page: 3,
            size: 200
        };
        expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
    });

    it('should reject invalid pagination parameters', () => {
        const invalidParams = {
            query: 'example.com',
            searchType: 'domain' as const,
            page: 0, // Invalid: must be >= 1
            size: 2000 // Invalid: exceeds maximum
        };
        expect(() => getTopPagesByBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should reject additional properties', () => {
        const invalidParams = {
            query: 'example.com',
            searchType: 'domain',
            extraProperty: 'not allowed'
        };
        expect(() => getTopPagesByBacklinksSchema.parse(invalidParams)).toThrow();
    });

    it('should validate domain length constraints', () => {
        const shortDomain = 'a.b'; // Too short
        const validDomain = 'example.com';

        expect(() => getTopPagesByBacklinksSchema.parse({ query: shortDomain })).toThrow();
        expect(() => getTopPagesByBacklinksSchema.parse({ query: validDomain })).not.toThrow();
    });

    it('should handle all compareType values correctly', () => {
        const compareTypes = ['gt', 'lt', 'gte', 'lte', 'eq', 'neq', 'between', 'contains', 'notContains', 'startsWith', 'endsWith'];

        compareTypes.forEach(compareType => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                complexFilter: [
                    [
                        {
                            field: 'ips' as const,
                            compareType: compareType as any,
                            value: [1]
                        }
                    ]
                ]
            };
            expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
        });
    });

    it('should handle all additional filters correctly', () => {
        const additionalFilters = ['no_subdomains', 'only_main_page', 'last_week', 'only_subdomains', 'only_hosts'];

        additionalFilters.forEach(filter => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                complexFilter: [
                    [
                        {
                            additional_filters: filter as any
                        }
                    ]
                ]
            };
            expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
        });
    });
});

describe('BacklinksService - getTopPagesByBacklinks', () => {
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

    describe('getTopPagesByBacklinks method', () => {
        const mockTopPagesResponse = {
            data: [
                {
                    url: "https://example.com/",
                    ref_pages: 1247,
                    ref_domains: 856,
                    ips: 645,
                    urlTo: "https://example.com/"
                },
                {
                    url: "https://example.com/blog/",
                    ref_pages: 423,
                    ref_domains: 298,
                    ips: 231,
                    urlTo: "https://example.com/blog/"
                },
                {
                    url: "https://example.com/products/",
                    ref_pages: 321,
                    ref_domains: 189,
                    ips: 156,
                    urlTo: "https://example.com/products/"
                }
            ],
            summary_info: {
                left_lines: 9998,
                page: 1,
                count: 3,
                total: 245,
                sort: "lastupdate",
                order: "desc"
            }
        };

        it('should get top pages by backlinks successfully with minimal params', async () => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;
            // @ts-ignore
            const result = await service.getTopPagesByBacklinks(params);

            expect(result).toEqual(mockTopPagesResponse);
            expect(result.data).toHaveLength(3);
            expect(result.data[0].url).toBe("https://example.com/");
            expect(result.data[0].ref_pages).toBe(1247);
            expect(result.data[0].ref_domains).toBe(856);
            expect(result.data[0].ips).toBe(645);
        });

        it('should handle domain_with_subdomains search type', async () => {
            const params = {
                query: 'example.com',
                searchType: 'domain_with_subdomains' as const
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;
            // @ts-ignore
            const result = await service.getTopPagesByBacklinks(params);

            expect(result).toEqual(mockTopPagesResponse);
            expect(result.summary_info.count).toBe(3);
            expect(result.summary_info.total).toBe(245);
            expect(result.summary_info.left_lines).toBe(9998);
        });

        it('should handle all parameters correctly', async () => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                sort: 'ips' as const,
                order: 'asc' as const,
                complexFilter: [
                    [
                        {
                            field: 'count' as const,
                            compareType: 'gte' as const,
                            value: [100]
                        }
                    ]
                ],
                page: 2,
                size: 50
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;

            const result = await service.getTopPagesByBacklinks(params);

            expect(result).toEqual(mockTopPagesResponse);
        });

        it('should handle complex filters correctly', async () => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                complexFilter: [
                    [
                        {
                            field: 'ref_domains' as const,
                            compareType: 'gte' as const,
                            value: [50] as number[],
                        },
                        {
                            field: 'url_to' as const,
                            compareType: 'contains' as const,
                            value: ['blog'] as string[],
                        }
                    ]
                ]
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;

            // @ts-ignore
            const result = await service.getTopPagesByBacklinks(params);

            expect(result).toEqual(mockTopPagesResponse);
        });

        it('should handle additional filters correctly', async () => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                complexFilter: [
                    [
                        {
                            additional_filters: 'no_subdomains' as const
                        }
                    ]
                ]
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;
            // @ts-ignore
            const result = await service.getTopPagesByBacklinks(params);

            expect(result).toEqual(mockTopPagesResponse);
        });

        it('should handle all sort fields correctly', async () => {
            const sortFields = ['ips', 'count', 'domains', 'url_to', 'lastupdate'];

            for (const sort of sortFields) {
                const params = {
                    query: 'example.com',
                    searchType: 'domain' as const,
                    sort: sort as any
                };

                // @ts-expect-error
                service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;
                // @ts-ignore
                const result = await service.getTopPagesByBacklinks(params);
                expect(result).toEqual(mockTopPagesResponse);
            }
        });

        it('should handle pagination correctly', async () => {
            const params = {
                query: 'example.com',
                searchType: 'domain' as const,
                page: 3,
                size: 25
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockTopPagesResponse }) as typeof service.makeRequest;
            // @ts-ignore
            const result = await service.getTopPagesByBacklinks(params);

            expect(result).toEqual(mockTopPagesResponse);
        });

        it('should throw error when API returns no result', async () => {
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;

            const params = {
                query: 'example.com',
                searchType: 'domain' as const
            };
            // @ts-ignore
            await expect(service.getTopPagesByBacklinks(params)).rejects.toThrow('No result data received from Serpstat API');
        });

        it('should validate all search types correctly', () => {
            const searchTypes = ['domain', 'domain_with_subdomains'];

            searchTypes.forEach(searchType => {
                // @ts-ignore
                const params: GetTopPagesByBacklinksParams = {
                    query: 'example.com',
                    searchType: searchType as any
                };
                expect(() => getTopPagesByBacklinksSchema.parse(params)).not.toThrow();
            });
        });

        it('should handle optional parameters correctly', () => {
            const minimalParams: GetTopPagesByBacklinksParams = {
                query: 'example.com',
                searchType: 'domain',
                sort: 'url_to',
                order: 'desc',
                page: 1,
                size: 1
            };
            expect(() => getTopPagesByBacklinksSchema.parse(minimalParams)).not.toThrow();

            const paramsWithOptional: GetTopPagesByBacklinksParams = {
                query: 'example.com',
                searchType: 'domain_with_subdomains',
                page: 2,
                size: 50,
                sort: 'ips',
                order: 'desc'
            };
            expect(() => getTopPagesByBacklinksSchema.parse(paramsWithOptional)).not.toThrow();
        });
    });
});

// Backlinks Intersection Schema Validation Tests
describe('getBacklinksIntersectionSchema validation', () => {
    it('should validate required parameters', () => {
        const validParams = {
            query: 'example.com',
            intersect: ['competitor1.com', 'competitor2.com']
        };
        expect(() => getBacklinksIntersectionSchema.parse(validParams)).not.toThrow();
    });

    it('should apply default values', () => {
        const params = {
            query: 'example.com',
            intersect: ['competitor1.com']
        };
        const parsed = getBacklinksIntersectionSchema.parse(params);
        expect(parsed.sort).toBe('domain_rank');
        expect(parsed.order).toBe('desc');
        expect(parsed.page).toBe(1);
        expect(parsed.size).toBe(100);
    });

    it('should validate all sort fields correctly', () => {
        const sortFields = ['domain_rank', 'links_count1', 'links_count2', 'links_count3'];

        sortFields.forEach(sort => {
            const params = {
                query: 'example.com',
                intersect: ['competitor1.com'],
                sort: sort as any
            };
            expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
        });
    });

    it('should reject invalid sort field', () => {
        const invalidParams = {
            query: 'example.com',
            intersect: ['competitor1.com'],
            sort: 'invalid_field'
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams)).toThrow();
    });

    it('should validate intersect array with correct size limits', () => {
        // Valid with 1 domain
        const validParams1 = {
            query: 'example.com',
            intersect: ['competitor1.com']
        };
        expect(() => getBacklinksIntersectionSchema.parse(validParams1)).not.toThrow();

        // Valid with 2 domains
        const validParams2 = {
            query: 'example.com',
            intersect: ['competitor1.com', 'competitor2.com']
        };
        expect(() => getBacklinksIntersectionSchema.parse(validParams2)).not.toThrow();

        // Invalid with empty array
        const invalidParams1 = {
            query: 'example.com',
            intersect: []
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams1)).toThrow();

        // Invalid with too many domains
        const invalidParams2 = {
            query: 'example.com',
            intersect: ['competitor1.com', 'competitor2.com', 'competitor3.com']
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams2)).toThrow();
    });

    it('should validate domain formats in query and intersect', () => {
        const validParams = {
            query: 'example.com',
            intersect: ['valid-domain.com', 'another-site.org']
        };
        expect(() => getBacklinksIntersectionSchema.parse(validParams)).not.toThrow();

        // Invalid main query domain
        const invalidParams1 = {
            query: 'invalid-domain',
            intersect: ['competitor1.com']
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams1)).toThrow();

        // Invalid intersect domain
        const invalidParams2 = {
            query: 'example.com',
            intersect: ['invalid-domain']
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams2)).toThrow();
    });

    it('should validate complex filter structure correctly', () => {
        const params = {
            query: 'example.com',
            intersect: ['competitor1.com'],
            complexFilter: [
                [
                    {
                        field: 'domain_rank' as const,
                        compareType: 'gte' as const,
                        value: [10]
                    },
                    {
                        field: 'links_count1' as const,
                        compareType: 'gte' as const,
                        value: [5]
                    }
                ]
            ]
        };
        expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
    });

    it('should validate additional filters correctly', () => {
        const params = {
            query: 'example.com',
            intersect: ['competitor1.com'],
            complexFilter: [
                [
                    {
                        additional_filters: 'no_subdomains' as const
                    }
                ]
            ]
        };
        expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
    });

    it('should reject missing required fields', () => {
        // Missing query
        const invalidParams1 = {
            intersect: ['competitor1.com']
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams1)).toThrow();

        // Missing intersect
        const invalidParams2 = {
            query: 'example.com'
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams2)).toThrow();
    });

    it('should validate pagination parameters', () => {
        const params = {
            query: 'example.com',
            intersect: ['competitor1.com'],
            page: 3,
            size: 200
        };
        expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
    });

    it('should reject invalid pagination parameters', () => {
        const invalidParams = {
            query: 'example.com',
            intersect: ['competitor1.com'],
            page: 0, // Invalid: must be >= 1
            size: 2000 // Invalid: exceeds maximum
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams)).toThrow();
    });

    it('should reject additional properties', () => {
        const invalidParams = {
            query: 'example.com',
            intersect: ['competitor1.com'],
            extraProperty: 'not allowed'
        };
        expect(() => getBacklinksIntersectionSchema.parse(invalidParams)).toThrow();
    });

    it('should handle all compareType values correctly', () => {
        const compareTypes = ['gt', 'lt', 'gte', 'lte', 'eq', 'neq', 'between', 'contains', 'notContains', 'startsWith', 'endsWith'];

        compareTypes.forEach(compareType => {
            const params = {
                query: 'example.com',
                intersect: ['competitor1.com'],
                complexFilter: [
                    [
                        {
                            field: 'domain_rank' as const,
                            compareType: compareType as any,
                            value: [1]
                        }
                    ]
                ]
            };
            expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
        });
    });

    it('should handle all additional filters correctly', () => {
        const additionalFilters = ['no_subdomains', 'only_main_page', 'last_week', 'only_subdomains', 'only_hosts'];

        additionalFilters.forEach(filter => {
            const params = {
                query: 'example.com',
                intersect: ['competitor1.com'],
                complexFilter: [
                    [
                        {
                            additional_filters: filter as any
                        }
                    ]
                ]
            };
            expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
        });
    });
});

describe('BacklinksService - getBacklinksIntersection', () => {
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

    describe('getBacklinksIntersection method', () => {
        const mockBacklinksIntersectionResponse: BacklinksIntersectionResponse = {
            data: [
                {
                    Domain: 'znaxarenko.mybb.ru',
                    SDR: 5,
                    'Links count for domain #1 gepur.com': 177,
                    'Links count for domain #2 klubok.com': 3,
                    'Links count for domain #3 issaplus.com': 0
                },
                {
                    Domain: 'speshka.com',
                    SDR: 30,
                    'Links count for domain #1 gepur.com': 61,
                    'Links count for domain #2 klubok.com': 1,
                    'Links count for domain #3 issaplus.com': 92
                }
            ],
            summary_info: {
                left_lines: 972852,
                page: 1,
                count: 2,
                total: 233,
                sort: 'links_count1',
                order: 'desc'
            }
        };

        it('should get backlinks intersection successfully with minimal params', async () => {
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com', 'issaplus.com']
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

            const result = await service.getBacklinksIntersection(params);

            expect(result).toEqual(mockBacklinksIntersectionResponse);
            expect(result.data).toHaveLength(2);
            expect(result.data[0].Domain).toBe('znaxarenko.mybb.ru');
            expect(result.data[0].SDR).toBe(5);
            expect(result.data[0]['Links count for domain #1 gepur.com']).toBe(177);
        });

        it('should handle all parameters correctly', async () => {
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com', 'issaplus.com'],
                sort: 'links_count1',
                order: 'desc',
                complexFilter: [
                    [
                        {
                            field: 'domain_rank',
                            compareType: 'gte',
                            value: [1]
                        },
                        {
                            field: 'links_count1',
                            compareType: 'gte',
                            value: [1]
                        }
                    ]
                ],
                page: 2,
                size: 50
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

            const result = await service.getBacklinksIntersection(params);

            expect(result).toEqual(mockBacklinksIntersectionResponse);
        });

        it('should handle single competitor correctly', async () => {
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com']
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

            const result = await service.getBacklinksIntersection(params);

            expect(result).toEqual(mockBacklinksIntersectionResponse);
            expect(result.summary_info.count).toBe(2);
            expect(result.summary_info.total).toBe(233);
            expect(result.summary_info.left_lines).toBe(972852);
        });

        it('should handle complex filters correctly', async () => {
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com'],
                complexFilter: [
                    [
                        {
                            field: 'domain_rank',
                            compareType: 'between',
                            value: [10, 50]
                        },
                        {
                            field: 'links_count1',
                            compareType: 'gte',
                            value: [5]
                        }
                    ]
                ]
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

            const result = await service.getBacklinksIntersection(params);

            expect(result).toEqual(mockBacklinksIntersectionResponse);
        });

        it('should handle additional filters correctly', async () => {
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com'],
                complexFilter: [
                    [
                        {
                            additional_filters: 'no_subdomains'
                        }
                    ]
                ]
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

            const result = await service.getBacklinksIntersection(params);

            expect(result).toEqual(mockBacklinksIntersectionResponse);
        });

        it('should handle all sort fields correctly', async () => {
            const sortFields = ['domain_rank', 'links_count1', 'links_count2', 'links_count3'];

            for (const sort of sortFields) {
                // @ts-ignore
                const params: GetBacklinksIntersectionParams = {
                    query: 'gepur.com',
                    intersect: ['klubok.com'],
                    sort: sort as any
                };

                // @ts-expect-error
                service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

                const result = await service.getBacklinksIntersection(params);
                expect(result).toEqual(mockBacklinksIntersectionResponse);
            }
        });

        it('should handle pagination correctly', async () => {
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com'],
                page: 3,
                size: 25
            };

            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse }) as typeof service.makeRequest;

            const result = await service.getBacklinksIntersection(params);

            expect(result).toEqual(mockBacklinksIntersectionResponse);
        });

        it('should throw error when API returns no result', async () => {
            // @ts-expect-error
            service.makeRequest = jest.fn().mockResolvedValue({}) as typeof service.makeRequest;
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com']
            };

            await expect(service.getBacklinksIntersection(params)).rejects.toThrow('No result data received from Serpstat API');
        });

        it('should handle optional parameters correctly', () => {
            // @ts-ignore
            const minimalParams: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com']
            };
            expect(() => getBacklinksIntersectionSchema.parse(minimalParams)).not.toThrow();

            const paramsWithOptional: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com', 'issaplus.com'],
                sort: 'domain_rank',
                order: 'desc',
                page: 2,
                size: 50
            };
            expect(() => getBacklinksIntersectionSchema.parse(paramsWithOptional)).not.toThrow();
        });

        it('should validate intersect domain count limits', () => {
            // Test maximum allowed domains (2)
            // @ts-ignore
            const validParams: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com', 'issaplus.com']
            };
            expect(() => getBacklinksIntersectionSchema.parse(validParams)).not.toThrow();

            // Test minimum required domains (1)
            // @ts-ignore
            const validParams2: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com']
            };
            expect(() => getBacklinksIntersectionSchema.parse(validParams2)).not.toThrow();
        });

        it('should handle all order types correctly', () => {
            const orders = ['asc', 'desc'];

            orders.forEach(order => {
                // @ts-ignore
                const params: GetBacklinksIntersectionParams = {
                    query: 'gepur.com',
                    intersect: ['klubok.com'],
                    order: order as any
                };
                expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
            });
        });

        it('should validate complex filter field types correctly', () => {
            const filterFields = ['domain_rank', 'links_count1', 'links_count2', 'links_count3'];

            filterFields.forEach(field => {
                // @ts-ignore
                const params: GetBacklinksIntersectionParams = {
                    query: 'gepur.com',
                    intersect: ['klubok.com'],
                    complexFilter: [
                        [
                            {
                                field: field as any,
                                compareType: 'gte',
                                value: [1]
                            }
                        ]
                    ]
                };
                expect(() => getBacklinksIntersectionSchema.parse(params)).not.toThrow();
            });
        });

        it('should properly use method name in API request', async () => {
            // @ts-ignore
            const params: GetBacklinksIntersectionParams = {
                query: 'gepur.com',
                intersect: ['klubok.com']
            };

            // @ts-ignore
            const mockMakeRequest = jest.fn().mockResolvedValue({ result: mockBacklinksIntersectionResponse });
            // @ts-expect-error
            service.makeRequest = mockMakeRequest;

            await service.getBacklinksIntersection(params);

            expect(mockMakeRequest).toHaveBeenCalledWith({
                id: expect.stringMatching(/^backlinks_intersection_\d+$/),
                method: 'SerpstatBacklinksProcedure.getIntersect',
                params: params
            });
        });
    });
});
