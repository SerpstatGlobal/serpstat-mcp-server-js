import { BaseHandler, ToolAnnotations } from './base.js';
import { OnePageAuditService } from '../services/one_page_audit.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import {
    startOnePageAuditScanSchema,
    getOnePageAuditsListSchema,
    getOnePageReportsListSchema,
    getOnePageAuditResultsSchema,
    rescanOnePageAuditSchema,
    stopOnePageAuditSchema,
    removeOnePageAuditSchema,
    getOnePageAuditByCategoriesSchema,
    getOnePageAuditErrorRowsSchema,
    getOnePageAuditPageNamesSchema,
    getOnePageAuditUserLogSchema
} from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import {
    SITE_AUDIT_USER_AGENT_IDS,
    DEFAULT_AUDIT_LIMIT,
    MIN_AUDIT_OFFSET,
    MIN_PAGE_ID,
    MIN_REPORT_ID,
    MIN_PAGE,
    MAX_PAGE_SIZE,
    SITE_AUDIT_ERROR_NAMES,
    SITE_AUDIT_ERROR_DISPLAY_MODES,
    DEFAULT_USER_LOG_PAGE_SIZE,
    DEFAULT_USER_LOG_PAGE
} from '../utils/constants.js';

export class StartOnePageAuditScanHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_start_scan';
    }

    getDescription(): string {
        return 'SCAN single webpage with JS rendering. USE WHEN: page audit, on-page SEO check. Returns: pageId, reportId. Track with page_audit_get_reports_for_page. **Cost: 10 credits.** Wait for progress=100 before results.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Start Page Audit Scan', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    minLength: 1,
                    description: 'Name of the audit project'
                },
                url: {
                    type: 'string',
                    format: 'uri',
                    description: 'Page URL to scan'
                },
                userAgent: {
                    type: 'integer',
                    enum: SITE_AUDIT_USER_AGENT_IDS,
                    description: 'User agent ID. Recommended: 0 (Chrome) for most use cases. Values: 0=Chrome, 1=Serpstat, 2=Google, 3=Yandex, 4=Firefox, 5=IE'
                },
                httpAuthLogin: {
                    type: 'string',
                    description: 'Login for Basic HTTP authentication (optional)'
                },
                httpAuthPass: {
                    type: 'string',
                    description: 'Password for Basic HTTP authentication (optional)'
                }
            },
            required: ['name', 'url', 'userAgent']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = startOnePageAuditScanSchema.parse(call.arguments);
            const result = await this.onePageAuditService.startScan(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageAuditsListHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_get_last_scans';
    }

    getDescription(): string {
        return '**STARTING POINT for page audits.** LIST all page audit projects. USE WHEN: finding pageId, listing audited pages. Returns: pageId (for other methods), url, name, status, lastActiveReport with SDO and counts. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'List Page Audits', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                limit: {
                    type: 'integer',
                    minimum: 1,
                    default: DEFAULT_AUDIT_LIMIT,
                    description: 'Number of items to return (optional, default 30)'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    default: MIN_AUDIT_OFFSET,
                    description: 'Offset for pagination (optional, default 0)'
                },
                teamMemberId: {
                    type: 'integer',
                    description: 'Filter by team member ID (optional)'
                }
            }
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageAuditsListSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getPagesList(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageReportsListHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_get_reports_for_page';
    }

    getDescription(): string {
        return 'GET audit report history for page. USE WHEN: tracking scan completion, viewing past results. Returns: reportId, date, status (1=in progress, 3=finalizing, 4=completed), SDO, error counts, progress. **TIP: sort by date for most recent.** Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Page Audit Reports', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                pageId: {
                    type: 'integer',
                    minimum: MIN_PAGE_ID,
                    description: 'Page ID to get reports for'
                },
                limit: {
                    type: 'integer',
                    minimum: 1,
                    description: 'Number of reports to return (optional)'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    description: 'Offset for pagination (optional)'
                }
            },
            required: ['pageId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageReportsListSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getReportsListByPage(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageAuditResultsHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_get_results_report';
    }

    getDescription(): string {
        return 'GET detailed page audit results. USE WHEN: analyzing page issues, reviewing errors after scan. Returns: categories (errors by type: meta_tags, headings, content, multimedia, pagespeed), page data, report (SDO, counts). Each error has: key, priority, counts, hasAdditionRows (if true, drill down with page_audit_report_drill_down). Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Page Audit Results', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                pageId: {
                    type: 'integer',
                    minimum: MIN_PAGE_ID,
                    description: 'Page ID to get audit results for. Use pageId from page_audit_get_last_scans or page_audit_start_scan response.'
                }
            },
            required: ['pageId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageAuditResultsSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getPageAudit(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class RescanOnePageAuditHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_rescan';
    }

    getDescription(): string {
        return 'RESCAN existing page audit. USE WHEN: re-checking after fixes. Returns: reportId. Track with page_audit_get_reports_for_page. **Cost: 10 credits.**';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Rescan Page Audit', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                pageId: {
                    type: 'integer',
                    minimum: MIN_PAGE_ID,
                    description: 'Page ID to rescan'
                },
                name: {
                    type: 'string',
                    minLength: 1,
                    description: 'Project name (can update if needed)'
                },
                userAgent: {
                    type: 'integer',
                    enum: SITE_AUDIT_USER_AGENT_IDS,
                    description: 'User agent ID. Recommended: 0 (Chrome) for most use cases. Values: 0=Chrome, 1=Serpstat, 2=Google, 3=Yandex, 4=Firefox, 5=IE'
                },
                httpAuthLogin: {
                    type: 'string',
                    description: 'Login for Basic HTTP authentication (optional)'
                },
                httpAuthPass: {
                    type: 'string',
                    description: 'Password for Basic HTTP authentication (optional)'
                }
            },
            required: ['pageId', 'name', 'userAgent']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = rescanOnePageAuditSchema.parse(call.arguments);
            const result = await this.onePageAuditService.rescan(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class StopOnePageAuditHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_stop';
    }

    getDescription(): string {
        return 'STOP active page audit scan. USE WHEN: canceling scan. Returns: success boolean.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Stop Page Audit', readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                pageId: {
                    type: 'integer',
                    minimum: MIN_PAGE_ID,
                    description: 'Page ID to stop scanning'
                }
            },
            required: ['pageId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = stopOnePageAuditSchema.parse(call.arguments);
            const result = await this.onePageAuditService.stop(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class RemoveOnePageAuditHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_delete';
    }

    getDescription(): string {
        return 'DELETE page audit project. USE WHEN: removing audit project. Returns: success boolean.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Delete Page Audit', readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                pageId: {
                    type: 'integer',
                    minimum: MIN_PAGE_ID,
                    description: 'Page ID to remove'
                }
            },
            required: ['pageId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = removeOnePageAuditSchema.parse(call.arguments);
            const result = await this.onePageAuditService.remove(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageAuditByCategoriesHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_get_report_by_categories';
    }

    getDescription(): string {
        return 'GET audit results by categories for report. USE WHEN: category-level analysis, comparing reports. Returns: categories with errors by type, page data. Use compareReportId for countNew/countFixed vs previous report. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Audit by Categories', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Report ID to get audit results for'
                },
                compareReportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Report ID to compare with (optional). When provided, countNew and countFixed will show differences between the two reports.'
                }
            },
            required: ['reportId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageAuditByCategoriesSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getAuditByCategories(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageAuditErrorRowsHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_report_drill_down';
    }

    getDescription(): string {
        return 'GET problematic elements for specific error. **ONLY works if hasAdditionRows=true** from page_audit_get_results_report. USE WHEN: drilling into error details. Returns error for hasAdditionRows=false. Response varies: multimedia errors -> image URL array; page-level errors -> page URL array. **Check hasAdditionRows flag first.** Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Drill Down Error Details', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Report ID to get error details for'
                },
                error: {
                    type: 'string',
                    enum: SITE_AUDIT_ERROR_NAMES,
                    description: 'Error type key to get details for. Must match error.key value from page_audit_get_results_report response (e.g., image_no_alt, broken_image_url, large_image_size). Only works for errors where hasAdditionRows=true.'
                },
                mode: {
                    type: 'string',
                    enum: SITE_AUDIT_ERROR_DISPLAY_MODES,
                    description: 'Filter mode: all (all errors), new (errors added since compareReportId), solved (errors fixed since compareReportId). Optional, default is all.'
                },
                compareReportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Report ID to compare with for new/solved filtering (optional, required when mode is new or solved)'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    description: 'Page number for pagination (optional)'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    description: 'Number of results per page (optional, max 1000)'
                }
            },
            required: ['reportId', 'error']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageAuditErrorRowsSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getErrorRows(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageAuditPageNamesHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_get_scan_names';
    }

    getDescription(): string {
        return 'LIST page audit project names. USE WHEN: discovering projects. Returns: pageId, name, url, finishedReportCount. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Page Audit Names', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                teamMemberId: {
                    type: 'integer',
                    description: 'Filter by team member ID (optional)'
                }
            }
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageAuditPageNamesSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getPageNames(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetOnePageAuditUserLogHandler extends BaseHandler {
    private onePageAuditService: OnePageAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.onePageAuditService = new OnePageAuditService(config);
    }

    getName(): string {
        return 'page_audit_scan_logs';
    }

    getDescription(): string {
        return 'GET scan event logs. USE WHEN: debugging scan issues, tracking progress. Returns: log items with message (audit_finish, crawl_start, etc), type (info/warning/error), params, timestamp. Supports pagination. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Scan Logs', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Report ID to get logs for (required). If not specified, returns logs for all scans.'
                },
                page: {
                    type: 'integer',
                    minimum: 0,
                    default: DEFAULT_USER_LOG_PAGE,
                    description: 'Page number for pagination (optional, default 0, starts from 0)'
                },
                pageSize: {
                    type: 'integer',
                    minimum: 1,
                    default: DEFAULT_USER_LOG_PAGE_SIZE,
                    description: 'Number of log items per page (optional, default 100)'
                }
            }
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getOnePageAuditUserLogSchema.parse(call.arguments);
            const result = await this.onePageAuditService.getUserLog(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}
