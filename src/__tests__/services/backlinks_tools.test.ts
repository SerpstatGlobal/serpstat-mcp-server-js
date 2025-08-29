import { BacklinksService } from '../../services/backlinks_tools.js';
import { BacklinksSummaryParams, backlinksSummarySchema } from '../../utils/validation.js';
import { BacklinksSummaryResponse } from '../../types/serpstat.js';
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
});
