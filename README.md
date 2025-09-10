# Serpstat MCP Server

[![npm version](https://badge.fury.io/js/@serpstat%2Fserpstat-mcp-server.svg)](https://badge.fury.io/js/@serpstat%2Fserpstat-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Server for integrating Serpstat API with Model Context Protocol (MCP).

## Description

This project implements a TypeScript server that provides an API interface for working with Serpstat tools via the MCP protocol. The server supports request handling, parameter validation, logging, and working with multiple tools.

## Features

- Retrieve domain information via Serpstat API
- Input parameter validation using Zod
- Event logging with Winston
- Flexible configuration via environment variables
- Jest tests for parameter and logic validation

## Requirements

- Node.js 18.0.0 or higher
- Valid Serpstat API token

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

### Claude Desktop & Gemini Cli Configuration

Add to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
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
            "SERPSTAT_API_TOKEN": "XXXXXXXXXXXPLACETOKENHEREXXXXXXXXXXXXX",
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

- "Show me domain info for example.com"
- "Find competitors for my-site.com in Google US"
- "Get top 50 keywords that example.com ranks for"
- "Analyze backlinks summary for domain.com"
- "Find related keywords to 'digital marketing'"
- "Get unique keywords for domain1.com vs domain2.com"

## Development

### Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:SerpstatGlobal/serpstat-mcp-server-js.git
   cd serpstat-mcp-server
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

## MCP Tools

| Tool Name                 | Description                                                                                   | Key Parameters              |
|---------------------------|-----------------------------------------------------------------------------------------------|-----------------------------|
| get_domains_info          | Get SEO information for multiple domains                                                      | domains, se, filters        |
| get_domain_competitors    | Get list of competitor domains                                                                | domain, se, size, filters   |
| get_domain_keywords       | Get keywords that domain ranks for                                                            | domain, se, page, size      |
| get_domain_urls           | Get URLs within a domain and their keyword counts                                             | domain, se, page, size      |
| get_domain_regions_count  | Get keyword count by region for a domain                                                      | domain, sort, order         |
| get_domain_uniq_keywords  | Get unique keywords for two domains not ranked by a third domain                             | se, domains, minusDomain    |
| get_keywords              | Get related organic keywords for a given keyword                                              | keyword, se, filters        |
| get_backlinks_summary     | Get comprehensive backlinks summary with referring domains, quality metrics, and changes     | domain, subdomain           |
| get_related_keywords      | Get semantically related keywords with frequency, CPC, competition, and difficulty data      | keyword, se, filters, sort  |

### Search Engines (se parameter)

Common search engine codes:
- `g_us` - Google USA
- `g_uk` - Google United Kingdom
- `g_ca` - Google Canada
- `g_au` - Google Australia
- `g_de` - Google Germany
- `g_fr` - Google France
- `g_es` - Google Spain
- `g_it` - Google Italy

See a full list of [Search Engines Short Names](https://api-docs.serpstat.com/docs/serpstat-public-api/ba97ni814ao9p-search-engine-short-names)

## Troubleshooting

### Common Issues

**"Command not found: serpstat-mcp-server"**
- Make sure you installed the package globally with `-g` flag
- Verify your PATH includes npm global binaries: `npm config get prefix`
- Try reinstalling: `npm uninstall -g serpstat-mcp-server && npm install -g serpstat-mcp-server`

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

**"Can't found npx"**
- you need to install NodeJS -  [download and install NodeJS] (https://nodejs.org/en/download/current) 

### Debug Mode

Enable debug logging by setting:
```bash
export LOG_LEVEL=debug
```

Or in your Claude Desktop config for linux:
```json
{
   "mcpServers": {
      "serpstat": {
         "command": "npx",
         "args": ["-y", "@serpstat/serpstat-mcp-server"],
         "env": {
            "SERPSTAT_API_TOKEN": "XXXXXXXXXXXPLACETOKENHEREXXXXXXXXXXXXX",
            "LANG": "en_US.UTF-8",
            "LC_ALL": "en_US.UTF-8",
            "LOG_LEVEL": "debug"
         }
      }
   }
}
```

## API Rate Limits

By default, most Serpstat Plans have 1RPS (1 request per second) - this is quite enough for most tasks.
If you found that you need go faster - contact Serpstat Support 


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

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.

## Support

- 📖 [Serpstat API Documentation](https://api-docs.serpstat.com/docs/serpstat-public-api/jenasqbwtxdlr-introduction-to-serpstat-api)
- 🐛 [Report Issues](https://github.com/SerpstatGlobal/serpstat-mcp-server-js/issues)

The most effective way to receive support from Serpstat is to use their live chat feature directly within the platform.
Alternatively, you can email them at support@serpstat.com

## Acknowledgments

- [Model Context Protocol](https://github.com/modelcontextprotocol) by Anthropic
- [Serpstat API](https://serpstat.com/api/) for SEO data services

## License

MIT License

- This project is under MIT license, which means you can copy, use, modify, and even sell any part of this code without any hassle.
- See the [LICENSE](LICENSE) file for details.
- Want to grab a chunk for your project? Go for it.
- Want to rewrite half of it and ship a commercial product? Be my guest.
- The only thing you need to do is not delete the copyright and the license itself from the files you take, and remember the Serpstat team with a kind word when you get that paycheck.

_With love, Serpstat R&D Team_