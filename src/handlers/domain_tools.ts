import { BaseHandler } from './base.js';
import { DomainService } from '../services/domain_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { domainsInfoSchema, competitorsGetSchema, domainKeywordsSchema, domainUrlsSchema, domainRegionsCountSchema, domainUniqKeywordsSchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import {
    MAIN_SEARCH_ENGINES,
    KEYWORD_INTENTS,
    DOMAIN_REGIONS_SORT_FIELDS,
    SORT_ORDER,
    DOMAIN_NAME_REGEX,
    DEFAULT_PAGE_SIZE,
    DEFAULT_COMPETITORS_SIZE,
    MIN_DOMAIN_LENGTH,
    MAX_DOMAIN_LENGTH,
    MIN_DOMAINS_ITEMS,
    MAX_DOMAINS_ITEMS,
    MIN_COMPETITORS_SIZE,
    MAX_COMPETITORS_SIZE,
    DEFAULT_COMPETITORS_HANDLER_SIZE,
    MIN_FILTER_VALUE,
    MIN_MINUS_DOMAINS_ITEMS,
    MAX_MINUS_DOMAINS_ITEMS,
    MIN_KEYWORD_LENGTH,
    MAX_KEYWORD_LENGTH,
    MAX_KEYWORDS_ITEMS,
    MAX_MINUS_KEYWORDS_ITEMS,
    MIN_PAGE,
    MAX_PAGE_SIZE,
    MIN_FILTER_POSITION,
    MAX_FILTER_POSITION,
    MAX_FILTER_DIFFICULTY,
    MIN_FILTER_CONCURRENCY,
    MAX_FILTER_CONCURRENCY,
    MAX_URL_PREFIX_LENGTH,
    MAX_URL_CONTAIN_LENGTH,
    MIN_UNIQ_DOMAINS,
    MAX_UNIQ_DOMAINS,
    MAX_UNIQ_KEYWORDS_ITEMS
} from '../utils/constants.js';

export class DomainsInfoHandler extends BaseHandler {
    private domainService: DomainService;

    constructor() {
        super();
        const config = loadConfig();
        this.domainService = new DomainService(config);
    }

    getName(): string {
        return 'get_domains_info';
    }

