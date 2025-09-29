import { BaseHandler } from './base.js';
import { BacklinksService } from '../services/backlinks_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { backlinksSummarySchema, BacklinksSummaryParams, anchorsSchema, AnchorsParams, getActiveBacklinksSchema, GetActiveBacklinksParams, getReferringDomainsSchema, GetReferringDomainsParams, getLostBacklinksSchema, GetLostBacklinksParams, getTopAnchorsSchema, GetTopAnchorsParams, getTopPagesByBacklinksSchema, GetTopPagesByBacklinksParams, getBacklinksIntersectionSchema, GetBacklinksIntersectionParams, getActiveOutlinksSchema, GetActiveOutlinksParams, getActiveOutlinkDomainsSchema, getThreatBacklinksSchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import { SEARCH_TYPES, SEARCH_TYPES_URL, DOMAIN_NAME_REGEX, ANCHORS_SORT_FIELDS, BACKLINKS_SORT_FIELDS,
    REFERRING_DOMAINS_SORT_FIELDS, LOST_BACKLINKS_SORT_FIELDS, TOP_PAGES_SORT_FIELDS, BACKLINKS_INTERSECTION_SORT_FIELDS,
    ACTIVE_OUTLINKS_SORT_FIELDS, ACTIVE_OUTLINK_DOMAINS_SORT_FIELDS, BACKLINKS_THREAT_SORT_FIELDS, SORT_ORDER,
    DEFAULT_PAGE_SIZE, MIN_PAGE, MAX_PAGE_SIZE, MIN_DOMAIN_LENGTH, MAX_DOMAIN_LENGTH, ADDITIONAL_FILTERS, MAX_INTERSECT_DOMAINS } from '../utils/constants.js';

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
        return 'Get a list of lost backlinks showing linking pages, target pages, link attributes, and deletion dates for domain or URL analysis, **use sort by check desc** to get recently lost backlinks';
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

