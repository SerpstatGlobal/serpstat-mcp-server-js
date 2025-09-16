import { BaseHandler } from './base.js';
import { KeywordService } from '../services/keyword_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { keywordGetSchema, KeywordGetParams, getRelatedKeywordsSchema } from '../utils/validation.js';
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
