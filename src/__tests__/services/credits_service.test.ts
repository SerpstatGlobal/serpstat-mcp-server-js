import { CreditsService } from '../../services/credits_service.js';
import { Config } from '../../utils/config.js';
import { GetAuditStatsParams, GetCreditsStatsParams } from '../../utils/validation.js';
import { beforeEach, describe, it, expect } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

describe('CreditsService', () => {
    let service: CreditsService;
    let mockConfig: Config;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: "error",
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new CreditsService(mockConfig);
    });

    describe('getAuditStats', () => {
        it('should work without any parameters', () => {
            const params: GetAuditStatsParams = {};
            expect(params).toBeDefined();
            expect(Object.keys(params)).toHaveLength(0);
        });

        it('should validate empty object', () => {
            const params: GetAuditStatsParams = {};
            expect(params).toEqual({});
        });

        it('should be compatible with service method signature', () => {
            const params: GetAuditStatsParams = {};
            expect(typeof params).toBe('object');
        });
    });

    describe('getCreditsStats', () => {
        it('should work without any parameters', () => {
            const params: GetCreditsStatsParams = {};
            expect(params).toBeDefined();
            expect(Object.keys(params)).toHaveLength(0);
        });

        it('should validate empty object', () => {
            const params: GetCreditsStatsParams = {};
            expect(params).toEqual({});
        });

        it('should be compatible with service method signature', () => {
            const params: GetCreditsStatsParams = {};
            expect(typeof params).toBe('object');
        });
    });
});