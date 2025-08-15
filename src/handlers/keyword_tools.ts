import { BaseHandler } from './base';
import { KeywordService } from '../services/keyword_tools';
import { MCPToolCall, MCPToolResponse } from '../types/mcp';
import { keywordGetSchema, KeywordGetParams, getRelatedKeywordsSchema } from '../utils/validation';
import { loadConfig } from '../utils/config';
import { z } from 'zod';

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
        return 'Показывает органические ключевые слова, связанные с исследуемым ключевым словом, по которым домены ранжируются в топ-100 Google. Для каждого найденного ключа отображается его частотность, CPC и уровень конкуренции.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                    description: 'Ключевое слово для поиска связанных ключей'
                },
                se: {
                    type: 'string',
                    enum: [
                        'g_us', 'g_uk', 'g_au', 'g_ca', 'g_de',
                        'g_fr', 'g_br', 'g_mx', 'g_es', 'g_bg',
                        'g_it', 'g_nl', 'g_pl', 'g_ua'
                    ],
                    default: 'g_us',
                    description: 'ID поисковой базы'
                },
                minusKeywords: {
                    type: 'array',
                    items: { type: 'string', minLength: 1, maxLength: 100 },
                    maxItems: 50,
                    description: 'Ключевые слова для ис��лючения из поиска'
                },
                withIntents: {
                    type: 'boolean',
                    default: false,
                    description: 'Включать ли интенты ключевых слов'
                },
                page: {
                    type: 'integer',
                    minimum: 1,
                    default: 1,
                    description: 'Номер страницы'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 1000,
                    default: 100,
                    description: 'Количество результатов на страницу'
                },
                sort: {
                    type: 'object',
                    properties: {
                        region_queries_count: { type: 'string', enum: ['asc', 'desc'] },
                        cost: { type: 'string', enum: ['asc', 'desc'] },
                        difficulty: { type: 'string', enum: ['asc', 'desc'] },
                        concurrency: { type: 'string', enum: ['asc', 'desc'] },
                        found_results: { type: 'string', enum: ['asc', 'desc'] },
                        keyword_length: { type: 'string', enum: ['asc', 'desc'] }
                    },
                    additionalProperties: false,
                    description: 'Сортировка'
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
                        right_spelling: { type: 'boolean' },
                        keyword_contain: { type: 'array', items: { type: 'string' } },
                        keyword_not_contain: { type: 'array', items: { type: 'string' } },
                        keyword_contain_one_of: { type: 'array', items: { type: 'string' } },
                        keyword_not_contain_one_of: { type: 'array', items: { type: 'string' } },
                        keyword_contain_broad_match: { type: 'array', items: { type: 'string' } },
                        keyword_not_contain_broad_match: { type: 'array', items: { type: 'string' } },
                        lang: { type: 'string' },
                        intents_contain: { type: 'array', items: { type: 'string', enum: ['informational', 'navigational', 'commercial', 'transactional'] } },
                        intents_not_contain: { type: 'array', items: { type: 'string', enum: ['informational', 'navigational', 'commercial', 'transactional'] } }
                    },
                    additionalProperties: false,
                    description: 'Фильтры поиска'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = keywordGetSchema.parse(call.arguments) as KeywordGetParams;
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
        return 'Показывает все поисковые запросы, семантически связанные с исследуемым ключевым словом. Для каждого найденного ключа отображается его частотность, CPC, конкуренция, сложность, вес, интенты и др.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                keyword: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 200,
                    description: 'Ключевое слово для поиска связанных ключей'
                },
                se: {
                    type: 'string',
                    enum: [
                        'g_us', 'g_uk', 'g_au', 'g_ca', 'g_de',
                        'g_fr', 'g_br', 'g_mx', 'g_es', 'g_bg',
                        'g_it', 'g_nl', 'g_pl', 'g_ua'
                    ],
                    default: 'g_us',
                    description: 'ID поисковой базы'
                },
                withIntents: {
                    type: 'boolean',
                    default: false,
                    description: 'Включать ли интенты ключевых слов (работает только для g_ua и g_us)'
                },
                page: {
                    type: 'integer',
                    minimum: 1,
                    default: 1,
                    description: 'Номер страницы'
                },
                size: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 1000,
                    default: 100,
                    description: 'Количество результатов на страницу'
                },
                sort: {
                    type: 'object',
                    properties: {
                        region_queries_count: { type: 'string', enum: ['asc', 'desc'] },
                        cost: { type: 'string', enum: ['asc', 'desc'] },
                        difficulty: { type: 'string', enum: ['asc', 'desc'] },
                        concurrency: { type: 'string', enum: ['asc', 'desc'] },
                        weight: { type: 'string', enum: ['asc', 'desc'] },
                        keyword: { type: 'string', enum: ['asc', 'desc'] }
                    },
                    additionalProperties: false,
                    description: 'Сортировка'
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
                        right_spelling: { type: 'boolean', description: 'Фильтр по правильности написания' },
                        keyword_contain: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова должны содержать все эти термины (точное совпадение)' },
                        keyword_not_contain: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова не должны содержать эти термины (точное совпадение)' },
                        keyword_contain_one_of: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова должны содержать хотя бы один из этих терминов' },
                        keyword_not_contain_one_of: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова не должны содержать ни один из этих терминов' },
                        keyword_contain_broad_match: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова должны содержать все эти термины (широкое соответствие)' },
                        keyword_not_contain_broad_match: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова не должны содержать эти термины (широкое соответствие)' },
                        keyword_contain_one_of_broad_match: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова должны содержать хотя бы один из этих терминов (широкое соответствие)' },
                        keyword_not_contain_one_of_broad_match: { type: 'array', items: { type: 'string' }, description: 'Ключевые слова не должны содержать ни один из этих терминов (широкое соответствие)' },
                        geo_names: { type: 'string', enum: ['contain', 'not_contain'], description: 'Фильтр по наличию географических названий' },
                        types: { type: 'array', items: { type: 'string' }, description: 'Фильтр по типам SERP-фич' },
                        intents_contain: { type: 'array', items: { type: 'string', enum: ['informational', 'navigational', 'commercial', 'transactional'] }, description: 'Ключевые слова должны содержать эти интенты' }
                    },
                    additionalProperties: false,
                    description: 'Фильтры'
                }
            },
            required: ['keyword', 'se'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const parsed = getRelatedKeywordsSchema.parse(call.arguments);
            const result = await this.keywordService.getRelatedKeywords(parsed);
            return this.createSuccessResponse(result);
        } catch (error: any) {
            return this.createErrorResponse(error);
        }
    }
}
