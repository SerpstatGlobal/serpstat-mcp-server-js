import { BaseHandler } from './base.js';
import { BacklinksService } from '../services/backlinks_tools.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { backlinksSummarySchema, BacklinksSummaryParams } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import { SEARCH_TYPES, DOMAIN_NAME_REGEX } from '../utils/constants.js';

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
