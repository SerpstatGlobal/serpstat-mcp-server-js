import { BaseHandler } from './base.js';
import { OnePageAuditService } from '../services/one_page_audit.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import {
    startOnePageAuditScanSchema,
    getOnePageAuditsListSchema,
    getOnePageReportsListSchema,
    getOnePageAuditResultsSchema
} from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import {
    SITE_AUDIT_USER_AGENT_IDS,
    DEFAULT_AUDIT_LIMIT,
    MIN_AUDIT_OFFSET,
    MIN_PAGE_ID
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
        return 'Scan a single webpage with JavaScript rendering. Returns pageId and reportId for tracking. Use page_audit_get_reports_for_page to check progress (status and progress fields). API COST: 10 credits per scan. Wait for progress=100 before retrieving results with page_audit_get_results_report.';
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
                    description: 'User agent ID (0=Chrome, 1=Serpstat, 2=Google, 3=Yandex, 4=Firefox, 5=IE)'
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
                    description: 'Number of items to return'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    default: MIN_AUDIT_OFFSET,
                    description: 'Offset for pagination'
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
        return 'Get history of all audit reports for a specific page. Returns array of reports with: id (reportId), auditDate, status, sdo (0-100 score), high/medium/low/information error counts, viruses, progress (0-100). Use this to track scan completion and view historical results. Sort by auditDate to get most recent first. Does not consume API credits.';
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
        return 'Get detailed audit results for a page. Returns: categories array (errors grouped by category like meta_tags, headings, content, etc.), data array (page details), report object (SDO score, error counts, progress). Each category contains errors with: key (error identifier), priority (high/medium/low/information), countAll/countNew/countFixed. Use this to analyze specific issues found during scan. Does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                pageId: {
                    type: 'integer',
                    minimum: MIN_PAGE_ID,
                    description: 'Page ID to get audit results for'
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