    getDescription(): string {
        return 'Get comprehensive SEO information for multiple domains including visibility, keywords, traffic, and dynamics';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domains: {
                    type: "array",
                    items: {
                         type: "string",
                         pattern: DOMAIN_NAME_REGEX,
                         minLength: MIN_DOMAIN_LENGTH,
                         maxLength: MAX_DOMAIN_LENGTH
                    },
                    description: `List of domains to analyze (1-${MAX_DOMAINS_ITEMS} domains)`,
                    minItems: MIN_DOMAINS_ITEMS,
                    maxItems: MAX_DOMAINS_ITEMS
                },
                se: {
                    type: "string",
                    enum: MAIN_SEARCH_ENGINES,
                    description: "Search engine database (e.g., g_us for Google US)"
                },
                filters: {
                    type: "object",
                    properties: {
                        traff: { type: "number", description: "Exact traffic value" },
                        traff_from: { type: "number", description: "Minimum traffic value" },
                        traff_to: { type: "number", description: "Maximum traffic value" },
                        visible: { type: "number", description: "Exact visibility value" },
                        visible_from: { type: "number", description: "Minimum visibility value" },
                        visible_to: { type: "number", description: "Maximum visibility value" }
                    },
                    additionalProperties: false,
                    description: "Optional filters for the results"
                }
            },
            required: ["domains", "se"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = domainsInfoSchema.parse(call.arguments);
            const result = await this.domainService.getDomainsInfo(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class CompetitorsHandler extends BaseHandler {
    private domainService: DomainService;

    constructor() {
        super();
        const config = loadConfig();
        this.domainService = new DomainService(config);
    }

    getName(): string {
        return 'get_domain_competitors';
    }

    getDescription(): string {
        return 'Get a list of competitor domains for a given domain, including visibility, traffic, and relevance.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain to analyze"
                },
                se: {
                    type: "string",
                    enum: MAIN_SEARCH_ENGINES,
                    description: "Search engine database ID"
                },
                size: {
                    type: "integer",
                    minimum: MIN_COMPETITORS_SIZE,
                    maximum: MAX_COMPETITORS_SIZE,
                    default: DEFAULT_COMPETITORS_HANDLER_SIZE,
                    description: "Number of results to return"
                },
                filters: {
                    type: "object",
                    properties: {
                        visible: { type: "number", minimum: MIN_FILTER_VALUE, description: "Minimum site visibility" },
                        traff: { type: "integer", minimum: MIN_FILTER_VALUE, description: "Minimum estimated traffic" },
                        minus_domains: {
                            type: "array",
                            items: {
                                type: "string",
                                pattern: DOMAIN_NAME_REGEX
                            },
                            minItems: MIN_MINUS_DOMAINS_ITEMS,
                            maxItems: MAX_MINUS_DOMAINS_ITEMS,
                            uniqueItems: true,
                            description: "Array of domains to exclude from the analysis."
                        }
                    },
                    additionalProperties: false,
                    description: "Optional filter conditions"
                }
            },
            required: ["domain", "se"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = competitorsGetSchema.parse(call.arguments);
            // sometimes llm bad at assume required size parameter, let it be 20
            if (params.size === undefined) {
                params.size = DEFAULT_COMPETITORS_SIZE;
            }
            const result = await this.domainService.getCompetitors(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class DomainKeywordsHandler extends BaseHandler {
    private domainService: DomainService;

    constructor() {
        super();
        const config = loadConfig();
        this.domainService = new DomainService(config);
    }

    getName(): string {
        return 'get_domain_keywords';
    }

    getDescription(): string {
        return 'Get keywords that domain ranks for in Google search results. Includes position, traffic, difficulty analysis with comprehensive SEO insights and performance metrics.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name to analyze"
                },
                se: {
                    type: "string",
                    enum: MAIN_SEARCH_ENGINES,
                    default: 'g_us',
                    description: "Search engine database ID"
                },
                withSubdomains: { type: "boolean", description: "Include subdomains in analysis", default: false },
                withIntents: { type: "boolean", description: "Include keyword intents (works for g_ua and g_us only)", default: false },
                url: { type: "string", description: "Specific URL to filter results" },
                keywords: {
                    type: "array",
                    items: { type: "string", minLength: MIN_KEYWORD_LENGTH, maxLength: MAX_KEYWORD_LENGTH },
                    maxItems: MAX_KEYWORDS_ITEMS,
                    description: "Array of keywords to search for"
                },
                minusKeywords: {
                    type: "array",
                    items: { type: "string", minLength: MIN_KEYWORD_LENGTH, maxLength: MAX_KEYWORD_LENGTH },
                    maxItems: MAX_MINUS_KEYWORDS_ITEMS,
                    description: "Array of keywords to exclude from search"
                },
                page: { type: "integer", minimum: MIN_PAGE, default: 1, description: "Page number" },
                size: { type: "integer", minimum: MIN_PAGE, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE, description: "Number of results per page" },
                sort: {
                    type: "object",
                    properties: {
                        position: { type: "string", enum: SORT_ORDER },
                        region_queries_count: { type: "string", enum: SORT_ORDER },
                        cost: { type: "string", enum: SORT_ORDER },
                        traff: { type: "string", enum: SORT_ORDER },
                        difficulty: { type: "string", enum: SORT_ORDER },
                        keyword_length: { type: "string", enum: SORT_ORDER },
                        concurrency: { type: "string", enum: SORT_ORDER }
                    },
                    additionalProperties: false,
                    description: "Sort configuration"
                },
                filters: {
                    type: "object",
                    properties: {
                        position: { type: "integer", minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        position_from: { type: "integer", minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        position_to: { type: "integer", minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        cost: { type: "number", minimum: MIN_FILTER_VALUE },
                        cost_from: { type: "number", minimum: MIN_FILTER_VALUE },
                        cost_to: { type: "number", minimum: MIN_FILTER_VALUE },
                        region_queries_count: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_from: { type: "integer", minimum: MIN_FILTER_VALUE },
                        region_queries_count_to: { type: "integer", minimum: MIN_FILTER_VALUE },
                        traff: { type: "integer", minimum: MIN_FILTER_VALUE },
                        difficulty: { type: "number", minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_from: { type: "number", minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_to: { type: "number", minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        keyword_length: { type: "integer", minimum: MIN_KEYWORD_LENGTH },
                        concurrency: { type: "integer", minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_from: { type: "integer", minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_to: { type: "integer", minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        right_spelling: { type: "boolean" },
                        keyword_contain: { type: "string" },
                        keyword_not_contain: { type: "string" },
                        intents_contain: {
                            type: "array",
                            items: { type: "string", enum: KEYWORD_INTENTS }
                        },
                        intents_not_contain: {
                            type: "array",
                            items: { type: "string", enum: KEYWORD_INTENTS }
                        }
                    },
                    additionalProperties: false,
                    description: "Filter conditions"
                }
            },
            required: ["domain", "se"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = domainKeywordsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.domainService.getDomainKeywords(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class DomainUrlsHandler extends BaseHandler {
    private domainService: DomainService;

    constructor() {
        super();
        const config = loadConfig();
        this.domainService = new DomainService(config);
    }

    getName(): string {
        return 'get_domain_urls';
    }

    getDescription(): string {
        return 'Get URLs within a domain and keyword count for each URL. Analyze URL structure, performance distribution, and identify top-performing pages. Each URL costs 1 API credit, minimum 1 credit per request.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name to analyze"
                },
                se: {
                    type: "string",
                    enum: MAIN_SEARCH_ENGINES,
                    default: "g_us",
                    description: "Search engine database ID"
                },
                filters: {
                    type: "object",
                    properties: {
                        url_prefix: { type: "string", maxLength: MAX_URL_PREFIX_LENGTH, description: "Filter URLs that start with given prefix" },
                        url_contain: { type: "string", maxLength: MAX_URL_CONTAIN_LENGTH, description: "Filter URLs that contain specified substring" },
                        url_not_contain: { type: "string", maxLength: MAX_URL_CONTAIN_LENGTH, description: "Exclude URLs that contain specified substring" }
                    },
                    additionalProperties: false,
                    description: "URL filtering options"
                },
                sort: {
                    type: "object",
                    properties: {
                        keywords: { type: "string", enum: SORT_ORDER, description: "Sort by number of keywords" }
                    },
                    additionalProperties: false,
                    description: "Sort configuration"
                },
                page: { type: "integer", minimum: MIN_PAGE, default: 1, description: "Page number" },
                size: { type: "integer", minimum: MIN_PAGE, maximum: MAX_PAGE_SIZE, default: DEFAULT_PAGE_SIZE, description: "Number of results per page" }
            },
            required: ["domain", "se"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = domainUrlsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.domainService.getDomainUrls(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class DomainRegionsCountHandler extends BaseHandler {
    private domainService: DomainService;

    constructor() {
        super();
        const config = loadConfig();
        this.domainService = new DomainService(config);
    }

    getName(): string {
        return 'get_domain_regions_count';
    }

    getDescription(): string {
        return '**REQUIRED FIRST STEP ONLY IF DOMAIN ANALYSIS** for domain analysis: Determines optimal regional database (se parameter) by analyzing domain keyword presence across all Google regions. This tool identifies which regional database contains the most keyword data for the domain, ensuring subsequent analysis uses the correct market context.'
            +' Returns: keyword count by country, regional performance comparison, and identifies primary market for the domain.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name to analyze"
                },
                sort: {
                    type: "string",
                    enum: DOMAIN_REGIONS_SORT_FIELDS,
                    description: "Sort by field",
                    default: undefined
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    description: "Sort order",
                    default: undefined
                }
            },
            required: ["domain"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = domainRegionsCountSchema.parse(call.arguments);
            const result = await this.domainService.getDomainRegionsCount(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetDomainUniqKeywordsHandler extends BaseHandler {
    private domainService: DomainService;

    constructor() {
        super();
        const config = loadConfig();
        this.domainService = new DomainService(config);
    }

    getName(): string {
        return 'get_domain_uniq_keywords';
    }

    getDescription(): string {
        return 'Returns unique keywords of two domains for which a third domain does not rank. Equivalent to a Domain vs domain report.';
    }

    getInputSchema(): object {
        return {
            type: 'object',
            properties: {
                se: {
                    type: 'string',
                    enum: MAIN_SEARCH_ENGINES,
                    description: 'Search engine database ID',
                    default: 'g_us'
                },
                domains: {
                    type: 'array',
                    description: `Array of domains to analyze for unique keywords (min ${MIN_UNIQ_DOMAINS}, max ${MAX_UNIQ_DOMAINS})`,
                    minItems: MIN_UNIQ_DOMAINS,
                    maxItems: MAX_UNIQ_DOMAINS,
                    uniqueItems: true,
                    items: {
                        type: 'string',
                        pattern: DOMAIN_NAME_REGEX,
                        minLength: MIN_DOMAIN_LENGTH,
                        maxLength: MAX_DOMAIN_LENGTH
                    }
                },
                minusDomain: {
                    type: 'string',
                    description: 'Domain with keywords which must not intersect with domains parameter',
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH
                },
                page: {
                    type: 'integer',
                    description: 'Page number',
                    minimum: MIN_PAGE,
                    default: 1
                },
                size: {
                    type: 'integer',
                    description: 'Number of results per page',
                    minimum: MIN_PAGE,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE
                },
                filters: {
                    type: 'object',
                    description: 'Filter conditions for unique keywords',
                    properties: {
                        right_spelling: { type: 'boolean', description: 'Include or exclude correctly spelled keywords' },
                        misspelled: { type: 'boolean', description: 'Include or exclude misspelled keywords' },
                        keywords: {
                            type: 'array',
                            description: 'List of included keywords',
                            items: { type: 'string', minLength: MIN_KEYWORD_LENGTH, maxLength: MAX_KEYWORD_LENGTH },
                            maxItems: MAX_UNIQ_KEYWORDS_ITEMS
                        },
                        minus_keywords: {
                            type: 'array',
                            description: 'List of excluded keywords',
                            items: { type: 'string', minLength: MIN_KEYWORD_LENGTH, maxLength: MAX_KEYWORD_LENGTH },
                            maxItems: MAX_UNIQ_KEYWORDS_ITEMS
                        },
                        queries: { type: 'integer', description: 'Exact number of keyword searches per month', minimum: MIN_FILTER_VALUE },
                        queries_from: { type: 'integer', description: 'Minimum number of keyword searches per month', minimum: MIN_FILTER_VALUE },
                        queries_to: { type: 'integer', description: 'Maximum number of keyword searches per month', minimum: MIN_FILTER_VALUE },
                        region_queries_count: { type: 'integer', description: 'Exact search volume for the selected region', minimum: MIN_FILTER_VALUE },
                        region_queries_count_from: { type: 'integer', description: 'Minimum search volume for the selected region', minimum: MIN_FILTER_VALUE },
                        region_queries_count_to: { type: 'integer', description: 'Maximum search volume for the selected region', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide: { type: 'integer', description: 'Exact search volume in broad match', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_from: { type: 'integer', description: 'Minimum search volume in broad match', minimum: MIN_FILTER_VALUE },
                        region_queries_count_wide_to: { type: 'integer', description: 'Maximum search volume in broad match', minimum: MIN_FILTER_VALUE },
                        cost: { type: 'number', description: 'Exact cost per click (in USD)', minimum: MIN_FILTER_VALUE },
                        cost_from: { type: 'number', description: 'Minimum cost per click (in USD)', minimum: MIN_FILTER_VALUE },
                        cost_to: { type: 'number', description: 'Maximum cost per click (in USD)', minimum: MIN_FILTER_VALUE },
                        concurrency: { type: 'integer', description: 'Exact competition level (1-100)', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_from: { type: 'integer', description: 'Minimum competition level (1-100)', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        concurrency_to: { type: 'integer', description: 'Maximum competition level (1-100)', minimum: MIN_FILTER_CONCURRENCY, maximum: MAX_FILTER_CONCURRENCY },
                        difficulty: { type: 'integer', description: 'Exact keyword difficulty', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_from: { type: 'integer', description: 'Minimum keyword difficulty', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        difficulty_to: { type: 'integer', description: 'Maximum keyword difficulty', minimum: MIN_FILTER_VALUE, maximum: MAX_FILTER_DIFFICULTY },
                        keyword_length: { type: 'integer', description: 'Exact number of words in a keyword', minimum: MIN_KEYWORD_LENGTH },
                        keyword_length_from: { type: 'integer', description: 'Minimum number of words in a keyword', minimum: MIN_KEYWORD_LENGTH },
                        keyword_length_to: { type: 'integer', description: 'Maximum number of words in a keyword', minimum: MIN_KEYWORD_LENGTH },
                        traff: { type: 'integer', description: 'Exact traffic volume for the keyword', minimum: MIN_FILTER_VALUE },
                        traff_from: { type: 'integer', description: 'Minimum traffic volume for the keyword', minimum: MIN_FILTER_VALUE },
                        traff_to: { type: 'integer', description: 'Maximum traffic volume for the keyword', minimum: MIN_FILTER_VALUE },
                        position: { type: 'integer', description: 'Exact keyword position in the SERP', minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        position_from: { type: 'integer', description: 'Minimum keyword position in the SERP', minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION },
                        position_to: { type: 'integer', description: 'Maximum keyword position in the SERP', minimum: MIN_FILTER_POSITION, maximum: MAX_FILTER_POSITION }
                    },
                    additionalProperties: false
                }
            },
            required: ['se', 'domains', 'minusDomain'],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = domainUniqKeywordsSchema.parse(call.arguments);
            if (params.size === undefined) {
                params.size = DEFAULT_PAGE_SIZE;
            }
            const result = await this.domainService.getDomainUniqKeywords(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}
