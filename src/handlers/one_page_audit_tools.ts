import { BaseHandler } from './base.js';
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
        return 'Scan a single webpage with JavaScript rendering. Returns pageId and reportId for tracking. Use page_audit_get_reports_for_page to check progress via status and progress fields. API COST: 10 credits per scan. Wait for progress=100 before retrieving results with page_audit_get_results_report.';
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
        return 'Get list of all one-page audit projects. Returns page info including: pageId (use with other methods), url, name, status, lastActiveReport (latest scan results with SDO score and issue counts), finishedReportCount, settings. Use this as starting point to find pageId for other operations. Does not consume API credits.';
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
        return 'Get history of all audit reports for a specific page. Returns array of reports with: id (reportId), auditDate, status, sdo (0-100 score), high/medium/low/information error counts, viruses, progress (0-100). Use this to track scan completion and view historical results. Status values: 1=in progress, 3=finalizing, 4=completed. Sort by auditDate to get most recent first. Does not consume API credits.';
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
        return 'Get detailed audit results for a page. Returns: categories array (errors grouped by category like meta_tags, headings, content, multimedia, https, pagespeed_desktop, pagespeed_mobile, etc), data array (page details), report object (SDO score, error counts, progress). Each category contains errors with: key (error identifier), priority (high/medium/low/information), countAll/countNew/countFixed, hasAdditionRows (true means drill-down available via page_audit_report_drill_down). Use this to analyze specific issues found during scan. Does not consume API credits.';
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
        return 'Rescan existing one-page audit project. Creates new audit report for the page. Returns reportId for the new scan. API COST: 10 credits per rescan. Use page_audit_get_reports_for_page to track progress.';
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
        return 'Stop active one-page audit scan. Returns boolean indicating success. Does not consume API credits.';
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
        return 'Remove one-page audit project from customer project list. Returns boolean indicating success. Does not consume API credits.';
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
        return 'Get audit results by categories for a specific report. Returns categories array with errors grouped by type (meta_tags, headings, content, multimedia, https, etc), page data, and report info. Use compareReportId to see changes between reports (countNew shows errors added since compareReportId, countFixed shows errors resolved since compareReportId). Does not consume API credits.';
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
        return 'Get detailed list of problematic elements for specific error types. ONLY works for errors with hasAdditionRows=true from page_audit_get_results_report response. Returns error \'Try get additional rows in rows-less error\' for page-level errors where hasAdditionRows=false. Response structure varies by error type: for multimedia errors (image_no_alt, large_image_size, broken_image_url) returns array of image URLs that have the issue; for page-level errors (miss_favicon, etc) returns array with single object containing page URL. Always check hasAdditionRows flag before calling this method. Does not consume API credits.';
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
        return 'Get list of all one-page audit project names. Returns array of pages with: pageId, name, url, finishedReportCount. Use this to discover available audit projects. Does not consume API credits.';
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
        return 'Get chronological log of scan events for debugging and progress tracking. Returns array of log items with: message (event name like audit_finish, crawl_start, server_check_robots_pass), type (info/warning/error), params (object with event-specific data, may be empty array if no additional info, e.g., {sdo: 64} or []), created_at (timestamp). Useful for debugging scan issues and understanding scan progress. Supports pagination via page and pageSize parameters. Does not consume API credits.';
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
