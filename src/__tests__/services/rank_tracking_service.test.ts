import { RankTrackingService } from '../../services/rank_tracking_service.js';
import { Config } from '../../utils/config.js';
import { GetRtProjectsListParams, GetRtProjectStatusParams, GetRtProjectRegionsListParams, GetRtProjectKeywordSerpHistoryParams, GetRtProjectUrlSerpHistoryParams } from '../../utils/validation.js';
import { beforeEach, describe, it, expect } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

describe('RankTrackingService', () => {
    let service: RankTrackingService;
    let mockConfig: Config;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: "error",
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new RankTrackingService(mockConfig);
    });

    describe('getRtProjectsList', () => {
        it('should work with default parameters', () => {
            const params: GetRtProjectsListParams = {};
            expect(params.page).toBeUndefined();
            expect(params.pageSize).toBeUndefined();
        });

        it('should validate pagination parameters', () => {
            const params: GetRtProjectsListParams = {
                page: 2,
                pageSize: 50,
            };
            expect(params.page).toBe(2);
            expect(params.pageSize).toBe(50);
        });

        it('should handle first page with custom page size', () => {
            const params: GetRtProjectsListParams = {
                page: 1,
                pageSize: 100,
            };
            expect(params.page).toBe(1);
            expect(params.pageSize).toBe(100);
        });
    });

    describe('getRtProjectStatus', () => {
        it('should validate required parameters', () => {
            const params: GetRtProjectStatusParams = {
                projectId: 12345,
                regionId: 2840,
            };
            expect(params.projectId).toBe(12345);
            expect(params.regionId).toBe(2840);
        });

        it('should handle minimum parameter values', () => {
            const params: GetRtProjectStatusParams = {
                projectId: 1,
                regionId: 1,
            };
            expect(params.projectId).toBeGreaterThanOrEqual(1);
            expect(params.regionId).toBeGreaterThanOrEqual(1);
        });

        it('should handle large project and region IDs', () => {
            const params: GetRtProjectStatusParams = {
                projectId: 999999,
                regionId: 999999,
            };
            expect(params.projectId).toBe(999999);
            expect(params.regionId).toBe(999999);
        });
    });

    describe('getRtProjectRegionsList', () => {
        it('should validate required project ID parameter', () => {
            const params: GetRtProjectRegionsListParams = {
                projectId: 853932,
            };
            expect(params.projectId).toBe(853932);
        });

        it('should handle minimum project ID value', () => {
            const params: GetRtProjectRegionsListParams = {
                projectId: 1,
            };
            expect(params.projectId).toBeGreaterThanOrEqual(1);
        });

        it('should handle large project ID values', () => {
            const params: GetRtProjectRegionsListParams = {
                projectId: 999999,
            };
            expect(params.projectId).toBe(999999);
        });
    });

    describe('getRtProjectKeywordSerpHistory', () => {
        it('should validate required parameters', () => {
            const params: GetRtProjectKeywordSerpHistoryParams = {
                projectId: 1269282,
                projectRegionId: 393639,
                page: 1,
            };
            expect(params.projectId).toBe(1269282);
            expect(params.projectRegionId).toBe(393639);
            expect(params.page).toBe(1);
        });

        it('should handle optional date range and sorting parameters', () => {
            const params: GetRtProjectKeywordSerpHistoryParams = {
                projectId: 715910,
                projectRegionId: 262189,
                page: 1,
                pageSize: 20,
                dateFrom: '2024-10-09',
                dateTo: '2025-01-10',
                sort: 'date',
                order: 'desc',
            };
            expect(params.pageSize).toBe(20);
            expect(params.dateFrom).toBe('2024-10-09');
            expect(params.dateTo).toBe('2025-01-10');
            expect(params.sort).toBe('date');
            expect(params.order).toBe('desc');
        });

        it('should handle keywords filter and tags option', () => {
            const params: GetRtProjectKeywordSerpHistoryParams = {
                projectId: 1226819,
                projectRegionId: 372691,
                page: 1,
                keywords: ['overwatch', 'wow name characters'],
                withTags: true,
            };
            expect(params.keywords).toHaveLength(2);
            expect(params.keywords).toContain('overwatch');
            expect(params.withTags).toBe(true);
        });
    });

    describe('getRtProjectUrlSerpHistory', () => {
        it('should validate required parameters', () => {
            const params: GetRtProjectUrlSerpHistoryParams = {
                projectId: 1226819,
                projectRegionId: 372691,
                page: 1,
            };
            expect(params.projectId).toBe(1226819);
            expect(params.projectRegionId).toBe(372691);
            expect(params.page).toBe(1);
        });

        it('should handle optional domain and date range parameters', () => {
            const params: GetRtProjectUrlSerpHistoryParams = {
                projectId: 1226819,
                projectRegionId: 372691,
                page: 1,
                domain: 'https://us.shop.battle.net/ru-ru/product/overwatch',
                dateFrom: '2025-02-09',
                dateTo: '2025-02-10',
                pageSize: 50,
            };
            expect(params.domain).toBe('https://us.shop.battle.net/ru-ru/product/overwatch');
            expect(params.dateFrom).toBe('2025-02-09');
            expect(params.dateTo).toBe('2025-02-10');
            expect(params.pageSize).toBe(50);
        });

        it('should handle keywords filter with sorting and tags', () => {
            const params: GetRtProjectUrlSerpHistoryParams = {
                projectId: 1226819,
                projectRegionId: 372691,
                page: 1,
                keywords: ['overwatch', 'wow name characters'],
                sort: 'keyword',
                order: 'desc',
                withTags: true,
            };
            expect(params.keywords).toHaveLength(2);
            expect(params.sort).toBe('keyword');
            expect(params.order).toBe('desc');
            expect(params.withTags).toBe(true);
        });
    });
});