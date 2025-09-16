import { BaseHandler } from './base.js';
import { KeywordService } from '../services/keyword_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { keywordGetSchema, KeywordGetParams, getRelatedKeywordsSchema, keywordsInfoSchema, KeywordsInfoParams, keywordSuggestionsSchema, KeywordSuggestionsParams, keywordFullTopSchema, KeywordFullTopParams } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import {
    MAIN_SEARCH_ENGINES,
    KEYWORD_INTENTS,
    SORT_ORDER,
    DEFAULT_PAGE_SIZE
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
                    minLength: 1,
                    maxLength: 100,
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
                    items: { type: 'string', minLength: 1, maxLength: 100 },
                    maxItems: 50,
                    description: 'Keywords to exclude from search'
                },
                withIntents: {
                    type: 'boolean',
                    default: false,
                    description: 'Whether to include keyword intents'
                },
                page: {
                    type: 'integer',
                    minimum: 1,
                    default: 1,
                    description: 'page number'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 1000,
                    default: 100,
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
                        cost: { type: 'number', minimum: 0, maximum: 200 },
                        cost_from: { type: 'number', minimum: 0, maximum: 200 },
                        cost_to: { type: 'number', minimum: 0, maximum: 200 },
                        region_queries_count: { type: 'integer', minimum: 0, maximum: 100000000 },
                        region_queries_count_from: { type: 'integer', minimum: 0, maximum: 100000000 },
                        region_queries_count_to: { type: 'integer', minimum: 0, maximum: 100000000 },
                        keyword_length: { type: 'integer', minimum: 1 },
                        keyword_length_from: { type: 'integer', minimum: 1 },
                        keyword_length_to: { type: 'integer', minimum: 1 },
                        difficulty: { type: 'integer', minimum: 0, maximum: 100 },
                        difficulty_from: { type: 'integer', minimum: 0, maximum: 100 },
                        difficulty_to: { type: 'integer', minimum: 0, maximum: 100 },
                        concurrency: { type: 'integer', minimum: 1, maximum: 100 },
                        concurrency_from: { type: 'integer', minimum: 1, maximum: 100 },
                        concurrency_to: { type: 'integer', minimum: 1, maximum: 100 },
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
            const params = keywordGetSchema.parse(call.arguments) as KeywordGetParams;
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
                    minLength: 1,
                    maxLength: 200,
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
                    minimum: 1,
                    default: 1,
                    description: 'Page number'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 1000,
                    default: 100,
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
                        cost: { type: 'number', minimum: 0, maximum: 200 },
                        cost_from: { type: 'number', minimum: 0, maximum: 200 },
                        cost_to: { type: 'number', minimum: 0, maximum: 200 },
                        region_queries_count: { type: 'integer', minimum: 0, maximum: 100000000 },
                        region_queries_count_from: { type: 'integer', minimum: 0, maximum: 100000000 },
                        region_queries_count_to: { type: 'integer', minimum: 0, maximum: 100000000 },
                        keyword_length: { type: 'integer', minimum: 1 },
                        keyword_length_from: { type: 'integer', minimum: 1 },
                        keyword_length_to: { type: 'integer', minimum: 1 },
                        difficulty: { type: 'integer', minimum: 0, maximum: 100 },
                        difficulty_from: { type: 'integer', minimum: 0, maximum: 100 },
                        difficulty_to: { type: 'integer', minimum: 0, maximum: 100 },
                        concurrency: { type: 'integer', minimum: 1, maximum: 100 },
                        concurrency_from: { type: 'integer', minimum: 1, maximum: 100 },
                        concurrency_to: { type: 'integer', minimum: 1, maximum: 100 },
                        weight: { type: 'integer', minimum: 1 },
                        weight_from: { type: 'number', minimum: 1 },
                        weight_to: { type: 'number', minimum: 1 },
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
                        minLength: 1
                    },
                    minItems: 1,
                    maxItems: 1000,
                    description: "Array of keywords to analyze (1-1000 keywords)"
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
                        cost: { type: "number", minimum: 0 },
                        cost_from: { type: "number", minimum: 0 },
                        cost_to: { type: "number", minimum: 0 },
                        concurrency: { type: "integer", minimum: 0, maximum: 100 },
                        concurrency_from: { type: "integer", minimum: 0, maximum: 100 },
                        concurrency_to: { type: "integer", minimum: 0, maximum: 100 },
                        found_results: { type: "integer", minimum: 0 },
                        found_results_from: { type: "integer", minimum: 0 },
                        found_results_to: { type: "integer", minimum: 0 },
                        region_queries_count: { type: "integer", minimum: 0 },
                        region_queries_count_from: { type: "integer", minimum: 0 },
                        region_queries_count_to: { type: "integer", minimum: 0 },
                        region_queries_count_wide: { type: "integer", minimum: 0 },
                        region_queries_count_wide_from: { type: "integer", minimum: 0 },
                        region_queries_count_wide_to: { type: "integer", minimum: 0 },
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
                            items: { type: "string", minLength: 1 }
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
            const params = keywordsInfoSchema.parse(call.arguments) as KeywordsInfoParams;
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
                    minLength: 1,
                    maxLength: 200,
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
                            items: { type: 'string', minLength: 1 },
                            description: 'List of keywords to exclude from the search'
                        }
                    },
                    additionalProperties: false,
                    description: 'Filter conditions'
                },
                page: {
                    type: 'integer',
                    minimum: 1,
                    default: 1,
                    description: 'Page number in response'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 1000,
                    default: 100,
                    description: 'Number of results per page in response'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordSuggestionsSchema.parse(call.arguments) as KeywordSuggestionsParams;
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
                    minLength: 1,
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
                    minimum: 10,
                    maximum: 100,
                    description: 'Number of results per page in response'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordFullTopSchema.parse(call.arguments) as KeywordFullTopParams;
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
