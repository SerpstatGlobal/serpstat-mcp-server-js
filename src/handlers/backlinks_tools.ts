import { BaseHandler } from './base.js';
import { BacklinksService } from '../services/backlinks_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { backlinksSummarySchema, BacklinksSummaryParams, anchorsSchema, AnchorsParams, getActiveBacklinksSchema, GetActiveBacklinksParams, getReferringDomainsSchema, GetReferringDomainsParams, getLostBacklinksSchema, GetLostBacklinksParams } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import { SEARCH_TYPES, SEARCH_TYPES_URL, DOMAIN_NAME_REGEX, ANCHORS_SORT_FIELDS, BACKLINKS_SORT_FIELDS, REFERRING_DOMAINS_SORT_FIELDS, LOST_BACKLINKS_SORT_FIELDS, SORT_ORDER, DEFAULT_PAGE_SIZE, MIN_PAGE, MAX_PAGE_SIZE, MIN_DOMAIN_LENGTH, MAX_DOMAIN_LENGTH, LOST_BACKLINKS_COMPLEX_FILTER_FIELDS, COMPLEX_FILTER_COMPARE_TYPES, ADDITIONAL_FILTERS } from '../utils/constants.js';

export class BacklinksSummaryHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_backlinks_summary';
    }

    getDescription(): string {
        return 'Get comprehensive backlinks summary using Serpstat API. Returns referring domains, backlinks count, link types, quality metrics and recent changes for domain or subdomain.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain or subdomain to analyze"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES,
                    default: "domain",
                    description: "Type of search query"
                }
            },
            required: ["query"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = backlinksSummarySchema.parse(call.arguments) as BacklinksSummaryParams;
            const result = await this.backlinksService.getBacklinksSummary(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetAnchorsHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_anchors';
    }

    getDescription(): string {
        return 'Get anchor text analysis for backlinks using Serpstat API. Returns anchor texts used in backlinks, with metrics including referring domains, total backlinks, and nofollow counts for domain or URL analysis.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain, subdomain, or URL to analyze"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES_URL,
                    description: "Type of search query"
                },
                anchor: {
                    type: "string",
                    description: "Filter by specific anchor text"
                },
                count: {
                    type: "string",
                    description: "Number of words in anchor text filter"
                },
                sort: {
                    type: "string",
                    enum: ANCHORS_SORT_FIELDS,
                    default: "lastupdate",
                    description: "Sort results by field (total, refDomains, nofollow, anchor, lastupdate)"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    default: "desc",
                    description: "Sort order (asc, desc)"
                },
                page: {
                    type: "integer",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "Page number for pagination"
                },
                size: {
                    type: "integer",
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: "Number of results per page"
                }
            },
            required: ["query", "searchType"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = anchorsSchema.parse(call.arguments) as AnchorsParams;
            const result = await this.backlinksService.getAnchors(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetActiveBacklinksHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_active_backlinks';
    }

    getDescription(): string {
        return 'Get a list of active backlinks using Serpstat API. Returns linking pages, target pages, link attributes, link types, external links count, anchor text, and discovery dates for domain or URL analysis.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain, subdomain, or URL to analyze"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES_URL,
                    default: "domain",
                    description: "Type of search query (domain, domain_with_subdomains, url, part_url)"
                },
                sort: {
                    type: "string",
                    enum: BACKLINKS_SORT_FIELDS,
                    default: "check",
                    description: "Sort results by field (url_from, anchor, link_nofollow, links_external, link_type, url_to, check, add, domain_rank)"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    description: "Sort order (asc, desc)"
                },
                linkPerDomain: {
                    type: "integer",
                    minimum: 1,
                    default: 1,
                    maximum: 1,
                    description: "Use this parameter **ONLY** if you need one link per donor domain"
                },
                page: {
                    type: "integer",
                    minimum: MIN_PAGE,
                    default: 1,
                    maximum: 50,
                    description: "Page number for pagination"
                },
                size: {
                    type: "integer",
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: "Number of results per page"
                }
            },
            required: ["query"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getActiveBacklinksSchema.parse(call.arguments) as GetActiveBacklinksParams;
            const result = await this.backlinksService.getActiveBacklinks(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetReferringDomainsHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_referring_domains';
    }

    getDescription(): string {
        return 'Get a list of referring domains using Serpstat API. Returns referring domains that link to the analyzed site with domain rank metrics, referring pages count, and filtering options for comprehensive backlink analysis.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: 4,
                    maxLength: 253,
                    description: "Domain to analyze for referring domains"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES,
                    default: "domain",
                    description: "Type of search query (domain, domain_with_subdomains)"
                },
                sort: {
                    type: "string",
                    enum: REFERRING_DOMAINS_SORT_FIELDS,
                    default: "check",
                    description: "Sort results by field (domain_links, domain_from, domain_rank, check)"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    description: "Sort order (asc, desc)"
                },
                page: {
                    type: "integer",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "Page number for pagination"
                },
                size: {
                    type: "integer",
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: "Number of results per page"
                }
            },
            required: ["query"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getReferringDomainsSchema.parse(call.arguments) as GetReferringDomainsParams;
            const result = await this.backlinksService.getReferringDomains(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetLostBacklinksHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_lost_backlinks';
    }

    getDescription(): string {
        return 'Get a list of lost backlinks showing linking pages, target pages, link attributes, and deletion dates for domain or URL analysis';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name or URL to analyze"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES_URL,
                    default: "domain",
                    description: "Type of search: domain, domain_with_subdomains, url, or part_url"
                },
                sort: {
                    type: "string",
                    enum: LOST_BACKLINKS_SORT_FIELDS,
                    default: "check",
                    description: "Field to sort results by"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    description: "Sort order: asc or desc"
                },
                complexFilter: {
                    type: "array",
                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    enum: LOST_BACKLINKS_COMPLEX_FILTER_FIELDS
                                },
                                operator: {
                                    type: "string",
                                    enum: COMPLEX_FILTER_COMPARE_TYPES
                                },
                                value: {
                                    oneOf: [
                                        { type: "string" },
                                        { type: "number" },
                                        { type: "array", items: { oneOf: [{ type: "string" }, { type: "number" }] } }
                                    ]
                                }
                            },
                            required: ["name", "operator", "value"],
                            additionalProperties: false
                        }
                    },
                    description: "Complex filters for advanced filtering"
                },
                additionalFilters: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: ADDITIONAL_FILTERS
                    },
                    description: "Additional filter options"
                },
                page: {
                    type: "integer",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "Page number for pagination"
                },
                size: {
                    type: "integer",
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE,
                    description: "Number of results per page"
                }
            },
            required: ["query"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getLostBacklinksSchema.parse(call.arguments) as GetLostBacklinksParams;
            const result = await this.backlinksService.getLostBacklinks(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}
