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

| Method name              | Description                                                                                                                        |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| get_domains_info         | Get comprehensive SEO information for multiple domains including visibility, keywords, traffic, and dynamics                        |
| get_domain_competitors | Get a list of competitor domains for a given domain, including visibility, traffic, and relevance.                                 |
| get_domain_keywords      | Get keywords that domain ranks for in Google search results. Includes position, traffic, difficulty analysis with comprehensive SEO insights and performance metrics. |
| get_domain_urls          | Get URLs within a domain and keyword count for each URL. Analyze URL structure, performance distribution, and identify top-performing pages. Each URL costs 1 API credit, minimum 1 credit per request. |
| get_backlinks_summary    | Get comprehensive backlinks summary using Serpstat API. Returns referring domains, backlinks count, link types, quality metrics and recent changes for domain or subdomain. |
| get_domain_regions_count | Analyze domain keyword presence across all Google regional databases. Shows keyword count by country, regional performance comparison and international SEO insights. Start every complex domain analysis with this tool. |

## License

MIT
