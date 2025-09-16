import { BaseHandler } from './base.js';
import { KeywordService } from '../services/keyword_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { keywordGetSchema, getRelatedKeywordsSchema, keywordsInfoSchema, keywordSuggestionsSchema, keywordFullTopSchema, keywordTopUrlsSchema, keywordCompetitorsSchema, keywordTopSchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import {
    MAIN_SEARCH_ENGINES,
    KEYWORD_INTENTS,
    SORT_ORDER,
    DEFAULT_PAGE_SIZE,
    MIN_KEYWORD_LENGTH,
    MAX_KEYWORD_LENGTH,
    MAX_MINUS_KEYWORDS_ITEMS,
    MIN_PAGE,
    MAX_PAGE_SIZE,
    MIN_FILTER_VALUE,
    MAX_FILTER_COST,
    MAX_QUERIES_COUNT,
    MAX_FILTER_DIFFICULTY,
    MIN_FILTER_CONCURRENCY,
    MAX_FILTER_CONCURRENCY,
    MAX_RELATED_KEYWORD_LENGTH,
    MIN_WEIGHT,
    MIN_KEYWORDS_INFO_ITEMS,
    MAX_KEYWORDS_INFO_ITEMS,
    MIN_KEYWORD_TOP_SIZE,
    MAX_KEYWORD_TOP_SIZE,
    DEFAULT_TOP_SIZE,
    MAX_TOP_SIZE,
    MIN_FILTER_POSITION,
    MAX_FILTER_POSITION,
    ALLOWED_PAGE_SIZES
} from '../utils/constants.js';

