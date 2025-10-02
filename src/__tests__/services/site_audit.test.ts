import { SiteAuditService } from '../../services/site_audit.js';
import {
    GetSiteAuditSettingsParams,
    getSiteAuditSettingsSchema,
    SetSiteAuditSettingsParams,
    setSiteAuditSettingsSchema,
    StartSiteAuditParams,
    startSiteAuditSchema,
    StopSiteAuditParams,
    stopSiteAuditSchema,
    GetCategoriesStatisticParams,
    getCategoriesStatisticSchema,
    GetHistoryByCountErrorParams,
    getHistoryByCountErrorSchema,
    GetSiteAuditsListParams,
    getSiteAuditsListSchema,
    GetScanUserUrlListParams,
    getScanUserUrlListSchema,
    GetDefaultSettingsParams,
    getDefaultSettingsSchema,
    GetBasicInfoParams,
    getBasicInfoSchema,
    GetReportWithoutDetailsParams,
    getReportWithoutDetailsSchema,
    GetErrorElementsParams,
    getErrorElementsSchema,
    GetSubElementsByCrcParams,
    getSubElementsByCrcSchema
} from '../../utils/validation.js';
import {
    GetSiteAuditSettingsResponse,
    StartSiteAuditResponse,
    StopSiteAuditResponse,
    GetCategoriesStatisticResponse,
    GetHistoryByCountErrorResponse,
    GetSiteAuditsListResponse,
    GetScanUserUrlListResponse,
    GetDefaultSettingsResponse,
    GetBasicInfoResponse,
    GetReportWithoutDetailsResponse,
    GetErrorElementsResponse,
    GetSubElementsByCrcResponse
} from '../../types/serpstat.js';


import { jest, describe, it, expect, beforeEach } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

const TEST_PROJECT_ID = 1113915;
const TEST_REPORT_ID = 10865982;
const TEST_COMPARE_REPORT_ID = 10973646;
const TEST_DOMAIN = 'example.com';
const TEST_ERROR_NAME = 'h1_missing';
const TEST_CRC = -1837113155;
const DEFAULT_LIMIT = 30;
const DEFAULT_OFFSET = 0;

describe('getSiteAuditSettingsSchema', () => {
    it('validates correct parameters', () => {
        const params: GetSiteAuditSettingsParams = {
            projectId: TEST_PROJECT_ID
        };
        expect(() => getSiteAuditSettingsSchema.parse(params)).not.toThrow();
    });

    it('rejects missing projectId', () => {
        const params = {};
        expect(() => getSiteAuditSettingsSchema.parse(params)).toThrow();
    });

    it('rejects invalid projectId type', () => {
        const params = { projectId: 'invalid' };
        expect(() => getSiteAuditSettingsSchema.parse(params)).toThrow();
    });
});

describe('setSiteAuditSettingsSchema', () => {
    const validMainSettings = {
        domain: TEST_DOMAIN,
        name: 'Test Project',
        subdomainsCheck: true,
        pagesLimit: 1000,
        scanSpeed: 1,
        autoSpeed: false,
        scanNoIndex: false,
        autoUserAgent: false,
        scanWrongCanonical: false,
        scanDuration: 6,
        folderDepth: 0,
        urlDepth: 10,
        userAgent: 0,
        robotsTxt: true,
        withImages: false
    };

    it('validates correct parameters', () => {
        const params: SetSiteAuditSettingsParams = {
            projectId: TEST_PROJECT_ID,
            mainSettings: validMainSettings,
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] }
        };
        expect(() => setSiteAuditSettingsSchema.parse(params)).not.toThrow();
    });

    it('rejects invalid scan speed', () => {
        const params = {
            projectId: TEST_PROJECT_ID,
            mainSettings: { ...validMainSettings, scanSpeed: 31 },
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] }
        };
        expect(() => setSiteAuditSettingsSchema.parse(params)).toThrow();
    });

    it('rejects invalid user agent ID', () => {
        const params = {
            projectId: TEST_PROJECT_ID,
            mainSettings: { ...validMainSettings, userAgent: 10 },
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] }
        };
        expect(() => setSiteAuditSettingsSchema.parse(params)).toThrow();
    });
});

