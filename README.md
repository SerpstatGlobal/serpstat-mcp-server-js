# Serpstat MCP Server

[![npm version](https://badge.fury.io/js/@serpstat%2Fserpstat-mcp-server.svg)](https://badge.fury.io/js/@serpstat%2Fserpstat-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript server that integrates Serpstat SEO API with Anthropic's Model Context Protocol (MCP), enabling AI assistants like Claude to access comprehensive SEO data and analysis tools.

## Table of Contents

- [About MCP](#about-mcp)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [MCP Tools](#mcp-tools)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [API Rate Limits](#api-rate-limits)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## About MCP

The Model Context Protocol (MCP) is an open standard developed by Anthropic that enables AI assistants to securely connect to external data sources and tools. This server implements MCP to provide Claude and other compatible AI assistants with access to Serpstat's powerful SEO analytics API.

## Description

This project implements a TypeScript server that provides an API interface for working with Serpstat tools via the MCP protocol. The server supports request handling, parameter validation, logging, and working with multiple SEO analysis tools.

## Features

- 🔍 **Comprehensive SEO Analysis**: Access domain info, keyword research, competitor analysis, and backlink data
- ✅ **Input Validation**: Robust parameter validation using Zod schemas
- 📊 **Event Logging**: Detailed logging with Winston for debugging and monitoring
- ⚙️ **Flexible Configuration**: Environment-based configuration with sensible defaults
- 🧪 **Well Tested**: Jest tests for parameter validation and business logic
- 🚀 **TypeScript**: Full type safety throughout the codebase

## Prerequisites

- **Node.js 18.0.0 or higher** ([Download Node.js](https://nodejs.org/en/download/current))
- **Valid Serpstat API token** (get one from [Serpstat](https://serpstat.com/api/))
- **Compatible AI Assistant**: Claude Desktop, Gemini CLI, or any MCP-compatible client

## Installation

### Global Installation (Recommended)

```bash
npm install -g @serpstat/serpstat-mcp-server
```

### Local Installation

```bash
npm install @serpstat/serpstat-mcp-server
```

## Configuration

### Environment Variables

Set the following environment variables (can be in .env file):

- `SERPSTAT_API_TOKEN` — Your Serpstat API token (required)
- `SERPSTAT_API_URL` — Serpstat API URL (default: https://api.serpstat.com/v4)
- `LOG_LEVEL` — Logging level: error, warn, info, debug (default: info)

### Claude Desktop & Gemini CLI Configuration

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add to your Gemini CLI config:

**Linux**: `~/.gemini/settings.json`

```json
{
   "mcpServers": {
      "serpstat": {
         "command": "npx",
         "args": ["-y", "@serpstat/serpstat-mcp-server"],
         "env": {
            "SERPSTAT_API_TOKEN": "YOUR_SERPSTAT_API_TOKEN_HERE",
            "LANG": "en_US.UTF-8",
            "LC_ALL": "en_US.UTF-8"
         }
      }
   }
}
```

For local development, use the full path:

```json
{
  "mcpServers": {
    "serpstat": {
      "command": "node",
      "args": ["/path/to/node_modules/serpstat-mcp-server/dist/index.js"],
      "env": {
        "SERPSTAT_API_TOKEN": "your_serpstat_api_token_here"
      }
    }
  }
}
```

## Usage Examples

After installation and configuration in Claude Desktop, you can ask Claude:

### Domain Analysis
- "Show me domain info for **example.com**"
- "Find competitors for **my-site.com** in Google US"
- "Get top 50 keywords that **example.com** ranks for"

### Keyword Research
- "Find related keywords to **'digital marketing'**"
- "Get keyword suggestions for **'iphone 15'** excluding **'rent'** keywords"
- "Get comprehensive keyword data for **[ `iphone`, `samsung`, `googel pixel` ]** including search volume, CPC, and difficulty"

### Competitor Analysis
- "Show me competitor domains ranking for **`pizza delivery`** keyword with visibility metrics"
- "Get top search results for **`laptop computers`** keyword showing positions, domains and SERP features"
- "Get unique keywords for **domain1.com** vs **domain2.com**"

### Backlink Analysis
- "Analyze backlinks summary for **domain.com**"
- "Get anchor text analysis for **domain.com** backlinks"
- "Get active backlinks for **domain.com** showing linking pages and target URLs"
- "Get referring domains for **domain.com** with domain authority metrics"
- "Get lost backlinks for **domain.com** showing removed links and deletion dates"
- "Get top 10 anchors for **domain.com** with backlink counts and referring domains"
- "Get backlinks intersection for **domain.com** vs **competitor1.com** and **competitor2.com** showing shared referring domains"
- "Get threat backlinks for **domain.com** showing malicious links from sites flagged for security threats"

### Project Management
- "Create a new project for **example.com** named **My SEO Project**"
- "List all my projects with pagination"
- "Delete project with ID **1234567**"

### Credits & Usage Monitoring
- "Show me my audit credits statistics"
- "Check my API credits usage and remaining quota"

### Rank Tracking
- "List all my rank tracker projects"
- "Check parsing status for project **12345** in region **2840**"

### Site Audit
- "Get audit settings for project **1113915**"
- "Start site audit for project **1113915**"
- "Stop site audit for project **1113915**"

## MCP Tools

### Domain Analysis Tools

| Tool Name                | Description                                                              | Key Parameters           |
|--------------------------|--------------------------------------------------------------------------|--------------------------|
| get_domains_info         | Get SEO information for multiple domains                                 | domains, se, filters     |
| get_domain_competitors   | Get list of competitor domains                                           | domain, se, size, filters|
| get_domain_keywords      | Get keywords that domain ranks for                                       | domain, se, page, size   |
| get_domain_urls          | Get URLs within a domain and their keyword counts                        | domain, se, page, size   |
| get_domain_regions_count | Get keyword count by region for a domain                                 | domain, sort, order      |
| get_domain_uniq_keywords | Get unique keywords for two domains not ranked by a third domain         | se, domains, minusDomain |

### Keyword Research Tools

| Tool Name               | Description                                                                                      | Key Parameters             |
|-------------------------|--------------------------------------------------------------------------------------------------|----------------------------|
| get_keywords            | Get related organic keywords for a given keyword                                                 | keyword, se, filters       |
| get_related_keywords    | Get semantically related keywords with frequency, CPC, competition, and difficulty data          | keyword, se, filters, sort |
| get_keyword_suggestions | Get search suggestions for a keyword using full-text search with geographic names info           | keyword, se, filters       |
| get_keywords_info       | Get keyword overview with volume, CPC, competition, difficulty, and SERP features                | keywords, se, withIntents  |
| get_keyword_full_top    | Get Google's top-100 search results for analyzed keywords                                        | keyword, se, size          |
| get_keyword_top_urls    | Get website pages that rank for the largest amount of analyzed keyword variations                | keyword, se, page, page_size|
| get_keyword_competitors | Get domains that rank for the given keyword in Google top-20 results with competitor analysis    | keyword, se, filters, sort |
| get_keyword_top         | Get Google's top-100 search results for the analyzed keyword with position, URL, and SERP features| keyword, se, filters, size |

### URL Analysis Tools

| Tool Name                 | Description                                                                                        | Key Parameters           |
|---------------------------|---------------------------------------------------------------------------------------------------|--------------------------|
| get_url_summary_traff     | Get traffic and keyword statistics for website pages matching a specific URL mask                | se, domain, urlContains  |
| get_url_competitors       | Get list of URL competitors showing domains competing for same keywords in top-10 results        | se, url, sort, page      |
| get_url_keywords          | Get keywords for which specified URL ranks in top-100 Google and top-50 Bing search results     | se, url, filters, sort   |
| get_url_missing_keywords  | Get keywords that competitors rank for but the given URL does not, identifying keyword gaps      | url, se, filters, sort   |

### Backlinks Analysis Tools

| Tool Name                  | Description                                                                                   | Key Parameters               |
|----------------------------|-----------------------------------------------------------------------------------------------|------------------------------|
| get_backlinks_summary      | Get comprehensive backlinks summary with referring domains, quality metrics, and changes      | domain, subdomain            |
| get_anchors                | Get anchor text analysis for backlinks with metrics on referring domains and backlinks        | query, searchType, anchor, sort|
| get_active_backlinks       | Get a list of active backlinks showing linking pages, target pages, and link attributes       | query, searchType, sort, page|
| get_referring_domains      | Get a list of referring domains with domain rank metrics and referring pages count            | query, searchType, sort, page|
| get_lost_backlinks         | Get a list of lost backlinks showing linking pages, target pages, and deletion dates          | query, searchType, sort, page|
| get_top_pages_by_backlinks | Get a list of top pages by backlinks with various filtering and sorting parameters            | query, searchType, sort, size|
| get_top10_anchors          | Get TOP-10 anchors with the number of backlinks and referring domains                         | query, searchType            |
| get_backlinks_intersection | Get backlinks from domains that link to multiple analyzed sites for competitive analysis      | query, intersect, sort, page |
| get_active_outlinks        | Get active outbound links from a domain or URL with target URLs and anchor text               | query, searchType, sort, filters|
| get_active_outlink_domains | Get external domains that receive outbound links from analyzed domain                         | query, searchType, sort, filters|
| get_threat_backlinks       | Get malicious backlinks pointing to analyzed domain from sites flagged for security threats   | query, searchType, sort, filters|

### Project Management Tools

| Tool Name      | Description                                                                    | Key Parameters       |
|----------------|--------------------------------------------------------------------------------|----------------------|
| create_project | Create a new project in Serpstat for tracking SEO metrics and site audits     | domain, name, groups |
| delete_project | Delete an existing project from Serpstat by project ID                        | project_id           |
| list_projects  | Retrieve a list of projects associated with the account with pagination       | page, size           |

### Credits & Usage Monitoring Tools

| Tool Name                   | Description                                                                                  | Key Parameters |
|-----------------------------|----------------------------------------------------------------------------------------------|----------------|
| get_credits_for_audit_stats | Check available audit credits (one-page audit, JavaScript scanning, crawl limits) *No cost* | none           |
| get_credits_stats           | Check API credits usage, account info, and browser plugin limits *No cost*                  | none           |

### Rank Tracking Tools

| Tool Name                           | Description                                                                                      | Key Parameters                |
|-------------------------------------|--------------------------------------------------------------------------------------------------|-------------------------------|
| get_rt_projects_list                | Get rank tracker projects with ID, name, domain, creation date, and tracking status *No cost*   | page, pageSize                |
| get_rt_project_status               | Check if rank tracker project is parsing (true=processing, false=ready) *No cost*               | projectId, regionId           |
| get_rt_project_regions_list         | Get list of regions for a rank tracker project with status, SERP type, device, and location *No cost* | projectId                    |
| get_rt_project_keyword_serp_history | Get Google's top-100 SERP history for rank tracker keywords with positions and URLs *No cost*   | projectId, projectRegionId, page|
| get_rt_project_url_serp_history     | Get ranking history of URLs for rank tracker keywords with historical position data *No cost*   | projectId, projectRegionId, page|

### Site Audit Tools

| Tool Name                   | Description                                                                                                                      | Key Parameters              |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| get_site_audit_settings                 | Get audit settings for a project including scan parameters, scheduling, and error thresholds *No cost*                          | projectId                        |
| set_site_audit_settings                 | Update audit settings for a project with scan configuration, scheduling, and notifications *No cost*                            | projectId, mainSettings, ...     |
| start_site_audit                        | Start audit session for a project and receive reportId for tracking progress (1 credit/page, 10 credits/page with JS rendering) | projectId                        |
| stop_site_audit                         | Stop active audit session for a project *No cost*                                                                               | projectId                        |
| get_site_audit_results_by_categories    | Get audit results statistics grouped by issue categories (pages status, meta tags, links, etc.) *No cost*                       | reportId                         |
| get_site_audit_history                  | Get historical error count data for a specific error type across multiple audit reports *No cost*                               | projectId, errorName, limit, offset |
| get_site_audits_list                    | Get list of all audit reports for a project with summary statistics and progress information *No cost*                          | projectId, limit, offset         |
| get_site_audit_scanned_urls_list        | Get list of URLs that will be scanned based on project scan settings *No cost*                                                  | projectId                        |
| get_site_audit_project_default_settings | Get default audit settings template to use when creating new projects *No cost*                                                 | -                                |
| get_site_audit_bref_info                | Get essential summary information from latest audit including SDO score, issue counts by priority, scan progress, and completion status *No cost* | reportId                         |
| get_site_audit_deteailed_report         | Get number of errors categorized by type with comparison to previous report showing countAll, countNew, and countFixed *No cost* | reportId, compareReportId (optional) |
| get_site_audit_pages_spec_errors        | Get list of all pages where a specific error was detected with filtering by mode (all/new/solved) and pagination support *No cost* | reportId, compareReportId, projectId, errorName, mode, limit, offset |
| get_site_audit_elements_with_issues     | Get list of sub-elements (URLs) containing specific errors using CRC from get_site_audit_pages_spec_errors response *No cost*  | reportId, projectId, errorName, crc, compareReportId (optional), mode, limit, offset |

### One Page Audit Tools

| Tool Name                      | Description                                                                                                                      | Key Parameters              |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------|-----------------------------|
| page_audit_start_scan          | Scan a single webpage with JavaScript rendering. Returns pageId and reportId for tracking. Use page_audit_get_reports_for_page to check progress via status and progress fields (10 credits per scan) | name, url, userAgent (recommended: 0 for Chrome), httpAuthLogin (optional), httpAuthPass (optional) |
| page_audit_get_last_scans      | Get list of all one-page audit projects with pageId, url, name, status, lastActiveReport (latest scan results with SDO score), finishedReportCount, settings *No cost* | limit (optional, default 30), offset (optional, default 0), teamMemberId (optional) |
| page_audit_get_reports_for_page | Get history of all audit reports for a specific page with reportId, auditDate, status (1=in progress, 3=finalizing, 4=completed), SDO score (0-100), error counts, progress (0-100) *No cost* | pageId, limit (optional), offset (optional) |
| page_audit_get_results_report  | Get detailed audit results with categories array (errors grouped by meta_tags, headings, content, multimedia, https, pagespeed_desktop/mobile, etc), hasAdditionRows flag for drill-down availability *No cost* | pageId (from page_audit_get_last_scans or page_audit_start_scan) |
| page_audit_rescan              | Rescan existing one-page audit project and create new audit report. Returns reportId. Track progress via page_audit_get_reports_for_page (10 credits per rescan) | pageId, name, userAgent (recommended: 0 for Chrome), httpAuthLogin (optional), httpAuthPass (optional) |
| page_audit_stop                | Stop active one-page audit scan. Returns boolean indicating success *No cost*                                                   | pageId                      |
| page_audit_delete              | Remove one-page audit project from customer project list permanently. Returns boolean *No cost*                                 | pageId                      |
| page_audit_get_report_by_categories | Get audit results by categories for specific report. Use compareReportId to see countNew (errors added) and countFixed (errors resolved) *No cost* | reportId, compareReportId (optional, enables change tracking) |
| page_audit_report_drill_down   | Get detailed problematic elements list. ONLY works for errors with hasAdditionRows=true. Response varies by error type (e.g., image URLs for multimedia errors) *No cost* | reportId, error (must match error.key), mode (all/new/solved, optional), compareReportId (optional), page (optional), size (optional, max 1000) |
| page_audit_get_scan_names      | Get list of all one-page audit project names with pageId, name, url, finishedReportCount for project discovery *No cost*       | teamMemberId (optional)     |
| page_audit_scan_logs           | Get chronological log of scan events with message (event name), type (info/warning/error), params (event-specific data or []), created_at timestamp for debugging *No cost* | reportId (optional, all scans if not specified), page (optional, default 0), pageSize (optional, default 100) |

### Search Engines (se parameter)

Common search engine codes:
- `g_us` - Google USA
- `g_uk` - Google United Kingdom
- `g_ca` - Google Canada
- `g_au` - Google Australia
- `g_de` - Germany
- `g_fr` - Google France
- `g_es` - Google Spain
- `g_it` - Google Italy
- `g_pl` - Google Poland
- `g_ua` - Google Ukraine

See a full list of [Search Engines Short Names](https://api-docs.serpstat.com/docs/serpstat-public-api/ba97ni814ao9p-search-engine-short-names)

## Troubleshooting

### Common Issues

**"Command not found: serpstat-mcp-server"**
- Make sure you installed the package globally with `-g` flag
- Verify your PATH includes npm global binaries: `npm config get prefix`
- Try reinstalling: `npm uninstall -g @serpstat/serpstat-mcp-server && npm install -g @serpstat/serpstat-mcp-server`

**"API token error" or "Unauthorized"**
- Check that `SERPSTAT_API_TOKEN` is set correctly in your environment
- Verify your token is valid and active in your Serpstat account
- Ensure your token has sufficient API credits and permissions

**"Module not found" errors**
- Make sure all dependencies are installed: `npm install`
- Try rebuilding: `npm run clean && npm run build`

**Claude Desktop doesn't recognize the server**
- Restart Claude Desktop after configuration changes
- Check the config file path and JSON syntax
- Verify the server starts correctly: run `serpstat-mcp-server` in terminal

**"Can't find npx"**
- You need to install Node.js - [download and install Node.js](https://nodejs.org/en/download/current)

**Rate limit errors**
- Most Serpstat plans have 1 RPS (1 request per second) limit
- Wait between requests or contact Serpstat support for higher limits
- Check your API usage in the Serpstat dashboard

### Debug Mode

Enable debug logging by setting:

```bash
export LOG_LEVEL=debug
```

Or in your Claude Desktop config:

```json
{
   "mcpServers": {
      "serpstat": {
         "command": "npx",
         "args": ["-y", "@serpstat/serpstat-mcp-server"],
         "env": {
            "SERPSTAT_API_TOKEN": "YOUR_TOKEN_HERE",
            "LANG": "en_US.UTF-8",
            "LC_ALL": "en_US.UTF-8",
            "LOG_LEVEL": "debug"
         }
      }
   }
}
```

## Development

### Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:SerpstatGlobal/serpstat-mcp-server-js.git
   cd serpstat-mcp-server-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Serpstat API token
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. For development mode (auto-reload):
   ```bash
   npm run dev
   ```

### Testing

To run tests:

```bash
npm test
```

Run specific test file:

```bash
npx jest src/__tests__/services/keyword_tools.test.ts
```

Run specific test by name:

```bash
npx jest --testNamePattern="methodName"
```

### Scripts

- `npm run build` — Compile TypeScript sources to JavaScript (output in `dist/`)
- `npm start` — Run the compiled server from `dist/`
- `npm run dev` — Run the server in development mode with hot-reload
- `npm test` — Run all tests
- `npm run lint` — Run linting
- `npm run clean` — Clean build directory

## Project Structure

```
serpstat-mcp-server/
├── src/
│   ├── index.ts          # Entry point
│   ├── server.ts         # Main MCP server
│   ├── handlers/         # Tool handlers
│   ├── services/         # Services for Serpstat API
│   ├── types/            # Data types
│   ├── utils/            # Utilities (config, logger, validation)
│   └── __tests__/        # Tests
├── dist/                 # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
├── README.md
└── .env.example
```

## API Rate Limits

By default, most Serpstat plans have **1 RPS (1 request per second)** - this is sufficient for most tasks. If you need higher throughput, contact Serpstat support to discuss plan upgrades.

**Important**: The server respects rate limits automatically. If you encounter rate limit errors, wait before making additional requests.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

### Development Guidelines

- Follow existing code style and TypeScript conventions
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all linting passes: `npm run lint`

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.

## Support

- 📖 [Serpstat API Documentation](https://api-docs.serpstat.com/docs/serpstat-public-api/jenasqbwtxdlr-introduction-to-serpstat-api)
- 🐛 [Report Issues](https://github.com/SerpstatGlobal/serpstat-mcp-server-js/issues)

The most effective way to receive support from Serpstat is to use their live chat feature directly within the platform. Alternatively, you can email them at support@serpstat.com.

## Acknowledgments

- [Model Context Protocol](https://github.com/modelcontextprotocol) by Anthropic
- [Serpstat API](https://serpstat.com/api/) for SEO data services

## License

MIT License

This project is under MIT license, which means you can copy, use, modify, and even sell any part of this code without any hassle.

- See the [LICENSE](LICENSE) file for details
- Want to grab a chunk for your project? Go for it
- Want to rewrite half of it and ship a commercial product? Be my guest
- The only thing you need to do is not delete the copyright and the license itself from the files you take, and remember the Serpstat team with a kind word when you get that paycheck

_With love, Serpstat R&D Team_