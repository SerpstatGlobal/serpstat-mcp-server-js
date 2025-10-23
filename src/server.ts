import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BaseHandler } from './handlers/base.js';
import { DomainsInfoHandler, CompetitorsHandler, DomainKeywordsHandler, DomainUrlsHandler, DomainRegionsCountHandler, GetDomainUniqKeywordsHandler } from './handlers/domain_tools.js';
import { BacklinksSummaryHandler, GetAnchorsHandler, GetActiveBacklinksHandler, GetReferringDomainsHandler, GetLostBacklinksHandler, GetTopAnchorsHandler, GetTopPagesByBacklinksHandler, GetBacklinksIntersectionHandler, GetActiveOutlinksHandler, GetActiveOutlinkDomainsHandler, GetThreatBacklinksHandler } from './handlers/backlinks_tools.js';
import { GetKeywordsHandler, GetRelatedKeywordsHandler, GetKeywordsInfoHandler, GetKeywordSuggestionsHandler, GetKeywordFullTopHandler, GetKeywordTopUrlsHandler, GetKeywordCompetitorsHandler, GetKeywordTopHandler } from './handlers/keyword_tools.js';
import { GetUrlSummaryTrafficHandler, GetUrlCompetitorsHandler, GetUrlKeywordsHandler, GetUrlMissingKeywordsHandler } from './handlers/url_tools.js';
import { CreateProjectHandler, DeleteProjectHandler, ListProjectsHandler } from './handlers/project_tools.js';
import { GetAuditStatsHandler, GetCreditsStatsHandler } from './handlers/credits_tools.js';
import { GetRtProjectsListHandler, GetRtProjectStatusHandler, GetRtProjectRegionsListHandler, GetRtProjectKeywordSerpHistoryHandler, GetRtProjectUrlSerpHistoryHandler } from './handlers/rank_tracking_tools.js';
import { GetSiteAuditSettingsHandler, SetSiteAuditSettingsHandler, StartSiteAuditHandler, StopSiteAuditHandler, GetCategoriesStatisticHandler, GetHistoryByCountErrorHandler, GetSiteAuditsListHandler, GetScanUserUrlListHandler, GetDefaultSettingsHandler, GetBasicInfoHandler, GetReportWithoutDetailsHandler, GetErrorElementsHandler, GetSubElementsByCrcHandler } from './handlers/site_audit_tools.js';
import {
    StartOnePageAuditScanHandler,
    GetOnePageAuditsListHandler,
    GetOnePageReportsListHandler,
    GetOnePageAuditResultsHandler,
    RescanOnePageAuditHandler,
    StopOnePageAuditHandler,
    RemoveOnePageAuditHandler,
    GetOnePageAuditByCategoriesHandler,
    GetOnePageAuditErrorRowsHandler,
    GetOnePageAuditPageNamesHandler,
    GetOnePageAuditUserLogHandler
} from './handlers/one_page_audit_tools.js';
import { logger } from './utils/logger.js';

export class SerpstatMCPServer {
    private server: Server;
    private handlers: Map<string, BaseHandler>;

    constructor() {
        this.server = new Server(
            {
                name: 'serpstat-mcp-server',
                version: '1.1.2',
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
        // Get enabled categories from environment variable
        const enabledCategoriesEnv = process.env.SERPSTAT_ENABLED_CATEGORIES;
        const enabledCategories = enabledCategoriesEnv
            ? enabledCategoriesEnv.split(',').map(c => c.trim().toLowerCase())
            : null; // null means all categories enabled

        // Define handlers by category
        const handlersByCategory: Record<string, BaseHandler[]> = {
            domain: [
                new DomainsInfoHandler(),
                new CompetitorsHandler(),
                new DomainKeywordsHandler(),
                new DomainUrlsHandler(),
                new DomainRegionsCountHandler(),
                new GetDomainUniqKeywordsHandler(),
            ],
            keywords: [
                new GetKeywordsHandler(),
                new GetRelatedKeywordsHandler(),
                new GetKeywordsInfoHandler(),
                new GetKeywordSuggestionsHandler(),
                new GetKeywordFullTopHandler(),
                new GetKeywordTopUrlsHandler(),
                new GetKeywordCompetitorsHandler(),
                new GetKeywordTopHandler(),
            ],
            backlinks: [
                new BacklinksSummaryHandler(),
                new GetAnchorsHandler(),
                new GetActiveBacklinksHandler(),
                new GetReferringDomainsHandler(),
                new GetLostBacklinksHandler(),
                new GetTopAnchorsHandler(),
                new GetTopPagesByBacklinksHandler(),
                new GetBacklinksIntersectionHandler(),
                new GetActiveOutlinksHandler(),
                new GetActiveOutlinkDomainsHandler(),
                new GetThreatBacklinksHandler(),
            ],
            url: [
                new GetUrlSummaryTrafficHandler(),
                new GetUrlCompetitorsHandler(),
                new GetUrlKeywordsHandler(),
                new GetUrlMissingKeywordsHandler(),
            ],
            projects: [
                new CreateProjectHandler(),
                new DeleteProjectHandler(),
                new ListProjectsHandler(),
            ],
            credits: [
                new GetAuditStatsHandler(),
                new GetCreditsStatsHandler(),
            ],
            rt: [
                new GetRtProjectsListHandler(),
                new GetRtProjectStatusHandler(),
                new GetRtProjectRegionsListHandler(),
                new GetRtProjectKeywordSerpHistoryHandler(),
                new GetRtProjectUrlSerpHistoryHandler(),
            ],
            audit: [
                new GetSiteAuditSettingsHandler(),
                new SetSiteAuditSettingsHandler(),
                new StartSiteAuditHandler(),
                new StopSiteAuditHandler(),
                new GetCategoriesStatisticHandler(),
                new GetHistoryByCountErrorHandler(),
                new GetSiteAuditsListHandler(),
                new GetScanUserUrlListHandler(),
                new GetDefaultSettingsHandler(),
                new GetBasicInfoHandler(),
                new GetReportWithoutDetailsHandler(),
                new GetErrorElementsHandler(),
                new GetSubElementsByCrcHandler(),
            ],
            'page-audit': [
                new StartOnePageAuditScanHandler(),
                new GetOnePageAuditsListHandler(),
                new GetOnePageReportsListHandler(),
                new GetOnePageAuditResultsHandler(),
                new RescanOnePageAuditHandler(),
                new StopOnePageAuditHandler(),
                new RemoveOnePageAuditHandler(),
                new GetOnePageAuditByCategoriesHandler(),
                new GetOnePageAuditErrorRowsHandler(),
                new GetOnePageAuditPageNamesHandler(),
                new GetOnePageAuditUserLogHandler(),
            ],
        };

        // Collect handlers based on enabled categories
        const handlers: BaseHandler[] = [];

        if (enabledCategories === null) {
            // No filter - add all handlers
            for (const categoryHandlers of Object.values(handlersByCategory)) {
                handlers.push(...categoryHandlers);
            }
            logger.info('All categories enabled');
        } else {
            // Filter by enabled categories
            for (const category of enabledCategories) {
                if (handlersByCategory[category]) {
                    handlers.push(...handlersByCategory[category]);
                } else {
                    logger.warn(`Unknown category: ${category}`);
                }
            }
            logger.info(`Enabled categories: ${enabledCategories.join(', ')}`);
        }

        // Register handlers
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