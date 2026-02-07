import { BaseHandler, ToolAnnotations } from './base.js';
import { SiteAuditService } from '../services/site_audit.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import {
    getSiteAuditSettingsSchema,
    setSiteAuditSettingsSchema,
    startSiteAuditSchema,
    stopSiteAuditSchema,
    getCategoriesStatisticSchema,
    getHistoryByCountErrorSchema,
    getSiteAuditsListSchema,
    getScanUserUrlListSchema,
    getDefaultSettingsSchema,
    getBasicInfoSchema,
    getReportWithoutDetailsSchema,
    getErrorElementsSchema,
    getSubElementsByCrcSchema
} from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import {
    SITE_AUDIT_USER_AGENT_IDS,
    SITE_AUDIT_SCHEDULE_REPEAT_IDS,
    SITE_AUDIT_INTERVAL_IDS,
    SITE_AUDIT_SCAN_TYPES,
    MIN_SCAN_SPEED,
    MAX_SCAN_SPEED,
    MIN_SCAN_DURATION,
    MIN_FOLDER_DEPTH,
    MIN_URL_DEPTH,
    MIN_PAGES_LIMIT,
    MIN_TITLE_LENGTH,
    MIN_DESC_LENGTH,
    MIN_URL_LENGTH,
    MIN_IMAGE_SIZE,
    MIN_PAGE_SIZE,
    MIN_EXTERNAL_LINKS,
    MIN_PROJECT_ID,
    MIN_DOMAIN_LENGTH,
    MAX_DOMAIN_LENGTH,
    DEFAULT_AUDIT_LIMIT,
    MIN_AUDIT_OFFSET,
    MIN_REPORT_ID,
    SITE_AUDIT_ERROR_NAMES,
    SITE_AUDIT_ERROR_DISPLAY_MODES,
    DEFAULT_ERROR_ELEMENTS_LIMIT,
} from '../utils/constants.js';

export class GetSiteAuditSettingsHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_settings';
    }

    getDescription(): string {
        return 'GET current settings of EXISTING audit project. USE WHEN: reviewing project config, before modifying settings. Returns: mainSettings, scan filters, auth, notifications, scheduling, error thresholds. Compare with get_site_audit_project_default_settings (template for NEW projects). Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Audit Project Settings', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to get settings for'
                }
            },
            required: ['projectId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getSiteAuditSettingsSchema.parse(call.arguments);
            const result = await this.siteAuditService.getSettings(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class SetSiteAuditSettingsHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'set_site_audit_settings';
    }

    getDescription(): string {
        return 'UPDATE audit project configuration. USE WHEN: creating or modifying audit project. Get template from get_site_audit_project_default_settings first, modify, save with this method. Required: mainSettings, scanSetting (1=all site, 2=URL list, 3=sitemap), scheduleSettings, mailTriggerSettings, baseAuthBlock, keyword filters. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Update Audit Settings', readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to update settings for'
                },
                mainSettings: {
                    type: 'object',
                    properties: {
                        domain: {
                            type: 'string',
                            minLength: MIN_DOMAIN_LENGTH,
                            maxLength: MAX_DOMAIN_LENGTH,
                            description: 'Project domain'
                        },
                        name: {
                            type: 'string',
                            minLength: MIN_DOMAIN_LENGTH,
                            description: 'Project name'
                        },
                        subdomainsCheck: {
                            type: 'boolean',
                            description: 'Check domain with subdomains'
                        },
                        pagesLimit: {
                            type: 'integer',
                            minimum: MIN_PAGES_LIMIT,
                            description: 'Scan pages limit'
                        },
                        scanSpeed: {
                            type: 'integer',
                            minimum: MIN_SCAN_SPEED,
                            maximum: MAX_SCAN_SPEED,
                            description: 'Scan speed (1-30, every increment of 3 adds one thread)'
                        },
                        autoSpeed: {
                            type: 'boolean',
                            description: 'Auto speed control'
                        },
                        scanNoIndex: {
                            type: 'boolean',
                            description: 'Scan NoIndex pages'
                        },
                        autoUserAgent: {
                            type: 'boolean',
                            description: 'Automatic change of user agent'
                        },
                        scanWrongCanonical: {
                            type: 'boolean',
                            description: 'Scan wrong Canonical pages'
                        },
                        scanDuration: {
                            type: 'integer',
                            minimum: MIN_SCAN_DURATION,
                            description: 'Scan duration in hours'
                        },
                        folderDepth: {
                            type: 'integer',
                            minimum: MIN_FOLDER_DEPTH,
                            description: 'Maximum folders in URL path'
                        },
                        urlDepth: {
                            type: 'integer',
                            minimum: MIN_URL_DEPTH,
                            description: 'Maximum clicks from main page'
                        },
                        userAgent: {
                            type: 'integer',
                            enum: SITE_AUDIT_USER_AGENT_IDS,
                            description: 'User agent ID (0=Chrome, 1=Serpstat, 2=Google, 3=Yandex, 4=Firefox, 5=IE)'
                        },
                        robotsTxt: {
                            type: 'boolean',
                            description: 'Verify robots.txt compliance'
                        },
                        withImages: {
                            type: 'boolean',
                            description: 'Scan images'
                        }
                    },
                    required: ['domain', 'name', 'subdomainsCheck', 'pagesLimit', 'scanSpeed', 'autoSpeed', 'scanNoIndex', 'autoUserAgent', 'scanWrongCanonical', 'scanDuration', 'folderDepth', 'urlDepth', 'userAgent', 'robotsTxt', 'withImages']
                },
                dontScanKeywordsBlock: {
                    type: 'object',
                    properties: {
                        checked: { type: 'boolean', description: 'Apply exclusion rule' },
                        keywords: { type: 'string', description: 'Keywords to exclude (comma-separated)' }
                    },
                    required: ['checked', 'keywords'],
                    description: 'Exclude pages with these keywords in URL'
                },
                onlyScanKeywordsBlock: {
                    type: 'object',
                    properties: {
                        checked: { type: 'boolean', description: 'Apply inclusion rule' },
                        keywords: { type: 'string', description: 'Keywords to include (comma-separated)' }
                    },
                    required: ['checked', 'keywords'],
                    description: 'Only scan pages with these keywords in URL'
                },
                baseAuthBlock: {
                    type: 'object',
                    properties: {
                        login: { type: 'string', description: 'HTTP Basic auth login' },
                        password: { type: 'string', description: 'HTTP Basic auth password' }
                    },
                    required: ['login', 'password'],
                    description: 'HTTP Basic authentication credentials'
                },
                mailTriggerSettings: {
                    type: 'object',
                    properties: {
                        emails: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Email addresses for notifications'
                        },
                        interval: {
                            type: 'integer',
                            enum: SITE_AUDIT_INTERVAL_IDS,
                            description: 'Notification interval (0=manual, 1=daily, 2=every 3 days, 3=weekly, 4=every 2 weeks, 5=monthly)'
                        },
                        enabled: { type: 'boolean', description: 'Enable email notifications' }
                    },
                    required: ['emails', 'interval', 'enabled'],
                    description: 'Email notification settings'
                },
                scheduleSettings: {
                    type: 'object',
                    properties: {
                        scheduleRepeatOption: {
                            type: 'integer',
                            enum: SITE_AUDIT_SCHEDULE_REPEAT_IDS,
                            description: 'Scan schedule (0=manual, 1=daily, 2=every 3 days, 3=weekly, 4=every 2 weeks, 5=monthly)'
                        }
                    },
                    required: ['scheduleRepeatOption'],
                    description: 'Scan scheduling settings'
                },
                scanSetting: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'integer',
                            enum: SITE_AUDIT_SCAN_TYPES,
                            description: 'Scan type (1=all site, 2=URL list, 3=sitemap list)'
                        },
                        list: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'URLs to scan (for types 2 and 3)'
                        },
                        importedFilename: {
                            type: 'string',
                            description: 'Imported filename (optional)'
                        }
                    },
                    required: ['type', 'list'],
                    description: 'Scan type and URL list settings'
                },
                errorsSettings: {
                    type: 'object',
                    properties: {
                        tiny_title: { type: 'integer', minimum: MIN_TITLE_LENGTH, description: 'Min title length' },
                        long_title: { type: 'integer', minimum: MIN_TITLE_LENGTH, description: 'Max title length' },
                        tiny_desc: { type: 'integer', minimum: MIN_DESC_LENGTH, description: 'Min description length' },
                        long_desc: { type: 'integer', minimum: MIN_DESC_LENGTH, description: 'Max description length' },
                        long_url: { type: 'integer', minimum: MIN_URL_LENGTH, description: 'Max URL length' },
                        large_image_size: { type: 'integer', minimum: MIN_IMAGE_SIZE, description: 'Max image size (KB)' },
                        large_page_size: { type: 'integer', minimum: MIN_PAGE_SIZE, description: 'Max page size (MB)' },
                        many_external_links: { type: 'integer', minimum: MIN_EXTERNAL_LINKS, description: 'Max external links' }
                    },
                    description: 'Error detection thresholds (optional)'
                }
            },
            required: ['projectId', 'mainSettings', 'dontScanKeywordsBlock', 'onlyScanKeywordsBlock', 'baseAuthBlock', 'mailTriggerSettings', 'scheduleSettings', 'scanSetting']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = setSiteAuditSettingsSchema.parse(call.arguments);
            const result = await this.siteAuditService.setSettings(params);
            return this.createSuccessResponse({ success: true, result });
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class StartSiteAuditHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'start_site_audit';
    }

    getDescription(): string {
        return 'START audit scan for project. USE WHEN: launching site crawl. Returns: reportId. Check progress with get_site_audits_list (progress field). **Cost: 1 credit/page (10 credits/page with JS rendering).** Wait for progress=100 before analyzing.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Start Site Audit', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to start audit for'
                }
            },
            required: ['projectId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = startSiteAuditSchema.parse(call.arguments);
            const result = await this.siteAuditService.start(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class StopSiteAuditHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'stop_site_audit';
    }

    getDescription(): string {
        return 'STOP active audit scan. USE WHEN: canceling crawl. Partial results may be available. Check get_site_audits_list for stopped status.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Stop Site Audit', readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to stop audit for'
                }
            },
            required: ['projectId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = stopSiteAuditSchema.parse(call.arguments);
            const result = await this.siteAuditService.stop(params);
            return this.createSuccessResponse({ success: result });
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetCategoriesStatisticHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_results_by_categories';
    }

    getDescription(): string {
        return 'GET aggregated error stats by category. USE WHEN: quick audit overview, identifying problem areas. Returns: error counts per category (highCount, mediumCount, lowCount, informationCount). Categories: pages_status, meta_tags, headings, content, multimedia, indexation, redirects, links, server_params, https, hreflang, amp, markup, pagespeed. For error details use get_site_audit_deteailed_report. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Audit Results by Categories', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Audit report ID to get statistics for'
                }
            },
            required: ['reportId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getCategoriesStatisticSchema.parse(call.arguments);
            const result = await this.siteAuditService.getCategoriesStatistic(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetHistoryByCountErrorHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_history';
    }

    getDescription(): string {
        return 'TRACK specific error type trend over time. USE WHEN: verifying fixes, monitoring error growth. Returns: reportId, date, count per audit. errorName must match error.key from get_site_audit_deteailed_report (e.g., \'no_desc\'). Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Audit Error History', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to get error history for'
                },
                errorName: {
                    type: 'string',
                    enum: SITE_AUDIT_ERROR_NAMES,
                    description: 'Error type name (e.g., h1_missing, no_desc, long_title)'
                },
                limit: {
                    type: 'integer',
                    minimum: 1,
                    default: DEFAULT_AUDIT_LIMIT,
                    description: 'Number of history items to return'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    default: MIN_AUDIT_OFFSET,
                    description: 'Offset for pagination'
                }
            },
            required: ['projectId', 'errorName']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getHistoryByCountErrorSchema.parse(call.arguments);
            const result = await this.siteAuditService.getHistoryByCountError(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetSiteAuditsListHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audits_list';
    }

    getDescription(): string {
        return '**STARTING POINT for audit analysis.** LIST all audit reports for project. USE WHEN: finding reportId, checking audit status. Returns: reportId (for other methods), date, SDO score (0-100), pages scanned, issue counts, progress (0-100), hasDetailData flag. **TIP: sort by date for most recent.** Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'List Audit Reports', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to get audits list for'
                },
                limit: {
                    type: 'integer',
                    minimum: 1,
                    default: DEFAULT_AUDIT_LIMIT,
                    description: 'Number of audits to return'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    default: MIN_AUDIT_OFFSET,
                    description: 'Offset for pagination'
                }
            },
            required: ['projectId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getSiteAuditsListSchema.parse(call.arguments);
            const result = await this.siteAuditService.getSiteAuditsList(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetScanUserUrlListHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_scanned_urls_list';
    }

    getDescription(): string {
        return 'GET configured URL list for scanning (input config, not scan results). **ONLY works when scanSetting.type is 2 (URL list) or 3 (sitemap list).** Returns error for type=1 (scan all site). USE WHEN: checking scan URL configuration. For actual scanned page count use get_site_audits_list. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Scanned URLs List', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'Project ID to get scanned URLs list for'
                }
            },
            required: ['projectId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getScanUserUrlListSchema.parse(call.arguments);
            const result = await this.siteAuditService.getScanUserUrlList(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetDefaultSettingsHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_project_default_settings';
    }

    getDescription(): string {
        return 'GET default template for NEW audit projects (not existing project settings). USE WHEN: creating new project, populating defaults. Workflow: 1) Call this, 2) Modify (set domain, name, limits), 3) Save with set_site_audit_settings. Defaults: pagesLimit=5000, scheduleRepeatOption=3 (weekly). No projectId required. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Default Audit Settings', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {},
            required: []
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getDefaultSettingsSchema.parse(call.arguments);
            const result = await this.siteAuditService.getDefaultSettings(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetBasicInfoHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_bref_info';
    }

    getDescription(): string {
        return 'GET quick audit summary (lightweight). USE WHEN: dashboard display, quick status check. Returns: SDO score (0-100), error counts by priority, pages scanned, progress, stopped/captcha flags. For details use get_site_audit_results_by_categories or get_site_audit_deteailed_report. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Audit Brief Info', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'The unique identifier for an audit report'
                }
            },
            required: ['reportId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getBasicInfoSchema.parse(call.arguments);
            const result = await this.siteAuditService.getBasicInfo(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetReportWithoutDetailsHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_deteailed_report';
    }

    getDescription(): string {
        return 'GET complete error breakdown by categories. **Main method for detailed analysis.** USE WHEN: full audit review, error analysis. Returns: categories with errors (key, priority, countAll, countNew, countFixed). Use compareReportId for diff between audits. Use error.key with get_site_audit_history or get_site_audit_pages_spec_errors for drill-down. Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Detailed Audit Report', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'The unique identifier for an audit report'
                },
                compareReportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Another unique identifier for an audit report from the same project to compare'
                }
            },
            required: ['reportId']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getReportWithoutDetailsSchema.parse(call.arguments);
            const result = await this.siteAuditService.getReportWithoutDetails(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetErrorElementsHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_pages_spec_errors';
    }

    getDescription(): string {
        return '**DRILL-DOWN STEP 1:** GET pages/elements with specific error. USE WHEN: finding affected pages for an error. Returns: url, urlCrc/imageCrc (for step 2), count. Use CRC with get_site_audit_elements_with_issues for deeper analysis. Mode: \'all\'|\'new\'|\'solved\' (vs compareReportId). Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Pages with Specific Errors', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'The unique identifier for an audit report'
                },
                compareReportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Another unique identifier for an audit report from the same project to compare'
                },
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'The unique identifier for an audit site project'
                },
                errorName: {
                    type: 'string',
                    description: 'Error name to filter by'
                },
                mode: {
                    type: 'string',
                    enum: [...SITE_AUDIT_ERROR_DISPLAY_MODES],
                    default: 'all',
                    description: 'Error display mode: all (all errors), new (new errors), solved (fixed errors)'
                },
                limit: {
                    type: 'integer',
                    minimum: 1,
                    default: DEFAULT_ERROR_ELEMENTS_LIMIT,
                    description: 'Count of returned items in response'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    default: MIN_AUDIT_OFFSET,
                    description: 'Batch number required for pagination'
                }
            },
            required: ['reportId', 'compareReportId', 'projectId', 'errorName']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getErrorElementsSchema.parse(call.arguments);
            const result = await this.siteAuditService.getErrorElements(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetSubElementsByCrcHandler extends BaseHandler {
    private siteAuditService: SiteAuditService;

    constructor() {
        super();
        const config = loadConfig();
        this.siteAuditService = new SiteAuditService(config);
    }

    getName(): string {
        return 'get_site_audit_elements_with_issues';
    }

    getDescription(): string {
        return '**DRILL-DOWN STEP 2:** Shows WHERE problematic element is used. USE WHEN: tracing error to pages. Use crc from get_site_audit_pages_spec_errors. **ONLY for hierarchical errors (images, scripts, links).** Returns \'Error don\'t have sub elements\' for page-level errors (no_desc, h1_missing). Free.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Elements with Issues', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                reportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'The unique identifier for an audit report'
                },
                compareReportId: {
                    type: 'integer',
                    minimum: MIN_REPORT_ID,
                    description: 'Another unique identifier for an audit report from the same project to compare'
                },
                projectId: {
                    type: 'integer',
                    minimum: MIN_PROJECT_ID,
                    description: 'The unique identifier for an audit site project'
                },
                errorName: {
                    type: 'string',
                    description: 'Error name to filter by'
                },
                mode: {
                    type: 'string',
                    enum: [...SITE_AUDIT_ERROR_DISPLAY_MODES],
                    default: 'all',
                    description: 'Error display mode: all (all errors), new (new errors), solved (fixed errors)'
                },
                limit: {
                    type: 'integer',
                    minimum: 1,
                    default: DEFAULT_AUDIT_LIMIT,
                    description: 'Count of returned items in response'
                },
                offset: {
                    type: 'integer',
                    minimum: MIN_AUDIT_OFFSET,
                    default: MIN_AUDIT_OFFSET,
                    description: 'Batch number required for pagination'
                },
                crc: {
                    type: 'integer',
                    description: 'URL CRC from get_site_audit_pages_spec_errors response'
                }
            },
            required: ['reportId', 'projectId', 'errorName', 'crc']
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getSubElementsByCrcSchema.parse(call.arguments);
            const result = await this.siteAuditService.getSubElementsByCrc(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            return this.createErrorResponse(error as Error);
        }
    }
}
