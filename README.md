# Serpstat MCP Server

Server for integrating Serpstat with Model Context Protocol (MCP).

## Description

This project implements a TypeScript server that provides an API interface for working with Serpstat tools via the MCP protocol. The server supports request handling, parameter validation, logging, and working with multiple tools.

## Features
- Retrieve domain information via Serpstat API
- Input parameter validation using Zod
- Event logging with Winston
- Flexible configuration via environment variables
- Jest tests for parameter and logic validation

## Project Structure
- `src/index.ts` — entry point
- `src/server.ts` — main MCP server
- `src/handlers/` — tool handlers
- `src/services/` — services for Serpstat API
- `src/types/` — data types
- `src/utils/` — utilities (config, logger, validation)
- `src/__tests__/` — tests

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables (can be in .env):
   - `SERPSTAT_API_TOKEN` — Serpstat token
   - `SERPSTAT_API_URL` — Serpstat API URL (default: https://api.serpstat.com/v4)
   - `LOG_LEVEL` — logging level (error, warn, info, debug)
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. For development mode (auto-reload):
   ```bash
   npm run dev
   ```

## Testing

To run tests:
```bash
npm test
```

## Scripts

- `npm run build` — compile TypeScript sources to JavaScript (output in `dist/`)
- `npm start` — run the compiled server from `dist/`
- `npm run dev` — run the server in development mode with hot-reload
- `npm test` — run all tests

## MCP Tools

| Name                      | Description                                                                                                                                                                 | Parameters (main)                 |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| get_domains_info          | Get SEO info for multiple domains                                                                                                                                           | domains, se, filters              |
| get_domain_competitors    | Get list of competitor domains                                                                                                                                              | domain, se, size, filters         |
| get_domain_keywords       | Get keywords that domain ranks for                                                                                                                                          | domain, se, page, size, filters   |
| get_domain_urls           | Get URLs within a domain and keyword count                                                                                                                                  | domain, se, page, size, filters   |
| get_domain_regions_count  | Get keyword count by region for a domain                                                                                                                                    | domain, sort, order               |
| get_domain_uniq_keywords  | Get unique keywords for two domains not ranked by a third domain            | se, domains, minusDomain, filters |
| get_keywords              | Get related organic keywords for a given keyword                            | keyword, se, filters              |
| get_backlinks_summary      | Get comprehensive backlinks summary using Serpstat API. Returns referring domains, backlinks count, link types, quality metrics and recent changes for domain or subdomain. |
| get_related_keywords      | Get all search queries semantically related to the given keyword. Returns frequency, CPC, competition, difficulty, weight, intents, etc. for each found keyword. | keyword, se, filters, sort, page, size |

## License

MIT