describe('startSiteAuditSchema', () => {
    it('validates correct parameters', () => {
        const params: StartSiteAuditParams = {
            projectId: TEST_PROJECT_ID
        };
        expect(() => startSiteAuditSchema.parse(params)).not.toThrow();
    });

    it('rejects missing projectId', () => {
        const params = {};
        expect(() => startSiteAuditSchema.parse(params)).toThrow();
    });

    it('rejects invalid projectId value', () => {
        const params = { projectId: 0 };
        expect(() => startSiteAuditSchema.parse(params)).toThrow();
    });
});

describe('stopSiteAuditSchema', () => {
    it('validates correct parameters', () => {
        const params: StopSiteAuditParams = {
            projectId: TEST_PROJECT_ID
        };
        expect(() => stopSiteAuditSchema.parse(params)).not.toThrow();
    });

    it('rejects missing projectId', () => {
        const params = {};
        expect(() => stopSiteAuditSchema.parse(params)).toThrow();
    });

    it('rejects negative projectId', () => {
        const params = { projectId: -1 };
        expect(() => stopSiteAuditSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getSettings', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns settings from API', async () => {
        const params: GetSiteAuditSettingsParams = { projectId: TEST_PROJECT_ID };
        const mockResult: GetSiteAuditSettingsResponse = {
            mainSettings: {
                domain: TEST_DOMAIN,
                name: 'Test Project',
                subdomainsCheck: true,
                pagesLimit: 1000,
                scanSpeed: 1,
                autoSpeed: false,
                scanNoIndex: false,
                autoUserAgent: false,
                scanWrongCanonical: false,
                scanDuration: 6,
                folderDepth: 0,
                urlDepth: 10,
                userAgent: 0,
                robotsTxt: true,
                withImages: false
            },
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] },
            errorsSettings: {
                tiny_title: 10,
                long_title: 70,
                tiny_desc: 100,
                long_desc: 160,
                long_url: 1024,
                large_image_size: 100,
                large_page_size: 2,
                many_external_links: 500
            }
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getSettings(params);
        expect(result).toEqual(mockResult);
    });

    it('throws error when no result returned', async () => {
        const params: GetSiteAuditSettingsParams = { projectId: TEST_PROJECT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getSettings(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetSiteAuditSettingsParams = { projectId: TEST_PROJECT_ID };
        const mockResult: GetSiteAuditSettingsResponse = {
            mainSettings: {
                domain: TEST_DOMAIN,
                name: 'Test',
                subdomainsCheck: false,
                pagesLimit: 500,
                scanSpeed: 3,
                autoSpeed: true,
                scanNoIndex: true,
                autoUserAgent: true,
                scanWrongCanonical: true,
                scanDuration: 12,
                folderDepth: 5,
                urlDepth: 20,
                userAgent: 1,
                robotsTxt: false,
                withImages: true
            },
            dontScanKeywordsBlock: { checked: true, keywords: 'test' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: 'user', password: 'pass' },
            mailTriggerSettings: { emails: ['test@example.com'], interval: 1, enabled: true },
            scheduleSettings: { scheduleRepeatOption: 3 },
            scanSetting: { type: 2, list: [] },
            errorsSettings: {
                tiny_title: 10,
                long_title: 70,
                tiny_desc: 100,
                long_desc: 160,
                long_url: 1024,
                large_image_size: 100,
                large_page_size: 2,
                many_external_links: 500
            }
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getSettings(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getSettings' })
        );
    });
});

describe('SiteAuditService.setSettings', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns null on success', async () => {
        const params: SetSiteAuditSettingsParams = {
            projectId: TEST_PROJECT_ID,
            mainSettings: {
                domain: TEST_DOMAIN,
                name: 'Test',
                subdomainsCheck: true,
                pagesLimit: 1000,
                scanSpeed: 1,
                autoSpeed: false,
                scanNoIndex: false,
                autoUserAgent: false,
                scanWrongCanonical: false,
                scanDuration: 6,
                folderDepth: 0,
                urlDepth: 10,
                userAgent: 0,
                robotsTxt: true,
                withImages: false
            },
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] }
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        const result = await service.setSettings(params);
        expect(result).toBeNull();
    });

    it('validates request method', async () => {
        const params: SetSiteAuditSettingsParams = {
            projectId: TEST_PROJECT_ID,
            mainSettings: {
                domain: TEST_DOMAIN,
                name: 'Test',
                subdomainsCheck: true,
                pagesLimit: 1000,
                scanSpeed: 1,
                autoSpeed: false,
                scanNoIndex: false,
                autoUserAgent: false,
                scanWrongCanonical: false,
                scanDuration: 6,
                folderDepth: 0,
                urlDepth: 10,
                userAgent: 0,
                robotsTxt: true,
                withImages: false
            },
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] }
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await service.setSettings(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.setSettings' })
        );
    });

    it('handles error settings parameter', async () => {
        const params: SetSiteAuditSettingsParams = {
            projectId: TEST_PROJECT_ID,
            mainSettings: {
                domain: TEST_DOMAIN,
                name: 'Test',
                subdomainsCheck: true,
                pagesLimit: 1000,
                scanSpeed: 1,
                autoSpeed: false,
                scanNoIndex: false,
                autoUserAgent: false,
                scanWrongCanonical: false,
                scanDuration: 6,
                folderDepth: 0,
                urlDepth: 10,
                userAgent: 0,
                robotsTxt: true,
                withImages: false
            },
            dontScanKeywordsBlock: { checked: false, keywords: '' },
            onlyScanKeywordsBlock: { checked: false, keywords: '' },
            baseAuthBlock: { login: '', password: '' },
            mailTriggerSettings: { emails: [], interval: 0, enabled: false },
            scheduleSettings: { scheduleRepeatOption: 0 },
            scanSetting: { type: 1, list: [] },
            errorsSettings: {
                tiny_title: 15,
                long_title: 80,
                tiny_desc: 120,
                long_desc: 180,
                long_url: 2048,
                large_image_size: 200,
                large_page_size: 5,
                many_external_links: 1000
            }
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        const result = await service.setSettings(params);
        expect(result).toBeNull();
    });
});

