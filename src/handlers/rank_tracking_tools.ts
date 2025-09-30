import { BaseHandler } from './base.js';
import { RankTrackingService } from '../services/rank_tracking_service.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { getRtProjectsListSchema, getRtProjectStatusSchema, getRtProjectRegionsListSchema, getRtProjectKeywordSerpHistorySchema, getRtProjectUrlSerpHistorySchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import {
    MIN_PAGE,
    RT_ALLOWED_PAGE_SIZES,
    DEFAULT_RT_PAGE_SIZE,
    MIN_RT_PROJECT_ID,
    MIN_RT_REGION_ID,
    RT_SERP_HISTORY_SORT_TYPES,
    MAX_RT_KEYWORDS_FILTER
} from '../utils/constants.js';

export class GetRtProjectsListHandler extends BaseHandler {
    private rankTrackingService: RankTrackingService;

    constructor() {
        super();
        const config = loadConfig();
        this.rankTrackingService = new RankTrackingService(config);
    }

    getName(): string {
        return 'get_rt_projects_list';
    }

    getDescription(): string {
        return 'Get a list of rank tracker projects including project ID, name, domain, creation date, and tracking status. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                page: {
                    type: "number",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "Page number in the projects list"
                },
                pageSize: {
                    type: "number",
                    enum: RT_ALLOWED_PAGE_SIZES,
                    default: DEFAULT_RT_PAGE_SIZE,
                    description: `Number of results per page. Allowed values: ${RT_ALLOWED_PAGE_SIZES.join(', ')}`
                }
            },
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getRtProjectsListSchema.parse(call.arguments);
            const result = await this.rankTrackingService.getRtProjectsList(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetRtProjectStatusHandler extends BaseHandler {
    private rankTrackingService: RankTrackingService;

    constructor() {
        super();
        const config = loadConfig();
        this.rankTrackingService = new RankTrackingService(config);
    }

    getName(): string {
        return 'get_rt_project_status';
    }

    getDescription(): string {
        return 'Get the current status of position updates (parsing) for a rank tracker project and region. Use this to check if data is ready before requesting results. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                projectId: {
                    type: "number",
                    minimum: MIN_RT_PROJECT_ID,
                    description: "Project identifier"
                },
                regionId: {
                    type: "number",
                    minimum: MIN_RT_REGION_ID,
                    description: "Search region ID (see https://docs.google.com/spreadsheets/d/1LUDtm-L1qWMVpmWuN-nvDyYFfQtfiXUh5LIHE8sjs0k/edit?gid=75443986#gid=75443986)"
                }
            },
            required: ["projectId", "regionId"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getRtProjectStatusSchema.parse(call.arguments);
            const result = await this.rankTrackingService.getRtProjectStatus(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetRtProjectRegionsListHandler extends BaseHandler {
    private rankTrackingService: RankTrackingService;

    constructor() {
        super();
        const config = loadConfig();
        this.rankTrackingService = new RankTrackingService(config);
    }

    getName(): string {
        return 'get_rt_project_regions_list';
    }

    getDescription(): string {
        return 'Get the list of regions configured for a rank tracker project, including region ID, status (active/inactive), SERP type (organic/paid), device type (desktop/mobile), search engine, and location details. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                projectId: {
                    type: "number",
                    minimum: MIN_RT_PROJECT_ID,
                    description: "Project identifier"
                }
            },
            required: ["projectId"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getRtProjectRegionsListSchema.parse(call.arguments);
            const result = await this.rankTrackingService.getRtProjectRegionsList(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetRtProjectKeywordSerpHistoryHandler extends BaseHandler {
    private rankTrackingService: RankTrackingService;

    constructor() {
        super();
        const config = loadConfig();
        this.rankTrackingService = new RankTrackingService(config);
    }

    getName(): string {
        return 'get_rt_project_keyword_serp_history';
    }

    getDescription(): string {
        return 'Get complete Google top-100 SERP history for tracked keywords in a rank tracker project. Returns full competitor analysis with historical positions, URLs, domains, and search volumes for each date. WARNING: This method returns large datasets (full top-100 for each keyword/date combination). Recommended pageSize: 20-50 for most use cases. Use date filters and keyword filters to reduce response size. Supports keyword tagging for grouping and filtering. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                projectId: {
                    type: "number",
                    minimum: MIN_RT_PROJECT_ID,
                    description: "Project identifier"
                },
                projectRegionId: {
                    type: "number",
                    minimum: MIN_RT_REGION_ID,
                    description: "Region ID for the project. Required. Get from get_rt_project_regions_list method. Each project can track multiple regions. See region reference: https://docs.google.com/spreadsheets/d/1LUDtm-L1qWMVpmWuN-nvDyYFfQtfiXUh5LIHE8sjs0k/edit?gid=75443986#gid=75443986"
                },
                page: {
                    type: "number",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "Page number for pagination. Starts at 1."
                },
                pageSize: {
                    type: "number",
                    enum: RT_ALLOWED_PAGE_SIZES,
                    default: DEFAULT_RT_PAGE_SIZE,
                    description: `Number of keywords per page. Allowed values: ${RT_ALLOWED_PAGE_SIZES.join(', ')}. RECOMMENDED: Use 20 or 50 to avoid response truncation due to large dataset sizes. Each keyword returns full top-100 SERP for all dates.`
                },
                dateFrom: {
                    type: "string",
                    pattern: "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
                    description: "Start date of the period in YYYY-MM-DD format (e.g., '2025-09-01'). Use to filter historical data and reduce response size."
                },
                dateTo: {
                    type: "string",
                    pattern: "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
                    description: "End date of the period in YYYY-MM-DD format (e.g., '2025-09-30'). Use to filter historical data and reduce response size."
                },
                sort: {
                    type: "string",
                    enum: RT_SERP_HISTORY_SORT_TYPES,
                    description: "Sort results by 'keyword' (alphabetically) or 'date' (chronologically). Default is 'date'."
                },
                order: {
                    type: "string",
                    enum: ["asc", "desc"],
                    description: "Sorting order: 'asc' (oldest first) or 'desc' (newest first). Default is 'desc'."
                },
                keywords: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    maxItems: MAX_RT_KEYWORDS_FILTER,
                    description: `Filter by specific keywords (max ${MAX_RT_KEYWORDS_FILTER} keywords)`
                },
                withTags: {
                    type: "boolean",
                    default: false,
                    description: "Include keyword tags in the response. Tags are used to group and categorize keywords in the project. Set to true to receive tag IDs and values for each keyword."
                }
            },
            required: ["projectId", "projectRegionId", "page"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getRtProjectKeywordSerpHistorySchema.parse(call.arguments);
            const result = await this.rankTrackingService.getRtProjectKeywordSerpHistory(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetRtProjectUrlSerpHistoryHandler extends BaseHandler {
    private rankTrackingService: RankTrackingService;

    constructor() {
        super();
        const config = loadConfig();
        this.rankTrackingService = new RankTrackingService(config);
    }

    getName(): string {
        return 'get_rt_project_url_serp_history';
    }

    getDescription(): string {
        return 'Get ranking history showing only YOUR domain\'s positions across all tracked keywords. Unlike get_rt_project_keyword_serp_history (which shows full top-100), this method returns only positions where your specified domain/URL ranks. Perfect for tracking your own performance over time without competitor noise. Returns historical position data, search volumes, and optional keyword tags. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                projectId: {
                    type: "number",
                    minimum: MIN_RT_PROJECT_ID,
                    description: "Rank tracker project ID. Required. Get from get_rt_projects_list method."
                },
                projectRegionId: {
                    type: "number",
                    minimum: MIN_RT_REGION_ID,
                    description: "Region ID for the project. Required. Get from get_rt_project_regions_list method. Each project can track multiple regions. See region reference: https://docs.google.com/spreadsheets/d/1LUDtm-L1qWMVpmWuN-nvDyYFfQtfiXUh5LIHE8sjs0k/edit?gid=75443986#gid=75443986"
                },
                page: {
                    type: "number",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "Page number for pagination. Starts at 1."
                },
                pageSize: {
                    type: "number",
                    enum: RT_ALLOWED_PAGE_SIZES,
                    default: DEFAULT_RT_PAGE_SIZE,
                    description: "Number of keywords per page. Allowed values: 20, 50, 100, 500. Recommended: 100 for most use cases (response is much smaller than get_rt_project_keyword_serp_history since it only shows your domain's positions)."
                },
                dateFrom: {
                    type: "string",
                    pattern: "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
                    description: "Start date of the period in YYYY-MM-DD format (e.g., '2025-09-01'). Filters historical data to this date range."
                },
                dateTo: {
                    type: "string",
                    pattern: "^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$",
                    description: "End date of the period in YYYY-MM-DD format (e.g., '2025-09-30'). Filters historical data to this date range."
                },
                sort: {
                    type: "string",
                    enum: RT_SERP_HISTORY_SORT_TYPES,
                    description: "Sort results by 'keyword' (alphabetically) or 'date' (chronologically). Default is 'keyword'."
                },
                order: {
                    type: "string",
                    enum: ["asc", "desc"],
                    description: "Sorting order: 'asc' (oldest first) or 'desc' (newest first). Default is 'desc'."
                },
                keywords: {
                    type: "array",
                    items: {
                        type: "string"
                    },
                    maxItems: MAX_RT_KEYWORDS_FILTER,
                    description: "Filter results by specific keywords (max 1000 keywords). Returns only data for the specified keywords where your domain ranks."
                },
                withTags: {
                    type: "boolean",
                    default: false,
                    description: "Include keyword tags in the response. Tags are used to group and categorize keywords in the project. Set to true to receive tag IDs and values for each keyword."
                },
                domain: {
                    type: "string",
                    description: "Domain or URL to track. Accepts: 'domain.com' (tracks all URLs from this domain), 'subdomain.domain.com' (tracks specific subdomain), or full URL 'https://domain.com/page' (tracks specific page). Do NOT include protocol for domain-level tracking."
                }
            },
            required: ["projectId", "projectRegionId", "page"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getRtProjectUrlSerpHistorySchema.parse(call.arguments);
            const result = await this.rankTrackingService.getRtProjectUrlSerpHistory(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}