import { BaseHandler, ToolAnnotations } from './base.js';
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
        return 'CHECK audit credits. USE WHEN: before running audits, checking limits. Returns: one-page audit credits, JS scanning credits, page crawl limits.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get Audit Credits Stats', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
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
        return 'CHECK API credits and usage stats. USE WHEN: monitoring usage, before expensive operations. Returns: credits balance, usage stats, account info.';
    }

    getAnnotations(): ToolAnnotations {
        return { title: 'Get API Credits Stats', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };
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