export class GetKeywordsHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_keywords';
    }

    getDescription(): string {
        return 'Shows organic keywords related to the researched keyword for which domains rank in Google top 100. For each found keyword, displays its search volume, CPC, and competition level.'
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    maxLength: MAX_KEYWORD_LENGTH,
                    description: 'Keyword for finding related keywords'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: 'Search database ID'
                },
                minusKeywords: {
                    type: 'array',
                    items: { type: 'string', minLength: MIN_KEYWORD_LENGTH, maxLength: MAX_KEYWORD_LENGTH },
                    maxItems: MAX_MINUS_KEYWORDS_ITEMS,
                    description: 'Keywords to exclude from search'
                },
                withIntents: {
                    type: 'boolean',
                    default: false,
                    description: 'Whether to include keyword intents'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    default: 1,
                    description: 'page number'
                },
                size: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: 'results per page'
                },
                sort: {
                    type: 'object',
                    properties: {
                        region_queries_count: { type: 'string', enum: SORT_ORDER },
                        cost: { type: 'string', enum: SORT_ORDER },
                        difficulty: { type: 'string', enum: SORT_ORDER },
                        concurrency: { type: 'string', enum: SORT_ORDER },
                        found_results: { type: 'string', enum: SORT_ORDER },
                        keyword_length: { type: 'string', enum: SORT_ORDER }
                    },
                    additionalProperties: false,
                    description: 'Sorting parameters for results'
                },
                filters: {
                    type: 'object',
                    properties: {
                        cost: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        cost_from: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        cost_to: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        region_queries_count: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_QUERIES_COUNT },
                        region_queries_count_from: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_QUERIES_COUNT },
                        region_queries_count_to: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_QUERIES_COUNT },
                        keyword_length: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        keyword_length_from: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        keyword_length_to: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        difficulty: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_from: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_to: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        concurrency: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_from: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_to: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        right_spelling: { type: 'boolean', description: 'Filter by correct spelling' },
                        keyword_contain: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain all of these terms (exact match)' },
                        keyword_not_contain: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain these terms (exact match)' },
                        keyword_contain_one_of: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain at least one of these terms' },
                        keyword_not_contain_one_of: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain any of these terms' },
                        keyword_contain_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain all of these terms (broad match)' },
                        keyword_not_contain_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain these terms (broad match)' },
                        keyword_contain_one_of_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain at least one of these terms (broad match)' },
                        keyword_not_contain_one_of_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain any of these terms (broad match)' },
                        geo_names: { type: 'string', enum: ['contain', 'not_contain'], description: 'Filter by presence of geographic names' },
                        types: { type: 'array', items: { type: 'string' }, description: 'Filter by SERP feature types' },
                        intents_contain: { type: 'array', items: { type: 'string', enum: KEYWORD_INTENTS }, description: 'Keywords must contain these search intents' }
                    },
                    additionalProperties: false,
                    description: 'Results filters'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordGetSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.keywordService.getKeywords(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetRelatedKeywordsHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_related_keywords';
    }

    getDescription(): string {
        return 'Shows all search queries semantically related to the researched keyword. For each found keyword, displays its search volume, CPC, competition, difficulty, weight, intents, and more.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    maxLength: MAX_RELATED_KEYWORD_LENGTH,
                    description: 'Keyword for finding related keywords'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: 'Search database ID'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    default: 1,
                    description: 'Page number'
                },
                size: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: 'results per page'
                },
                sort: {
                    type: 'object',
                    properties: {
                        region_queries_count: { type: 'string', enum: SORT_ORDER },
                        cost: { type: 'string', enum: SORT_ORDER },
                        difficulty: { type: 'string', enum: SORT_ORDER },
                        concurrency: { type: 'string', enum: SORT_ORDER },
                        weight: { type: 'string', enum: SORT_ORDER },
                        keyword: { type: 'string', enum: SORT_ORDER }
                    },
                    additionalProperties: false,
                    description: 'Sorting parameters for results'
                },
                filters: {
                    type: 'object',
                    properties: {
                        cost: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        cost_from: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        cost_to: { type: 'number', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_COST },
                        region_queries_count: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_QUERIES_COUNT },
                        region_queries_count_from: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_QUERIES_COUNT },
                        region_queries_count_to: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_QUERIES_COUNT },
                        keyword_length: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        keyword_length_from: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        keyword_length_to: { type: 'integer', minimum: MIN_KEYWORD_LENGTH },
                        difficulty: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_from: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_to: { type: 'integer', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        concurrency: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_from: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_to: { type: 'integer', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        weight: { type: 'integer', minimum: MIN_WEIGHT },
                        weight_from: { type: 'number', minimum: MIN_WEIGHT },
                        weight_to: { type: 'number', minimum: MIN_WEIGHT },
                        right_spelling: { type: 'boolean', description: 'Filter by correct spelling' },
                        keyword_contain: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain all of these terms (exact match)' },
                        keyword_not_contain: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain these terms (exact match)' },
                        keyword_contain_one_of: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain at least one of these terms' },
                        keyword_not_contain_one_of: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain any of these terms' },
                        keyword_contain_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain all of these terms (broad match)' },
                        keyword_not_contain_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain these terms (broad match)' },
                        keyword_contain_one_of_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must contain at least one of these terms (broad match)' },
                        keyword_not_contain_one_of_broad_match: { type: 'array', items: { type: 'string' }, description: 'Keywords must not contain any of these terms (broad match)' },
                        geo_names: { type: 'string', enum: ['contain', 'not_contain'], description: 'Filter by presence of geographic names' },
                        types: { type: 'array', items: { type: 'string' }, description: 'Filter by SERP feature types' },
                        intents_contain: { type: 'array', items: { type: 'string', enum: KEYWORD_INTENTS }, description: 'Keywords must contain these search intents' }
                    },
                    additionalProperties: false,
                    description: 'Results filters'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const parsed = getRelatedKeywordsSchema.parse(call.arguments);
            if (parsed.size === undefined) {
                parsed.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.keywordService.getRelatedKeywords(parsed);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetKeywordsInfoHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return "get_keywords_info";
    }

    getDescription(): string {
        return "Get keyword overview showing volume, CPC, competition level, difficulty, and additional metrics for multiple keywords. Provides comprehensive analysis including search volume, cost per click, competition levels, SERP features, and keyword intents.";
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                keywords: {
                    type: "array",
                    items: {
                        type: "string",
                        minLength: MIN_KEYWORD_LENGTH
                    },
                    minItems: MIN_KEYWORDS_INFO_ITEMS,
                    maxItems: MAX_KEYWORDS_INFO_ITEMS,
                    description: `Array of keywords to analyze (${MIN_KEYWORDS_INFO_ITEMS}-${MAX_KEYWORDS_INFO_ITEMS} keywords)`
                },
                se: {
                    type: "string",
                    enum: MAIN_SEARCH_ENGINES,
                    description: "Search engine database ID"
                },
                withIntents: {
                    type: "boolean",
                    description: "Include keyword intents (works for g_ua and g_us only)",
                    default: false
                },
                sort: {
                    type: "object",
                    properties: {
                        region_queries_count: { type: "string", enum: SORT_ORDER },
                        region_queries_count_wide: { type: "string", enum: SORT_ORDER },
                        cost: { type: "string", enum: SORT_ORDER },
                        concurrency: { type: "string", enum: SORT_ORDER },
                        found_results: { type: "string", enum: SORT_ORDER },
                        difficulty: { type: "string", enum: SORT_ORDER }
                    },
                    additionalProperties: false,
                    description: "Sort configuration"
                },
                filters: {
                    type: "object",
                    properties: {
                        cost: { type: "number", minimum: MIN_FILTER_VALUE },
                        cost_from: { type: "number", minimum: MIN_FILTER_VALUE },
                        cost_to: { type: "number", minimum: MIN_FILTER_VALUE },
                        concurrency: { type: "integer", minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_from: { type: "integer", minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_to: { type: "integer", minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_CONCURRENCY },
                        found_results: { type: "integer", minimum: MIN_FILTER_VALUE },
                        found_results_from: { type: "integer", minimum: MIN_FILTER_VALUE },
                        found_results_to: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_from: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_to: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_from: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_to: { type: "integer", minimum: MIN_FILTER_VALUE },
                        intents_contain: {
                            type: "array",
                            items: { type: "string", enum: KEYWORD_INTENTS }
                        },
                        intents_not_contain: {
                            type: "array",
                            items: { type: "string", enum: KEYWORD_INTENTS }
                        },
                        right_spelling: { type: "boolean" },
                        minus_keywords: {
                            type: "array",
                            items: { type: "string", minLength: MIN_KEYWORD_LENGTH }
                        }
                    },
                    additionalProperties: false,
                    description: "Filter conditions"
                }
            },
            required: ["keywords", "se"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordsInfoSchema.parse(call.arguments);
            const result = await this.keywordService.getKeywordsInfo(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetKeywordSuggestionsHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_keyword_suggestions';
    }

    getDescription(): string {
        return 'Shows search suggestions for the keyword you requested (they are found by the full-text search). Returns keyword suggestions with geographic names information.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    maxLength: MAX_RELATED_KEYWORD_LENGTH,
                    description: 'Keyword to search for suggestions'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    description: 'Search engine database ID'
                },
                filters: {
                    type: 'object',
                    properties: {
                        minus_keywords: {
                            type: 'array',
                            items: { type: 'string', minLength: MIN_KEYWORD_LENGTH },
                            description: 'List of keywords to exclude from the search'
                        }
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
                    minimum: MIN_PAGE,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: 'Number of results per page in response'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordSuggestionsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.keywordService.getKeywordSuggestions(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetKeywordFullTopHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_keyword_full_top';
    }

    getDescription(): string {
        return 'Shows Google\'s top-100 search results for the analyzed keyword. Returns detailed information about domains ranking for the keyword including their visibility, organic/PPC keywords count, SDR score, and backlink metrics.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    description: 'Keyword to search for'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    description: 'Search engine database ID'
                },
                sort: {
                    type: 'object',
                    properties: {
                        position: { type: 'string', enum: SORT_ORDER },
                        url_keywords_count: { type: 'string', enum: SORT_ORDER },
                        domain_visibility: { type: 'string', enum: SORT_ORDER },
                        domain_keywords_organic: { type: 'string', enum: SORT_ORDER },
                        domain_keywords_ppc: { type: 'string', enum: SORT_ORDER },
                        domain_top_10_keywords_count: { type: 'string', enum: SORT_ORDER },
                        domain_sdr: { type: 'string', enum: SORT_ORDER },
                        domain_in_urls_count: { type: 'string', enum: SORT_ORDER },
                        domain_in_domains_count: { type: 'string', enum: SORT_ORDER },
                        domain_out_urls_count: { type: 'string', enum: SORT_ORDER },
                        domain_out_domains_count: { type: 'string', enum: SORT_ORDER }
                    },
                    additionalProperties: false,
                    description: 'Order of sorting the results in the format: field: order'
                },
                size: {
                    type: 'integer',
                    minimum: MIN_KEYWORD_TOP_SIZE,
                    maximum: MAX_KEYWORD_TOP_SIZE,
                    description: 'Number of results per page in response (minimum 10, maximum 100)'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordFullTopSchema.parse(call.arguments);
            const result = await this.keywordService.getKeywordFullTop(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetKeywordTopUrlsHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_keyword_top_urls';
    }

    getDescription(): string {
        return 'Returns website pages that rank for the largest amount of the analyzed keyword variations and have the highest traffic. Shows URLs with keyword count, estimated traffic, and Facebook shares.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    description: 'Keyword to search for'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    description: 'Search engine database ID'
                },
                sort: {
                    type: 'string',
                    description: 'Sorting by parameters (any field in urls section of response: url, keywords, traff, fbShares)'
                },
                order: {
                    type: 'string',
                    enum: SORT_ORDER,
                    default: 'desc',
                    description: 'Sorting order'
                },
                page: {
                    type: 'integer',
                    minimum: MIN_PAGE,
                    description: 'Page number'
                },
                page_size: {
                    type: 'integer',
                    enum: ALLOWED_PAGE_SIZES,
                    description: 'Number of results per page (allowed values: 10, 20, 30, 50, 100, 200, 500)'
                }
            },
            required: ['keyword'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordTopUrlsSchema.parse(call.arguments);
            const result = await this.keywordService.getKeywordTopUrls(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetKeywordCompetitorsHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_keyword_competitors';
    }

    getDescription(): string {
        return 'Lists the domains that rank for the given keyword in Google top-20 results. Shows detailed competitor analysis including visibility metrics, traffic data, keyword dynamics, and relevance scores.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    description: 'Keyword to search for competitors'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    description: 'Search engine database ID'
                },
                filters: {
                    type: 'object',
                    properties: {
                        domain: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'List of domains to filter, e.g., www.apple.com'
                        },
                        minus_domain: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'List of domains to exclude from the results, e.g., www.blackberry.com'
                        },
                        visible: {
                            type: 'integer',
                            description: 'Exact visibility value'
                        },
                        visible_from: {
                            type: 'integer',
                            description: 'Minimum visibility value'
                        },
                        visible_to: {
                            type: 'integer',
                            description: 'Maximum visibility value'
                        },
                        traff: {
                            type: 'integer',
                            description: 'Exact traffic value'
                        },
                        traff_from: {
                            type: 'integer',
                            description: 'Minimum traffic value'
                        },
                        traff_to: {
                            type: 'integer',
                            description: 'Maximum traffic value'
                        },
                        relevance: {
                            type: 'integer',
                            description: 'Exact relevance value'
                        },
                        relevance_from: {
                            type: 'integer',
                            description: 'Minimum relevance value'
                        },
                        relevance_to: {
                            type: 'integer',
                            description: 'Maximum relevance value'
                        },
                        our_relevance: {
                            type: 'integer',
                            description: 'Exact value for our relevance'
                        },
                        our_relevance_from: {
                            type: 'integer',
                            description: 'Minimum value for our relevance'
                        },
                        our_relevance_to: {
                            type: 'integer',
                            description: 'Maximum value for our relevance'
                        }
                    },
                    additionalProperties: false,
                    description: 'Filters for search. Fields are combined using the AND logic'
                },
                sort: {
                    type: 'object',
                    additionalProperties: {
                        type: 'string',
                        enum: SORT_ORDER
                    },
                    description: 'Order of sorting the results in the format: field: order (e.g., {"region_queries_count": "desc"})'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 1000,
                    description: 'Number of results per page in response'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordCompetitorsSchema.parse(call.arguments);
            const result = await this.keywordService.getKeywordCompetitors(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetKeywordTopHandler extends BaseHandler {
    private keywordService: KeywordService;

    constructor() {
        super();
        const config = loadConfig();
        this.keywordService = new KeywordService(config);
    }

    getName(): string {
        return 'get_keyword_top';
    }

    getDescription(): string {
        return 'Shows Google\'s top-100 search results for the analyzed keyword. Returns position data, URLs, domains, subdomains, and SERP feature types. This method is deprecated but still functional.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: MIN_KEYWORD_LENGTH,
                    description: 'Keyword to search for'
                },
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    description: 'Search engine database ID'
                },
                filters: {
                    type: 'object',
                    properties: {
                        top_size: {
                            type: 'integer',
                            minimum: MIN_KEYWORD_LENGTH,
                            maximum: MAX_TOP_SIZE,
                            default: DEFAULT_TOP_SIZE,
                            description: 'The number of results to retrieve from the top search results'
                        },
                        position: {
                            type: 'integer',
                            minimum: MIN_FILTER_POSITION,
                            maximum: MAX_FILTER_POSITION,
                            description: 'The exact position of the keyword in search results'
                        },
                        position_from: {
                            type: 'integer',
                            minimum: MIN_FILTER_POSITION,
                            maximum: MAX_FILTER_POSITION,
                            description: 'The minimum position of the keyword in search results'
                        },
                        position_to: {
                            type: 'integer',
                            minimum: MIN_FILTER_POSITION,
                            maximum: MAX_FILTER_POSITION,
                            description: 'The maximum position of the keyword in search results'
                        },
                        url: {
                            type: 'string',
                            format: 'uri',
                            description: 'Filters by a specific URL'
                        },
                        exact_url: {
                            type: 'string',
                            format: 'uri',
                            description: 'Filters by an exact URL'
                        },
                        domain: {
                            type: 'string',
                            description: 'Filters by domain name'
                        },
                        minus_domain: {
                            type: 'string',
                            description: 'Excludes results from the specified domain'
                        },
                        subdomain: {
                            type: 'string',
                            description: 'Filters by subdomain'
                        }
                    },
                    additionalProperties: false,
                    description: 'Filters for search results'
                },
                size: {
                    type: 'integer',
                    minimum: MIN_KEYWORD_LENGTH,
                    maximum: MAX_PAGE_SIZE,
                    description: 'Number of results per page in response'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordTopSchema.parse(call.arguments);
            const result = await this.keywordService.getKeywordTop(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}
