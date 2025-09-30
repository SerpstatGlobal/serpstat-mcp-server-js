import { BaseHandler } from './base.js';
import { CreditsService } from '../services/credits_service.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { getAuditStatsSchema, getCreditsStatsSchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';

export class GetAuditStatsHandler extends BaseHandler {
    private creditsService: CreditsService;

    constructor() {
        super();
        const config = loadConfig();
        this.creditsService = new CreditsService(config);
    }

    getName(): string {
        return 'get_credits_for_audit_stats';
    }

    getDescription(): string {
        return 'Check available audit credits including one-page audit, JavaScript scanning, and page crawl limits. Use this before running site audits to verify available resources. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {},
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            // @ts-ignore
            const params = getAuditStatsSchema.parse(call.arguments);
            const result = await this.creditsService.getAuditStats();
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class GetCreditsStatsHandler extends BaseHandler {
    private creditsService: CreditsService;

    constructor() {
        super();
        const config = loadConfig();
        this.creditsService = new CreditsService(config);
    }

    getName(): string {
        return 'get_credits_stats';
    }

    getDescription(): string {
        return 'Check available API credits, usage statistics, account information, and browser plugin limits. Perfect for monitoring API usage and planning resource-heavy operations. This method does not consume API credits.';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {},
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getCreditsStatsSchema.parse(call.arguments);
            const result = await this.creditsService.getCreditsStats();
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}