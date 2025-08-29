import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { logger } from '../utils/logger.js';

export abstract class BaseHandler {
    abstract getName(): string;
    abstract getDescription(): string;
    abstract getInputSchema(): object;
    abstract handle(call: MCPToolCall): Promise<MCPToolResponse>;

    protected createSuccessResponse(data: any): MCPToolResponse {
        return {
            content: [{
                type: "text",
                text: JSON.stringify(data, null, 2)
            }]
        };
    }

    protected createErrorResponse(error: Error): MCPToolResponse {
        logger.error(`Tool ${this.getName()} error:`, error);
        return {
            content: [{
                type: "text",
                text: `Error: ${error.message}`
            }],
            isError: true
        };
    }
}