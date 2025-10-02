import { BaseHandler } from './base.js';
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
        return 'Get current configuration of EXISTING audit project. Returns: mainSettings (domain, name, pagesLimit, scanSpeed, scanDuration, userAgent, robotsTxt, etc), scan filters (keywords to include/exclude), authentication, email notifications, scheduling, error thresholds. Compare with get_site_audit_project_default_settings which returns template for NEW projects. Does not consume API credits.';
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
        return 'Update or create audit project configuration. Use get_site_audit_project_default_settings to get template, then modify and save with this method. Required fields: mainSettings (domain, name, subdomainsCheck, pagesLimit, scanSpeed, etc), scanSetting (type: 1=all site, 2=URL list, 3=sitemap), scheduleSettings, mailTriggerSettings, baseAuthBlock, keyword filters. Does not consume API credits.';
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
        return 'Launch audit scan for a project. Returns reportId to track progress. Check completion with get_site_audits_list (progress field). API COST: 1 credit per page without JS rendering, 10 credits per page with JS rendering (scanJsPage setting). Wait for progress=100 before analyzing results.';
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
        return 'Stop active audit scan for a project. Partial results may be available. Check get_site_audits_list to see if audit was stopped (stoped field).';
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
        return 'Get AGGREGATED error statistics by category. Returns sum of errors grouped by priority for each category. Each category shows: highCount, mediumCount, lowCount, informationCount. Use this for quick overview to identify problematic categories. Categories are fixed: pages_status, meta_tags, headings, content, multimedia, indexation, redirects, links, server_params, https, hreflang, amp, markup, pagespeed_desktop, pagespeed_mobile. Does not consume API credits. For specific error breakdown use get_site_audit_deteailed_report.';
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
        return 'Track how a SPECIFIC error type changed over time across all audits in project. Returns array with reportId, date, and count for each audit. Use this to: verify if fixes are working (count should decrease), monitor if errors are growing, track specific problem areas. The errorName must be from the fixed enum list (same as error.key from get_site_audit_deteailed_report). Example: errorName=\'no_desc\' shows trend of pages without meta description. Does not consume API credits.';
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
        return 'STARTING POINT for audit analysis. Returns list of all audit reports for a project. Use reportId from response with other audit methods. Returns: reportId (use with other methods), date, SDO score (0-100), pages scanned/limit, critical/non-critical issue counts, viruses, progress (0-100), completion status, hasDetailData flag (true=full data available, false=in progress/failed). Does not consume API credits. TIP: Sort by date to get most recent audit first.';
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
        return 'Get CONFIGURED URL list for scanning (not actual scan results). ONLY works when scanSetting.type is 2 (URL list) or 3 (sitemap list). Returns error \'Scan url list not found\' when type=1 (scan all site) because no specific URLs are configured. This shows INPUT configuration, not OUTPUT of what was scanned. Check get_site_audits_list response for actual scanned page count. Does not consume API credits.';
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
        return 'Get DEFAULT TEMPLATE settings for creating new projects (NOT settings of existing project). Returns server-side recommended defaults. Use this to: populate new project form with sensible defaults, avoid hardcoding values, ensure settings stay current if Serpstat changes recommendations. Workflow: 1) Call this method, 2) Modify returned object (set domain, name, adjust limits), 3) Call set_site_audit_settings to save. Key differences from project settings: domain=\'\' (must set), name=\'\' (must set), pagesLimit=5000 (default), scheduleRepeatOption=3 (weekly). Does not consume API credits and does not require projectId.';
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
        return 'Get quick summary of a single audit for dashboard display. Returns: sdo (0-100 score), highCount/mediumCount/lowCount/informationCount (errors by priority), checkedPageCount (pages scanned), progress (0-100), stoped flag, captchaDetected flag, redirectCount. Lightweight method, does not consume API credits. For detailed analysis use get_site_audit_results_by_categories or get_site_audit_deteailed_report.';
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
        return 'Get COMPLETE error breakdown organized by categories. Main method for detailed audit analysis. Returns categories array, each with errors array containing: key (error identifier like \'no_desc\', \'h1_missing\'), priority (high/medium/low/information), countAll (total errors), countNew (new vs compareReportId), countFixed (fixed vs compareReportId). Use compareReportId parameter to track changes between audits. Use error.key with get_site_audit_history (track across all audits) or get_site_audit_pages_spec_errors (see affected pages). Does not consume API credits.';
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
        return 'DRILL-DOWN STEP 1: Get list of elements (pages/images) with specific error. Returns: url (problematic page or image URL), urlCrc/imageCrc (unique numeric ID for drill-down), count (occurrences). The CRC is used with get_site_audit_elements_with_issues for deeper analysis. Mode parameter: \'all\' (all errors), \'new\' (new vs compareReportId), \'solved\' (fixed vs compareReportId). Example flow: get pages with \'image_no_alt\' error → get imageCrc → use with get_site_audit_elements_with_issues to see which pages use that image. Does not consume API credits.';
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
        return 'DRILL-DOWN STEP 2: Shows WHERE a problematic element is used. Use crc from get_site_audit_pages_spec_errors response. ONLY works for hierarchical errors (images, scripts, links). Does NOT work for page-level errors (no_desc, no_title, h1_missing) - returns \'Error don\'t have sub elements\'. Example: Step 1 finds image without alt (imageCrc=12345), Step 2 shows which pages use that image. The crc parameter must match urlCrc/imageCrc from previous method. Does not consume API credits.';
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