describe('SiteAuditService.start', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns reportId from API', async () => {
        const params: StartSiteAuditParams = { projectId: TEST_PROJECT_ID };
        const mockResult: StartSiteAuditResponse = { reportId: TEST_REPORT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.start(params);
        expect(result).toEqual(mockResult);
        expect(result.reportId).toBe(TEST_REPORT_ID);
    });

    it('throws error when no result returned', async () => {
        const params: StartSiteAuditParams = { projectId: TEST_PROJECT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.start(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: StartSiteAuditParams = { projectId: TEST_PROJECT_ID };
        const mockResult: StartSiteAuditResponse = { reportId: TEST_REPORT_ID };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.start(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.start' })
        );
    });
});

describe('SiteAuditService.stop', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns true when audit stopped successfully', async () => {
        const params: StopSiteAuditParams = { projectId: TEST_PROJECT_ID };
        const mockResult: StopSiteAuditResponse = { result: true };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.stop(params);
        expect(result).toBe(true);
    });

    it('returns false when audit stop failed', async () => {
        const params: StopSiteAuditParams = { projectId: TEST_PROJECT_ID };
        const mockResult: StopSiteAuditResponse = { result: false };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.stop(params);
        expect(result).toBe(false);
    });

    it('validates request method', async () => {
        const params: StopSiteAuditParams = { projectId: TEST_PROJECT_ID };
        const mockResult: StopSiteAuditResponse = { result: true };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.stop(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.stop' })
        );
    });
});

