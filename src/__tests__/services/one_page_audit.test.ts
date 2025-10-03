import {
    StartOnePageAuditScanParams,
    startOnePageAuditScanSchema,
    GetOnePageAuditsListParams,
    getOnePageAuditsListSchema,
    GetOnePageReportsListParams,
    getOnePageReportsListSchema,
    GetOnePageAuditResultsParams,
    getOnePageAuditResultsSchema
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
