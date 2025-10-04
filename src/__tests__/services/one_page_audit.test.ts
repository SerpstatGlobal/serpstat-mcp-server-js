import {
    StartOnePageAuditScanParams,
    startOnePageAuditScanSchema,
    GetOnePageAuditsListParams,
    getOnePageAuditsListSchema,
    GetOnePageReportsListParams,
    getOnePageReportsListSchema,
    GetOnePageAuditResultsParams,
    getOnePageAuditResultsSchema,
    RescanOnePageAuditParams,
    rescanOnePageAuditSchema,
    StopOnePageAuditParams,
    stopOnePageAuditSchema,
    RemoveOnePageAuditParams,
    removeOnePageAuditSchema,
    GetOnePageAuditByCategoriesParams,
    getOnePageAuditByCategoriesSchema,
    GetOnePageAuditErrorRowsParams,
    getOnePageAuditErrorRowsSchema,
    GetOnePageAuditPageNamesParams,
    getOnePageAuditPageNamesSchema,
    GetOnePageAuditUserLogParams,
    getOnePageAuditUserLogSchema
} from '../../utils/validation.js';

import { describe, it, expect } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

const TEST_PAGE_ID = 52540;
const TEST_URL = 'https://example.com/';
const TEST_NAME = 'Example one page audit';
const TEST_USER_AGENT = 1;
const DEFAULT_LIMIT = 30;
const DEFAULT_OFFSET = 0;
const TEST_REPORT_ID = 74820;
const TEST_ERROR_NAME = 'no_desc';

describe('startOnePageAuditScanSchema', () => {
    it('validates correct parameters', () => {
        const params: StartOnePageAuditScanParams = {
            name: TEST_NAME,
            url: TEST_URL,
            userAgent: TEST_USER_AGENT
        };
        expect(() => startOnePageAuditScanSchema.parse(params)).not.toThrow();
    });

    it('rejects missing required fields', () => {
        const params = { name: TEST_NAME };
        expect(() => startOnePageAuditScanSchema.parse(params)).toThrow();
    });

    it('rejects invalid URL format', () => {
        const params = {
            name: TEST_NAME,
            url: 'not-a-valid-url',
            userAgent: TEST_USER_AGENT
        };
        expect(() => startOnePageAuditScanSchema.parse(params)).toThrow();
    });
});

describe('getOnePageAuditsListSchema', () => {
    it('validates correct parameters with defaults', () => {
        // @ts-ignore
        const params: GetOnePageAuditsListParams = {};
        const result = getOnePageAuditsListSchema.parse(params);
        expect(result.limit).toBe(DEFAULT_LIMIT);
        expect(result.offset).toBe(DEFAULT_OFFSET);
    });

    it('validates custom limit and offset', () => {
        const params: GetOnePageAuditsListParams = {
            limit: 10,
            offset: 20
        };
        expect(() => getOnePageAuditsListSchema.parse(params)).not.toThrow();
    });

    it('rejects invalid limit value', () => {
        const params = { limit: 0 };
        expect(() => getOnePageAuditsListSchema.parse(params)).toThrow();
    });
});

describe('getOnePageReportsListSchema', () => {
    it('validates correct parameters', () => {
        const params: GetOnePageReportsListParams = {
            pageId: TEST_PAGE_ID
        };
        expect(() => getOnePageReportsListSchema.parse(params)).not.toThrow();
    });

    it('validates with optional parameters', () => {
        const params: GetOnePageReportsListParams = {
            pageId: TEST_PAGE_ID,
            limit: 10,
            offset: 5
        };
        expect(() => getOnePageReportsListSchema.parse(params)).not.toThrow();
    });

    it('rejects missing pageId', () => {
        const params = {};
        expect(() => getOnePageReportsListSchema.parse(params)).toThrow();
    });
});

describe('getOnePageAuditResultsSchema', () => {
    it('validates correct parameters', () => {
        const params: GetOnePageAuditResultsParams = {
            pageId: TEST_PAGE_ID
        };
        expect(() => getOnePageAuditResultsSchema.parse(params)).not.toThrow();
    });

    it('rejects missing pageId', () => {
        const params = {};
        expect(() => getOnePageAuditResultsSchema.parse(params)).toThrow();
    });

    it('rejects invalid pageId type', () => {
        const params = { pageId: 'invalid' };
        expect(() => getOnePageAuditResultsSchema.parse(params)).toThrow();
    });
});

describe('rescanOnePageAuditSchema', () => {
    it('validates correct parameters', () => {
        const params: RescanOnePageAuditParams = {
            pageId: TEST_PAGE_ID,
            name: TEST_NAME,
            userAgent: TEST_USER_AGENT
        };
        expect(() => rescanOnePageAuditSchema.parse(params)).not.toThrow();
    });

    it('rejects missing required fields', () => {
        const params = { pageId: TEST_PAGE_ID };
        expect(() => rescanOnePageAuditSchema.parse(params)).toThrow();
    });

    it('validates with optional auth parameters', () => {
        const params: RescanOnePageAuditParams = {
            pageId: TEST_PAGE_ID,
            name: TEST_NAME,
            userAgent: TEST_USER_AGENT,
            httpAuthLogin: 'user',
            httpAuthPass: 'pass'
        };
        expect(() => rescanOnePageAuditSchema.parse(params)).not.toThrow();
    });
});

