import { BaseHandler } from './base';
import { DomainService } from '../services/domain_tools';
import { MCPToolCall, MCPToolResponse } from '../types/mcp';
import { domainsInfoSchema, DomainsInfoParams, competitorsGetSchema, CompetitorsGetParams, domainKeywordsSchema, DomainKeywordsParams, domainUrlsSchema, DomainUrlsParams, domainRegionsCountSchema, DomainRegionsCountParams } from '../utils/validation';
import { loadConfig } from '../utils/config';
import { z } from 'zod';

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
                         pattern: "^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
                         minLength: 4,
                         maxLength: 253
                    },
                    description: "List of domains to analyze (1-100 domains)",
                    minItems: 1,
                    maxItems: 100
                },
                se: {
                    type: "string",
                    enum: [
                        'g_us', 'g_uk', 'g_de', 'g_fr', 'g_es', 'g_it', 'g_ca', 'g_au',
                        'g_nl', 'g_be', 'g_dk', 'g_se', 'g_no', 'g_fi', 'g_pl', 'g_cz',
                        'g_ua', 'g_ru', 'bing_us'
                    ],
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
            const params = domainsInfoSchema.parse(call.arguments) as DomainsInfoParams;
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
                    pattern: "^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain to analyze"
                },
                se: {
                    type: "string",
                    enum: [
                        'g_us', 'g_uk', 'g_au', 'g_ca', 'g_de',
                        'g_fr', 'g_ru', 'g_br', 'g_mx', 'g_es',
                        'g_it', 'g_nl', 'g_pl', 'g_ua'
                    ],
                    description: "Search engine database ID"
                },
                size: {
                    type: "integer",
                    minimum: 1,
                    maximum: 100,
                    default: 10,
                    description: "Number of results to return"
                },
                filters: {
                    type: "object",
                    properties: {
                        visible: { type: "number", minimum: 0, description: "Minimum site visibility" },
                        traff: { type: "integer", minimum: 0, description: "Minimum estimated traffic" },
                        minus_domains: {
                            type: "array",
                            items: {
                                type: "string",
                                pattern: "^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,}$"
                            },
                            minItems: 1,
                            maxItems: 50,
                            uniqueItems: true,
                            description: "Array of domains to exclude from the analysis."
                        }
                    },
                    additionalProperties: false,
                    description: "Optional filter conditions"
                }
            },
            required: ["domain", "se", "size"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = competitorsGetSchema.parse(call.arguments) as CompetitorsGetParams;
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
                    pattern: "^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain name to analyze"
                },
                se: {
                    type: "string",
                    enum: [
                        'g_us', 'g_uk', 'g_au', 'g_ca', 'g_de',
                        'g_fr', 'g_ru', 'g_br', 'g_mx', 'g_es',
                        'g_it', 'b_us', 'y_ru'
                    ],
                    default: 'g_us',
                    description: "Search engine database ID"
                },
                withSubdomains: { type: "boolean", description: "Include subdomains in analysis", default: false },
                withIntents: { type: "boolean", description: "Include keyword intents (works for g_ua and g_us only)", default: false },
                url: { type: "string", format: "uri", description: "Specific URL to filter results" },
                keywords: {
                    type: "array",
                    items: { type: "string", minLength: 1, maxLength: 100 },
                    maxItems: 50,
                    description: "Array of keywords to search for"
                },
                minusKeywords: {
                    type: "array",
                    items: { type: "string", minLength: 1, maxLength: 100 },
                    maxItems: 50,
                    description: "Array of keywords to exclude from search"
                },
                page: { type: "integer", minimum: 1, default: 1, description: "Page number" },
                size: { type: "integer", minimum: 1, maximum: 1000, default: 100, description: "Number of results per page" },
                sort: {
                    type: "object",
                    properties: {
                        position: { type: "string", enum: ["asc", "desc"] },
                        region_queries_count: { type: "string", enum: ["asc", "desc"] },
                        cost: { type: "string", enum: ["asc", "desc"] },
                        traff: { type: "string", enum: ["asc", "desc"] },
                        difficulty: { type: "string", enum: ["asc", "desc"] },
                        keyword_length: { type: "string", enum: ["asc", "desc"] },
                        concurrency: { type: "string", enum: ["asc", "desc"] }
                    },
                    additionalProperties: false,
                    description: "Sort configuration"
                },
                filters: {
                    type: "object",
                    properties: {
                        position: { type: "integer", minimum: 1, maximum: 100 },
                        position_from: { type: "integer", minimum: 1, maximum: 100 },
                        position_to: { type: "integer", minimum: 1, maximum: 100 },
                        cost: { type: "number", minimum: 0 },
                        cost_from: { type: "number", minimum: 0 },
                        cost_to: { type: "number", minimum: 0 },
                        region_queries_count: { type: "integer", minimum: 0 },
                        region_queries_count_from: { type: "integer", minimum: 0 },
                        region_queries_count_to: { type: "integer", minimum: 0 },
                        traff: { type: "integer", minimum: 0 },
                        difficulty: { type: "number", minimum: 0, maximum: 100 },
                        difficulty_from: { type: "number", minimum: 0, maximum: 100 },
                        difficulty_to: { type: "number", minimum: 0, maximum: 100 },
                        keyword_length: { type: "integer", minimum: 1 },
                        concurrency: { type: "integer", minimum: 1, maximum: 100 },
                        concurrency_from: { type: "integer", minimum: 1, maximum: 100 },
                        concurrency_to: { type: "integer", minimum: 1, maximum: 100 },
                        right_spelling: { type: "boolean" },
                        keyword_contain: { type: "string" },
                        keyword_not_contain: { type: "string" },
                        intents_contain: {
                            type: "array",
                            items: { type: "string", enum: ["informational", "navigational", "commercial", "transactional"] }
                        },
                        intents_not_contain: {
                            type: "array",
                            items: { type: "string", enum: ["informational", "navigational", "commercial", "transactional"] }
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
            const params = domainKeywordsSchema.parse(call.arguments) as DomainKeywordsParams;
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
                    pattern: "^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain name to analyze"
                },
                se: {
                    type: "string",
                    enum: [
                        "g_us", "g_uk", "g_au", "g_ca", "g_de",
                        "g_fr", "g_kz", "g_br", "g_mx", "g_es",
                        "g_it", "g_nl", "g_pl", "g_ua"
                    ],
                    default: "g_us",
                    description: "Search engine database ID"
                },
                filters: {
                    type: "object",
                    properties: {
                        url_prefix: { type: "string", maxLength: 500, description: "Filter URLs that start with given prefix" },
                        url_contain: { type: "string", maxLength: 200, description: "Filter URLs that contain specified substring" },
                        url_not_contain: { type: "string", maxLength: 200, description: "Exclude URLs that contain specified substring" }
                    },
                    additionalProperties: false,
                    description: "URL filtering options"
                },
                sort: {
                    type: "object",
                    properties: {
                        keywords: { type: "string", enum: ["asc", "desc"], description: "Sort by number of keywords" }
                    },
                    additionalProperties: false,
                    description: "Sort configuration"
                },
                page: { type: "integer", minimum: 1, default: 1, description: "Page number" },
                size: { type: "integer", minimum: 1, maximum: 1000, default: 100, description: "Number of results per page" }
            },
            required: ["domain", "se"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = domainUrlsSchema.parse(call.arguments) as DomainUrlsParams;
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
        return 'Analyze domain keyword presence across all Google regional databases. Shows keyword count by country, regional performance comparison and international SEO insights. Start every complex domain analysis with this tool.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    pattern: "^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$",
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain name to analyze"
                },
                sort: {
                    type: "string",
                    enum: ["keywords_count", "country_name_en", "db_name"],
                    description: "Sort by field",
                    default: undefined
                },
                order: {
                    type: "string",
                    enum: ["asc", "desc"],
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
            const params = domainRegionsCountSchema.parse(call.arguments) as DomainRegionsCountParams;
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
