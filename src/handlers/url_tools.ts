import { BaseHandler } from './base.js';
import { UrlService } from '../services/url_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { urlSummaryTrafficSchema, urlCompetitorsSchema, urlKeywordsSchema, urlMissingKeywordsSchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import {
    MAIN_SEARCH_ENGINES,
    SORT_ORDER,
    DEFAULT_PAGE_SIZE,
    MIN_PAGE,
    MAX_PAGE_SIZE,
    MIN_KEYWORD_LENGTH,
    MAX_KEYWORD_LENGTH,
    URL_OUTPUT_DATA_TYPES,
    KEYWORD_INTENTS,
    MIN_FILTER_VALUE,
    MAX_FILTER_COST,
    MAX_FILTER_DIFFICULTY,
    MIN_FILTER_CONCURRENCY,
    MAX_FILTER_CONCURRENCY,
    MIN_FILTER_POSITION,
    MAX_FILTER_POSITION,
    MAX_URL_CONTAIN_LENGTH, MIN_URL_CONTAIN_LENGTH,
} from '../utils/constants.js';

export class GetUrlSummaryTrafficHandler extends BaseHandler {
    private urlService: UrlService;

    constructor() {
        super();
        const config = loadConfig();
        this.urlService = new UrlService(config);
    }

    getName(): string {
        return 'get_url_summary_traff';
    }

