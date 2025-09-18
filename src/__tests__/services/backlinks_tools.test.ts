import { BacklinksService } from '../../services/backlinks_tools.js';
import { BacklinksSummaryParams, backlinksSummarySchema, AnchorsParams, anchorsSchema, GetActiveBacklinksParams, getActiveBacklinksSchema, GetReferringDomainsParams, getReferringDomainsSchema, getLostBacklinksSchema, getTopAnchorsSchema, GetTopAnchorsParams } from '../../utils/validation.js';
import { BacklinksSummaryResponse, AnchorsResponse, ActiveBacklinksResponse, ReferringDomainsResponse, TopAnchorsResponse } from '../../types/serpstat.js';
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
