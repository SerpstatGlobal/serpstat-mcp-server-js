import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BaseHandler } from './handlers/base';
import { DomainsInfoHandler, CompetitorsHandler, DomainKeywordsHandler, DomainUrlsHandler, DomainRegionsCountHandler, GetDomainUniqKeywordsHandler } from './handlers/domain_tools';
import { BacklinksSummaryHandler } from './handlers/backlinks_tools';
import { GetKeywordsHandler } from './handlers/keyword_tools';
import { logger } from './utils/logger';

export class SerpstatMCPServer {
    private server: Server;
    private handlers: Map<string, BaseHandler>;

    constructor() {
        this.server = new Server(
            {
                name: 'serpstat-mcp-server',
                version: '1.0.0',
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
            // Add more handlers here as you expand the API
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

            // args может быть undefined, передаем пустой объект
            const result = await handler.handle({ name, arguments: args ?? {} });

            logger.info(`Tool call completed: ${name}`, {
                success: !result.isError,
                responseLength: result.content?.[0]?.text?.length
            });

            // Приведение к ожидаемому типу
            return { ...result };
        });
    }

    async start(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        logger.info('Serpstat MCP Server started and listening on stdio');
    }
}