describe('getCategoriesStatisticSchema', () => {
    it('validates correct parameters', () => {
        const params: GetCategoriesStatisticParams = {
            reportId: TEST_REPORT_ID
        };
        expect(() => getCategoriesStatisticSchema.parse(params)).not.toThrow();
    });

    it('rejects missing reportId', () => {
        const params = {};
        expect(() => getCategoriesStatisticSchema.parse(params)).toThrow();
    });

    it('rejects invalid reportId value', () => {
        const params = { reportId: 0 };
        expect(() => getCategoriesStatisticSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getCategoriesStatistic', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns categories statistic from API', async () => {
        const params: GetCategoriesStatisticParams = { reportId: TEST_REPORT_ID };
        const mockResult: GetCategoriesStatisticResponse = [
            { category: 'pages_status', highCount: 5, mediumCount: 10, lowCount: 3, informationCount: 2 },
            { category: 'meta_tags', highCount: 2, mediumCount: 7, lowCount: 1, informationCount: 0 }
        ];
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getCategoriesStatistic(params);
        expect(result).toEqual(mockResult);
        expect(result.length).toBe(2);
    });

    it('throws error when no result returned', async () => {
        const params: GetCategoriesStatisticParams = { reportId: TEST_REPORT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getCategoriesStatistic(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetCategoriesStatisticParams = { reportId: TEST_REPORT_ID };
        const mockResult: GetCategoriesStatisticResponse = [];
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getCategoriesStatistic(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getCategoriesStatistic' })
        );
    });
});

describe('getHistoryByCountErrorSchema', () => {
    it('validates correct parameters', () => {
        const params: GetHistoryByCountErrorParams = {
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            limit: 10,
            offset: 0
        };
        expect(() => getHistoryByCountErrorSchema.parse(params)).not.toThrow();
    });

    it('applies default values for limit and offset', () => {
        const params = {
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME
        };
        const result = getHistoryByCountErrorSchema.parse(params);
        expect(result.limit).toBe(DEFAULT_LIMIT);
        expect(result.offset).toBe(DEFAULT_OFFSET);
    });

    it('rejects invalid limit value', () => {
        const params = {
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            limit: 0
        };
        expect(() => getHistoryByCountErrorSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getHistoryByCountError', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns error history from API', async () => {
        const params: GetHistoryByCountErrorParams = {
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            limit: 10,
            offset: 0
        };
        const mockResult: GetHistoryByCountErrorResponse = {
            errorCounts: [
                { reportId: TEST_REPORT_ID, date: '2024-01-15', count: '5' },
                { reportId: TEST_REPORT_ID + 1, date: '2024-01-16', count: '3' }
            ]
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getHistoryByCountError(params);
        expect(result).toEqual(mockResult);
        expect(result.errorCounts.length).toBe(2);
    });

    it('throws error when no result returned', async () => {
        // @ts-ignore
        const params: GetHistoryByCountErrorParams = {
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getHistoryByCountError(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        // @ts-ignore
        const params: GetHistoryByCountErrorParams = {
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME
        };
        const mockResult: GetHistoryByCountErrorResponse = { errorCounts: [] };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getHistoryByCountError(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getHistoryByCountError' })
        );
    });
});

describe('getSiteAuditsListSchema', () => {
    it('validates correct parameters', () => {
        const params: GetSiteAuditsListParams = {
            projectId: TEST_PROJECT_ID,
            limit: 20,
            offset: 10
        };
        expect(() => getSiteAuditsListSchema.parse(params)).not.toThrow();
    });

    it('applies default values for limit and offset', () => {
        const params = {
            projectId: TEST_PROJECT_ID
        };
        const result = getSiteAuditsListSchema.parse(params);
        expect(result.limit).toBe(DEFAULT_LIMIT);
        expect(result.offset).toBe(DEFAULT_OFFSET);
    });

    it('rejects negative offset', () => {
        const params = {
            projectId: TEST_PROJECT_ID,
            offset: -1
        };
        expect(() => getSiteAuditsListSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getSiteAuditsList', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns site audits list from API', async () => {
        const params: GetSiteAuditsListParams = {
            projectId: TEST_PROJECT_ID,
            limit: 10,
            offset: 0
        };
        const mockResult: GetSiteAuditsListResponse = [
            {
                reportId: TEST_REPORT_ID,
                date: '2024-01-15',
                sdo: 85,
                pagesLimit: 1000,
                pagesScanned: 500,
                criticalCount: 5,
                nonCriticalCount: 10,
                virusesCount: 0,
                progress: 100,
                stoped: false,
                hasDetailData: true
            }
        ];
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getSiteAuditsList(params);
        expect(result).toEqual(mockResult);
        expect(result.length).toBe(1);
    });

    it('throws error when no result returned', async () => {
        // @ts-ignore
        const params: GetSiteAuditsListParams = { projectId: TEST_PROJECT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getSiteAuditsList(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        // @ts-ignore
        const params: GetSiteAuditsListParams = { projectId: TEST_PROJECT_ID };
        const mockResult: GetSiteAuditsListResponse = [];
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getSiteAuditsList(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getList' })
        );
    });
});

describe('getScanUserUrlListSchema', () => {
    it('validates correct parameters', () => {
        const params: GetScanUserUrlListParams = {
            projectId: TEST_PROJECT_ID
        };
        expect(() => getScanUserUrlListSchema.parse(params)).not.toThrow();
    });

    it('rejects missing projectId', () => {
        const params = {};
        expect(() => getScanUserUrlListSchema.parse(params)).toThrow();
    });

    it('rejects invalid projectId type', () => {
        const params = { projectId: 'invalid' };
        expect(() => getScanUserUrlListSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getScanUserUrlList', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns scan user URL list from API', async () => {
        const params: GetScanUserUrlListParams = { projectId: TEST_PROJECT_ID };
        const mockResult: GetScanUserUrlListResponse = {
            urls: ['https://example.com/page1', 'https://example.com/page2'],
            scanType: 2,
            isImported: false
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getScanUserUrlList(params);
        expect(result).toEqual(mockResult);
        expect(result.urls.length).toBe(2);
    });

    it('throws error when no result returned', async () => {
        const params: GetScanUserUrlListParams = { projectId: TEST_PROJECT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getScanUserUrlList(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetScanUserUrlListParams = { projectId: TEST_PROJECT_ID };
        const mockResult: GetScanUserUrlListResponse = { urls: [], scanType: 2, isImported: false };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getScanUserUrlList(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getScanUserUrlList' })
        );
    });
});

describe('getDefaultSettingsSchema', () => {
    it('validates correct parameters', () => {
        const params: GetDefaultSettingsParams = {};
        expect(() => getDefaultSettingsSchema.parse(params)).not.toThrow();
    });

    it('rejects extra properties', () => {
        const params = { unexpectedField: 'value' };
        expect(() => getDefaultSettingsSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getDefaultSettings', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    const mockDefaultSettings: GetDefaultSettingsResponse = {
        mainSettings: {
            domain: '',
            name: '',
            subdomainsCheck: false,
            pagesLimit: 500,
            scanSpeed: 3,
            autoSpeed: true,
            scanNoIndex: false,
            autoUserAgent: true,
            scanWrongCanonical: false,
            scanDuration: 6,
            folderDepth: 0,
            urlDepth: 10,
            userAgent: 0,
            robotsTxt: true,
            withImages: false
        },
        dontScanKeywordsBlock: { checked: false, keywords: '' },
        onlyScanKeywordsBlock: { checked: false, keywords: '' },
        baseAuthBlock: { login: '', password: '' },
        mailTriggerSettings: { emails: [], interval: 0, enabled: false },
        scheduleSettings: { scheduleRepeatOption: 0 },
        scanSetting: { type: 1, list: [] },
        errorsSettings: {
            tiny_title: 10,
            long_title: 70,
            tiny_desc: 100,
            long_desc: 160,
            long_url: 1024,
            large_image_size: 100,
            large_page_size: 2,
            many_external_links: 500
        }
    };

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns default settings from API', async () => {
        const params: GetDefaultSettingsParams = {};
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockDefaultSettings });
        const result = await service.getDefaultSettings(params);
        expect(result).toEqual(mockDefaultSettings);
    });

    it('throws error when no result returned', async () => {
        const params: GetDefaultSettingsParams = {};
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getDefaultSettings(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetDefaultSettingsParams = {};
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockDefaultSettings });
        await service.getDefaultSettings(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getDefaultSettings' })
        );
    });
});

describe('getBasicInfoSchema', () => {
    it('validates correct parameters', () => {
        const params: GetBasicInfoParams = {
            reportId: TEST_REPORT_ID
        };
        expect(() => getBasicInfoSchema.parse(params)).not.toThrow();
    });

    it('rejects missing reportId', () => {
        const params = {};
        expect(() => getBasicInfoSchema.parse(params)).toThrow();
    });

    it('rejects invalid reportId value', () => {
        const params = { reportId: 0 };
        expect(() => getBasicInfoSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getBasicInfo', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns basic audit info from API', async () => {
        const params: GetBasicInfoParams = { reportId: TEST_REPORT_ID };
        const mockResult: GetBasicInfoResponse = {
            reportId: TEST_REPORT_ID,
            date: '2024-12-25 09:41:50',
            sdo: 74,
            highCount: 335,
            mediumCount: 319,
            lowCount: 401,
            informationCount: 458,
            virusesCount: 0,
            progress: 100,
            stoped: 0,
            specialStopReason: 0,
            checkedPageCount: 163,
            totalCheckedPageCount: 170,
            redirectCount: 0,
            captchaDetected: false,
            hasDetailData: true
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getBasicInfo(params);
        expect(result).toEqual(mockResult);
        expect(result.sdo).toBe(74);
    });

    it('throws error when no result returned', async () => {
        const params: GetBasicInfoParams = { reportId: TEST_REPORT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getBasicInfo(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetBasicInfoParams = { reportId: TEST_REPORT_ID };
        const mockResult: GetBasicInfoResponse = {
            reportId: TEST_REPORT_ID,
            date: '2024-12-25 09:41:50',
            sdo: 74,
            highCount: 335,
            mediumCount: 319,
            lowCount: 401,
            informationCount: 458,
            virusesCount: 0,
            progress: 100,
            stoped: 0,
            specialStopReason: 0,
            checkedPageCount: 163,
            totalCheckedPageCount: 170,
            redirectCount: 0,
            captchaDetected: false,
            hasDetailData: true
        };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getBasicInfo(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getBasicInfo' })
        );
    });
});

describe('getReportWithoutDetailsSchema', () => {
    it('validates correct parameters with compareReportId', () => {
        const params: GetReportWithoutDetailsParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID
        };
        expect(() => getReportWithoutDetailsSchema.parse(params)).not.toThrow();
    });

    it('validates correct parameters without compareReportId', () => {
        const params = {
            reportId: TEST_REPORT_ID
        };
        expect(() => getReportWithoutDetailsSchema.parse(params)).not.toThrow();
    });

    it('rejects missing reportId', () => {
        const params = {};
        expect(() => getReportWithoutDetailsSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getReportWithoutDetails', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns report without details from API', async () => {
        const params: GetReportWithoutDetailsParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID
        };
        const mockResult: GetReportWithoutDetailsResponse = {
            categories: [
                {
                    key: 'pages_status',
                    errors: [
                        { key: 'errors_400', priority: 'high', countAll: 9, countNew: 0, countFixed: 0 },
                        { key: 'errors_500', priority: 'high', countAll: 5, countNew: 0, countFixed: 0 }
                    ]
                }
            ]
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getReportWithoutDetails(params);
        expect(result).toEqual(mockResult);
        expect(result.categories.length).toBe(1);
    });

    it('throws error when no result returned', async () => {
        const params: GetReportWithoutDetailsParams = { reportId: TEST_REPORT_ID };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getReportWithoutDetails(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetReportWithoutDetailsParams = { reportId: TEST_REPORT_ID };
        const mockResult: GetReportWithoutDetailsResponse = { categories: [] };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getReportWithoutDetails(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getReportWithoutDetails' })
        );
    });
});

describe('getErrorElementsSchema', () => {
    it('validates correct parameters with all fields', () => {
        const params: GetErrorElementsParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            mode: 'all',
            limit: 10,
            offset: 0
        };
        expect(() => getErrorElementsSchema.parse(params)).not.toThrow();
    });

    it('applies default values for mode, limit and offset', () => {
        const params = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME
        };
        const result = getErrorElementsSchema.parse(params);
        expect(result.mode).toBe('all');
        expect(result.limit).toBe(10);
        expect(result.offset).toBe(0);
    });

    it('rejects missing required fields', () => {
        const params = { reportId: TEST_REPORT_ID };
        expect(() => getErrorElementsSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getErrorElements', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns error elements from API', async () => {
        const params: GetErrorElementsParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: 'redirects',
            mode: 'all',
            limit: 10,
            offset: 0
        };
        const mockResult: GetErrorElementsResponse = {
            data: [
                {
                    startUrl: 'https://example.com/page1',
                    code: 301,
                    finishUrl: 'https://example.com/page2',
                    count: 1,
                    startUrlCrc: TEST_CRC
                }
            ],
            totalCount: 7,
            mode: 'all'
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getErrorElements(params);
        expect(result).toEqual(mockResult);
        expect(result.totalCount).toBe(7);
    });

    it('throws error when no result returned', async () => {
        const params: GetErrorElementsParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            mode: 'all',
            limit: 10,
            offset: 0
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getErrorElements(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetErrorElementsParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            mode: 'all',
            limit: 10,
            offset: 0
        };
        const mockResult: GetErrorElementsResponse = { data: [], totalCount: 0, mode: 'all' };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getErrorElements(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getErrorElements' })
        );
    });
});

describe('getSubElementsByCrcSchema', () => {
    it('validates correct parameters with all fields', () => {
        const params: GetSubElementsByCrcParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            mode: 'all',
            limit: 30,
            offset: 0,
            crc: TEST_CRC
        };
        expect(() => getSubElementsByCrcSchema.parse(params)).not.toThrow();
    });

    it('applies default values for mode, limit and offset', () => {
        const params = {
            reportId: TEST_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            crc: TEST_CRC
        };
        const result = getSubElementsByCrcSchema.parse(params);
        expect(result.mode).toBe('all');
        expect(result.limit).toBe(30);
        expect(result.offset).toBe(0);
    });

    it('rejects missing crc field', () => {
        const params = {
            reportId: TEST_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME
        };
        expect(() => getSubElementsByCrcSchema.parse(params)).toThrow();
    });
});

describe('SiteAuditService.getSubElementsByCrc', () => {
    let service: SiteAuditService;
    let mockConfig: any;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: 'error',
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new SiteAuditService(mockConfig);
    });

    it('returns sub-elements by CRC from API', async () => {
        const params: GetSubElementsByCrcParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_COMPARE_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: 'redirects',
            mode: 'all',
            limit: 30,
            offset: 0,
            crc: TEST_CRC
        };
        const mockResult: GetSubElementsByCrcResponse = {
            data: ['https://example.com/page1.html'],
            totalCount: 1
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        const result = await service.getSubElementsByCrc(params);
        expect(result).toEqual(mockResult);
        expect(result.data.length).toBe(1);
    });

    it('throws error when no result returned', async () => {
        const params: GetSubElementsByCrcParams = {
            reportId: TEST_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            mode: 'all',
            limit: 30,
            offset: 0,
            crc: TEST_CRC
        };
        jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: null });
        await expect(service.getSubElementsByCrc(params)).rejects.toThrow('No result data received from Serpstat API');
    });

    it('validates request method', async () => {
        const params: GetSubElementsByCrcParams = {
            reportId: TEST_REPORT_ID,
            projectId: TEST_PROJECT_ID,
            errorName: TEST_ERROR_NAME,
            mode: 'all',
            limit: 30,
            offset: 0,
            crc: TEST_CRC
        };
        const mockResult: GetSubElementsByCrcResponse = { data: [], totalCount: 0 };
        const makeRequestSpy = jest.spyOn(service as any, 'makeRequest').mockResolvedValueOnce({ result: mockResult });
        await service.getSubElementsByCrc(params);
        expect(makeRequestSpy).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'AuditSite.getSubElementsByCrc' })
        );
    });
});