describe('stopOnePageAuditSchema', () => {
    it('validates correct parameters', () => {
        const params: StopOnePageAuditParams = {
            pageId: TEST_PAGE_ID
        };
        expect(() => stopOnePageAuditSchema.parse(params)).not.toThrow();
    });

    it('rejects missing pageId', () => {
        const params = {};
        expect(() => stopOnePageAuditSchema.parse(params)).toThrow();
    });

    it('rejects invalid pageId value', () => {
        const params = { pageId: 0 };
        expect(() => stopOnePageAuditSchema.parse(params)).toThrow();
    });
});

describe('removeOnePageAuditSchema', () => {
    it('validates correct parameters', () => {
        const params: RemoveOnePageAuditParams = {
            pageId: TEST_PAGE_ID
        };
        expect(() => removeOnePageAuditSchema.parse(params)).not.toThrow();
    });

    it('rejects missing pageId', () => {
        const params = {};
        expect(() => removeOnePageAuditSchema.parse(params)).toThrow();
    });

    it('rejects negative pageId', () => {
        const params = { pageId: -1 };
        expect(() => removeOnePageAuditSchema.parse(params)).toThrow();
    });
});

describe('getOnePageAuditByCategoriesSchema', () => {
    it('validates correct parameters', () => {
        const params: GetOnePageAuditByCategoriesParams = {
            reportId: TEST_REPORT_ID
        };
        expect(() => getOnePageAuditByCategoriesSchema.parse(params)).not.toThrow();
    });

    it('validates with compareReportId', () => {
        const params: GetOnePageAuditByCategoriesParams = {
            reportId: TEST_REPORT_ID,
            compareReportId: TEST_REPORT_ID + 1
        };
        expect(() => getOnePageAuditByCategoriesSchema.parse(params)).not.toThrow();
    });

    it('rejects missing reportId', () => {
        const params = {};
        expect(() => getOnePageAuditByCategoriesSchema.parse(params)).toThrow();
    });
});

describe('getOnePageAuditErrorRowsSchema', () => {
    it('validates correct parameters', () => {
        const params: GetOnePageAuditErrorRowsParams = {
            reportId: TEST_REPORT_ID,
            error: TEST_ERROR_NAME
        };
        expect(() => getOnePageAuditErrorRowsSchema.parse(params)).not.toThrow();
    });

    it('validates with all optional parameters', () => {
        const params: GetOnePageAuditErrorRowsParams = {
            reportId: TEST_REPORT_ID,
            error: TEST_ERROR_NAME,
            compareReportId: TEST_REPORT_ID + 1,
            mode: 'new',
            page: 1,
            size: 10
        };
        expect(() => getOnePageAuditErrorRowsSchema.parse(params)).not.toThrow();
    });

    it('rejects invalid error name', () => {
        const params = {
            reportId: TEST_REPORT_ID,
            error: 'invalid_error_name'
        };
        expect(() => getOnePageAuditErrorRowsSchema.parse(params)).toThrow();
    });
});

describe('getOnePageAuditPageNamesSchema', () => {
    it('validates empty parameters', () => {
        const params: GetOnePageAuditPageNamesParams = {};
        expect(() => getOnePageAuditPageNamesSchema.parse(params)).not.toThrow();
    });

    it('validates with teamMemberId', () => {
        const params: GetOnePageAuditPageNamesParams = {
            teamMemberId: 2
        };
        expect(() => getOnePageAuditPageNamesSchema.parse(params)).not.toThrow();
    });

    it('rejects invalid teamMemberId type', () => {
        const params = { teamMemberId: 'invalid' };
        expect(() => getOnePageAuditPageNamesSchema.parse(params)).toThrow();
    });
});

describe('getOnePageAuditUserLogSchema', () => {
    it('validates empty parameters', () => {
        const params: GetOnePageAuditUserLogParams = {};
        expect(() => getOnePageAuditUserLogSchema.parse(params)).not.toThrow();
    });

    it('validates with all parameters', () => {
        const params: GetOnePageAuditUserLogParams = {
            reportId: TEST_REPORT_ID,
            pageSize: 100,
            page: 0
        };
        expect(() => getOnePageAuditUserLogSchema.parse(params)).not.toThrow();
    });

    it('rejects negative page number', () => {
        const params = {
            reportId: TEST_REPORT_ID,
            page: -1
        };
        expect(() => getOnePageAuditUserLogSchema.parse(params)).toThrow();
    });
});