    getDescription(): string {
        return 'Returns traffic and keyword statistics for website pages that match a specific URL mask. ' +
            'Shows organic traffic and number of keywords found for URLs matching the given pattern. **HIGH-COST METHOD - EXPLICIT CONFIRMATION REQUIRED**.  Before executing, inform the user:\n' +
            ' `This operation will cost 1000-2000 credits`. API COST: 1000 credits per each of `traffic`|`keywords` output parameter';
    }


    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: 'Search database ID'
                },
                domain: {
                    type: 'string',
                    description: 'The domain for which to retrieve traffic and keyword data'
                },
                urlContains: {
                    type: 'string',
                    minLength: MIN_URL_CONTAIN_LENGTH,
                    maxLength: MAX_URL_CONTAIN_LENGTH,
                    description: "URL pattern to filter results. Must be at least 3 characters long. Method finds all URLs containing this substring and aggregates statistics. Examples: '/blog/' matches all blog pages, '/products/' matches product section, '/en/' matches English version. Cannot use '/' alone.",
                },
                output_data: {
                    type: 'string',
                    enum: URL_OUTPUT_DATA_TYPES,
                    description: "Specify which data to return. 'traffic' returns only traffic estimates (1000 credits). 'keywords' returns only keyword counts (1000 credits). If not specified, returns both traffic and keywords (2000 credits). Specify this parameter unless both metrics are required."
                }
            },
            required: ['se', 'domain', 'urlContains'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = urlSummaryTrafficSchema.parse(call.arguments);
            const result = await this.urlService.getUrlSummaryTraffic(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetUrlCompetitorsHandler extends BaseHandler {
    private urlService: UrlService;

    constructor() {
        super();
        const config = loadConfig();
        this.urlService = new UrlService(config);
    }

    getName(): string {
        return 'get_url_competitors';
    }

    getDescription(): string {
        return 'Returns competitor URLs that rank for the same keywords in Google top-10. The analyzed URL must rank for 10+ keywords in top-10 to have competitor data available. Returns \'Data not found\' error for new or low-traffic pages with few ranking keywords, URLs not found in Serpstat database, or pages without sufficient top-10 keyword overlap with competitors. The URL parameter must include protocol https://. Best results for established pages with significant organic traffic. API cost: 1 credit per result row returned.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: 'Search database ID'
                },
                url: {
                    type: 'string',
                    format: 'uri',
                    description: "Full URL to analyze including protocol. Examples: 'https://example.com/' or 'https://example.com/page'. The URL must rank for keywords in Google top-10 to have competitor data. New or low-traffic pages may return 'Data not found' error."
                },
                sort: {
                    type: 'object',
                    properties: {
                        cnt: {
                            type: 'string',
                            enum: SORT_ORDER,
                            description: 'Sort by number of keywords in top 10 for which pages intersect'
                        }
                    },
                    additionalProperties: false,
                    description: 'Sorting parameters'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    default: 1,
                    description: 'Page number in response'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: 'Number of results per page'
                }
            },
            required: ['se', 'url'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = urlCompetitorsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.urlService.getUrlCompetitors(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetUrlKeywordsHandler extends BaseHandler {
    private urlService: UrlService;

    constructor() {
        super();
        const config = loadConfig();
        this.urlService = new UrlService(config);
    }

    getName(): string {
        return 'get_url_keywords';
    }

    getDescription(): string {
        return 'Returns a list of keywords for which the specified URL ranks in top-100 Google search results. Provides comprehensive insights including current positions, estimated traffic per keyword, keyword difficulty, search volume, and SERP features. Use filters to narrow down by position range, search volume, difficulty, or keyword patterns. API cost: 1 credit per result row returned.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: 'Search database ID'
                },
                url: {
                    type: 'string',
                    format: 'uri',
                    description: "Full URL to analyze including protocol (https://). Returns keywords where this exact URL ranks in Google top-100 (Bing top-50). Examples: 'https://example.com/', 'https://example.com/blog/article'",
                },
                withIntents: {
                    type: 'boolean',
                    description: "Include keyword search intent classification (informational, navigational, commercial, transactional). When enabled, response includes intents array for each keyword.",
                },
                sort: {
                    type: 'object',
                    properties: {
                        position: { type: 'string', enum: SORT_ORDER, description: 'Sort by position' },
                        difficulty: { type: 'string', enum: SORT_ORDER, description: 'Sort by keyword difficulty' },
                        cost: { type: 'string', enum: SORT_ORDER, description: 'Sort by cost per click' },
                        traff: { type: 'string', enum: SORT_ORDER, description: 'Sort by traffic' }
                    },
                    additionalProperties: false,
                    description: 'Sorting parameters'
                },
                filters: {
                    type: 'object',
                    properties: {
                        cost: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        cost_from: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        cost_to: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        position: { type: 'integer', minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        position_from: { type: 'integer', minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        position_to: { type: 'integer', minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        concurrency: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_from: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_to: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        keyword_length: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        difficulty: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_from: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_to: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        traff: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_from: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_to: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_from: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_to: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        url_contains: { type: 'string', description: 'Exact website pages ranking for keywords' },
                        right_spelling: { type: 'boolean', description: 'Display or hide misspelled keywords' },
                        keyword_contain: { type: 'string', description: 'Contains all keywords (exact matching)' },
                        keyword_not_contain: { type: 'string', description: 'Does not contain all keywords (exact matching)' },
                        keyword_contain_one_of: { type: 'string', description: 'Contains one of the keywords (exact matching)' },
                        keyword_not_contain_one_of: { type: 'string', description: 'Does not contain one of the keywords (exact matching)' },
                        intents_contain: { type: 'array', items: { type: 'string', enum: KEYWORD_INTENTS }, description: 'Contains one or several intents' },
                        intents_not_contain: { type: 'array', items: { type: 'string', enum: KEYWORD_INTENTS }, description: 'Does not contain one of the intents' }
                    },
                    additionalProperties: false,
                    description: 'Filter conditions'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    default: 1,
                    description: 'Page number in response'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: 'Number of results per page'
                }
            },
            required: ['se', 'url'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = urlKeywordsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.urlService.getUrlKeywords(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetUrlMissingKeywordsHandler extends BaseHandler {
    private urlService: UrlService;

    constructor() {
        super();
        const config = loadConfig();
        this.urlService = new UrlService(config);
    }

    getName(): string {
        return 'get_url_missing_keywords';
    }

    getDescription(): string {
        return "Identifies keyword opportunities by finding keywords where your competitors rank in top-20 but your URL does not. The weight metric returned in results indicates how many competitor URLs from top-20 rank for that keyword. Higher weight means more competitors are targeting this keyword, suggesting it is valuable for your niche. Perfect for content gap analysis and finding quick wins. API cost: 1 credit per result row returned.";
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    format: 'uri',
                    description: 'Analyzed URL'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: 'Search database ID'
                },
                sort: {
                    type: 'object',
                    properties: {
                        weight: {
                            type: 'string',
                            enum: SORT_ORDER,
                            description: 'Sort by connection strength (number of competitor URLs in top-20 ranking for this keyword). Higher weight = more competitors = higher keyword value for your niche'
                        }
                    },
                    additionalProperties: false,
                    description: 'Sorting parameters. Sort by `weight` to see keywords where most competitors rank (highest opportunity)'
                },
                filters: {
                    type: 'object',
                    properties: {
                        region_queries_count: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_to: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_from: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_to: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_from: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        cost: { type: 'number', minimum: MIN_FILTER_VALUE },
                        cost_to: { type: 'number', minimum: MIN_FILTER_VALUE },
                        cost_from: { type: 'number', minimum: MIN_FILTER_VALUE },
                        keyword: { type: 'string', description: 'Any text value' },
                        minus_keywords: { type: 'array', items: { type: 'string', minLength: MIN_KEYWORD_LENGTH, maxLength: MAX_KEYWORD_LENGTH }, description: 'Excluding keywords' },
                        concurrency: { type: 'number', minimum: MIN_FILTER_VALUE },
                        concurrency_to: { type: 'number', minimum: MIN_FILTER_VALUE },
                        concurrency_from: { type: 'number', minimum: MIN_FILTER_VALUE },
                        weight: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        weight_to: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        weight_from: { type: 'integer', minimum: MIN_FILTER_VALUE },
                        right_spelling: { type: 'boolean', description: 'Filter by spelling: true - contains all, false - does not contain all' }
                    },
                    additionalProperties: false,
                    description: 'Filter conditions'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    default: 1,
                    description: 'Page number in response'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: 'Number of results per page'
                }
            },
            required: ['url', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = urlMissingKeywordsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.urlService.getUrlMissingKeywords(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}
