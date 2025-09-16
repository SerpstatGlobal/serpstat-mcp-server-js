import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BaseHandler } from './handlers/base.js';
import { DomainsInfoHandler, CompetitorsHandler, DomainKeywordsHandler, DomainUrlsHandler, DomainRegionsCountHandler, GetDomainUniqKeywordsHandler } from './handlers/domain_tools.js';
import { BacklinksSummaryHandler } from './handlers/backlinks_tools.js';
import { GetKeywordsHandler, GetRelatedKeywordsHandler, GetKeywordsInfoHandler, GetKeywordSuggestionsHandler, GetKeywordFullTopHandler, GetKeywordTopUrlsHandler } from './handlers/keyword_tools.js';
import { logger } from './utils/logger.js';

export class SerpstatMCPServer {
    private server: Server;
    private handlers: Map<string, BaseHandler>;

    constructor() {
        this.server = new Server(
            {
                name: 'serpstat-mcp-server',
                version: '1.0.3',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.handlers = new Map();
        this.setupHandlers();
        this.setupRoutes();
    }

    private setupHandlers(): void {
        const handlers = [
            new DomainsInfoHandler(),
            new CompetitorsHandler(),
            new DomainKeywordsHandler(),
            new DomainUrlsHandler(),
            new BacklinksSummaryHandler(),
            new DomainRegionsCountHandler(),
            new GetDomainUniqKeywordsHandler(),
            new GetKeywordsHandler(),
            new GetRelatedKeywordsHandler(),
            new GetKeywordsInfoHandler(),
            new GetKeywordSuggestionsHandler(),
            new GetKeywordFullTopHandler(),
            new GetKeywordTopUrlsHandler(),
        ];

        for (const handler of handlers) {
            this.handlers.set(handler.getName(), handler);
        }

        logger.info(`Registered ${handlers.length} tool handlers`);
    }

    private setupRoutes(): void {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools = Array.from(this.handlers.values()).map(handler => ({
                name: handler.getName(),
                description: handler.getDescription(),
                inputSchema: handler.getInputSchema(),
            }));

            logger.debug(`Listing ${tools.length} available tools`);
            return { tools };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            logger.info(`Tool call received: ${name}`, { arguments: args });

            const handler = this.handlers.get(name);
            if (!handler) {
                throw new Error(`Unknown tool: ${name}`);
            }

            const result = await handler.handle({ name, arguments: args ?? {} });

            logger.info(`Tool call completed: ${name}`, {
                success: !result.isError,
                responseLength: result.content?.[0]?.text?.length
            });

            return { ...result };
        });
    }

    async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        logger.info('Serpstat MCP Server started and listening on stdio');
    }
}