export class GetTopAnchorsHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_top10_anchors';
    }

    getDescription(): string {
        return 'Get TOP-10 anchors with the number of backlinks and referring domains for domain analysis, use this method is you need a fast brief way to get info about top 10 anchors';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name to analyze"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES,
                    default: "domain",
                    description: "Type of search: domain or domain_with_subdomains"
                }
            },
            required: ["query"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getTopAnchorsSchema.parse(call.arguments) as GetTopAnchorsParams;
            const result = await this.backlinksService.getTopAnchors(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetTopPagesByBacklinksHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_top_pages_by_backlinks';
    }

    getDescription(): string {
        return 'Get leading pages by backlinks using Serpstat API. Returns pages with the highest number of referring pages, domains, and IP addresses for comprehensive backlink analysis.';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name to analyze"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES,
                    default: "domain",
                    description: "Type of search: domain or domain_with_subdomains"
                },
                sort: {
                    type: "string",
                    enum: TOP_PAGES_SORT_FIELDS,
                    default: "lastupdate",
                    description: "Field to sort results by"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    description: "Sort order: asc or desc"
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
            const params = getTopPagesByBacklinksSchema.parse(call.arguments) as GetTopPagesByBacklinksParams;
            const result = await this.backlinksService.getTopPagesByBacklinks(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetBacklinksIntersectionHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_backlinks_intersection';
    }

    getDescription(): string {
        return 'Get backlinks from domains that link to multiple analyzed sites simultaneously. This method reveals shared referring domains between your target domain and competitors, useful for competitive backlink analysis and identifying potential link sources. Returns intersection data showing which donors link to multiple domains in your analysis set, including link metrics, anchor texts, and domain authority scores.';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Main domain to analyze for backlinks intersection"
                },
                intersect: {
                    type: "array",
                    items: {
                        type: "string",
                        minLength: MIN_DOMAIN_LENGTH,
                        maxLength: MAX_DOMAIN_LENGTH
                    },
                    minItems: 1,
                    maxItems: MAX_INTERSECT_DOMAINS,
                    description: "Array of competitor domains for intersection analysis"
                },
                sort: {
                    type: "string",
                    enum: BACKLINKS_INTERSECTION_SORT_FIELDS,
                    default: "domain_rank",
                    description: "Field to sort results by (domain_rank, links_count1, links_count2, links_count3)"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    default: "desc",
                    description: "Sort order: asc or desc"
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
            required: ["query", "intersect"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getBacklinksIntersectionSchema.parse(call.arguments) as GetBacklinksIntersectionParams;
            const result = await this.backlinksService.getBacklinksIntersection(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetActiveOutlinksHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_active_outlinks';
    }

    getDescription(): string {
        return 'Get active outbound links from a domain or URL. Returns external links the site points to, including target URLs, anchor text, link attributes (nofollow/dofollow), link types, and discovery dates. Useful for analyzing linking strategies, finding partnership opportunities, and auditing outbound link profiles.';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain name or URL to analyze for outbound links"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES_URL,
                    default: "domain",
                    description: "Type of search: domain, domain_with_subdomains, url, or part_url"
                },
                sort: {
                    type: "string",
                    enum: ACTIVE_OUTLINKS_SORT_FIELDS,
                    default: "check",
                    description: "Field to sort results by"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    default: "desc",
                    description: "Sort order: asc or desc"
                },
                linkPerDomain: {
                    type: "integer",
                    minimum: 1,
                    description: "Maximum number of links to return per domain"
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
            const params = getActiveOutlinksSchema.parse(call.arguments) as GetActiveOutlinksParams;
            const result = await this.backlinksService.getActiveOutlinks(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetActiveOutlinkDomainsHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_active_outlink_domains';
    }

    getDescription(): string {
        return 'Get external domains that receive outbound links from the analyzed domain. Returns target domains with total link counts, revealing partnership networks, referenced sources, and linking patterns. Helps identify collaboration opportunities by analyzing which domains competitors link to.';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Domain name to analyze outbound link destinations",
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES_URL,
                    description: "Search type for analysis",
                    default: "domain"
                },
                sort: {
                    type: "string",
                    enum: ACTIVE_OUTLINK_DOMAINS_SORT_FIELDS,
                    description: "Field to sort results by",
                    default: "domain_rank"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    description: "Sort order",
                    default: "desc"
                },
                page: {
                    type: "integer",
                    description: "Page number for pagination",
                    minimum: MIN_PAGE,
                    default: 1
                },
                size: {
                    type: "integer",
                    description: "Number of results per page",
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE
                }
            },
            required: ["query", "searchType"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getActiveOutlinkDomainsSchema.parse(call.arguments);
            const result = await this.backlinksService.getActiveOutlinkDomains(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetThreatBacklinksHandler extends BaseHandler {
    private backlinksService: BacklinksService;

    constructor() {
        super();
        const config = loadConfig();
        this.backlinksService = new BacklinksService(config);
    }

    getName(): string {
        return 'get_threat_backlinks';
    }

    getDescription(): string {
        return 'Get malicious backlinks pointing to the analyzed domain. Returns links from sites flagged for threats like social engineering, malware, or unwanted software. Shows referring domain, source URL, target URL, platform type, threat type, and last update date. Essential for identifying and removing harmful backlinks that could damage domain reputation and SEO rankings.';
    }

    getInputSchema(): Record<string, any> {
        return {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "Domain to analyze for threat backlinks"
                },
                searchType: {
                    type: "string",
                    enum: SEARCH_TYPES,
                    default: "domain",
                    description: "Search type: 'domain' (exact domain) or 'domain_with_subdomains' (includes subdomains)"
                },
                sort: {
                    type: "string",
                    enum: BACKLINKS_THREAT_SORT_FIELDS,
                    default: "lastupdate",
                    description: "Field to sort by: lastupdate, url_from, url_to, platform_type, threat_type"
                },
                order: {
                    type: "string",
                    enum: SORT_ORDER,
                    default: "desc",
                    description: "Sort order: asc or desc"
                },
                linkPerDomain: {
                    type: "integer",
                    minimum: 1,
                    description: "Maximum number of links per domain to return"
                },
                page: {
                    type: "integer",
                    description: "Page number for pagination",
                    minimum: MIN_PAGE,
                    default: 1
                },
                size: {
                    type: "integer",
                    description: "Number of results per page",
                    minimum: 1,
                    maximum: MAX_PAGE_SIZE,
                    default: DEFAULT_PAGE_SIZE
                }
            },
            required: ["query"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getThreatBacklinksSchema.parse(call.arguments);
            const result = await this.backlinksService.getThreatBacklinks(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error('Invalid parameters: ' + error.errors.map(e => e.path.join('.') + ': ' + e.message).join(', ')));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}
