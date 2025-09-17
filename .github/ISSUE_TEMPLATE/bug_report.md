---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

---
name: Bug Report
about: Report a bug in Serpstat MCP Server JS
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Bug Description
**What happened?**
A clear and concise description of the bug.

**What did you expect to happen?**
A clear and concise description of what you expected to happen instead.

## Environment Information
**System:**
- Operating System: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- Node.js version: [e.g., 18.17.0, 20.10.0]
- npm version: [e.g., 9.6.7, 10.2.4]
- Package version: [e.g., @serpstat/serpstat-mcp-server@1.0.0]

**Installation method:**
- [ ] Global npm install (`npm install -g @serpstat/serpstat-mcp-server`)
- [ ] Local npm install (`npm install @serpstat/serpstat-mcp-server`)
- [ ] Built from source
- [ ] Other: [please specify]

**MCP Client:**
- [ ] Claude Desktop (version: ___)
- [ ] Gemini CLI (version: ___)
- [ ] Custom MCP client (specify: ___)
- [ ] Other: [please specify]

**Client configuration location:**
- [ ] macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- [ ] Windows: `%APPDATA%/Claude/claude_desktop_config.json`
- [ ] Linux: `~/.config/Claude/claude_desktop_config.json`
- [ ] Gemini: `~/.gemini/settings.json`
- [ ] Other: [please specify]

## Serpstat API Configuration
**API Settings:**
- Serpstat API endpoint: [default: https://api.serpstat.com/v4 or custom]
- API token configured: [Yes/No - don't share the actual token]
- Log level: [e.g., info, debug, error]

**Environment variables:**
```bash
SERPSTAT_API_TOKEN=xxx...xxx  # Don't share real token
SERPSTAT_API_URL=https://api.serpstat.com/v4
LOG_LEVEL=info
```

## Reproduction Steps
**MCP Tool used:** [e.g., get_domains_info, get_domain_keywords, get_keywords_info]

**Parameters used:**
```json
{
  "domain": "example.com",
  "se": "g_us",
  "page": 1,
  "size": 50
}
```

**Steps to reproduce:**
1. Start MCP server: `npx @serpstat/serpstat-mcp-server`
2. Connect from [Claude Desktop/Gemini CLI]
3. Execute query: [e.g., "Show me domain info for example.com"]
4. Observe the error

**Is this issue reproducible?**
- [ ] Always
- [ ] Sometimes
- [ ] Rarely
- [ ] Only once

## Error Information
**Error message:**
```
Paste the exact error message here
```

**Console output/logs:**
```
Paste relevant console output here (set LOG_LEVEL=debug for more details)
```

**MCP client error (if any):**
```
Paste any error shown in Claude Desktop or other MCP client
```

## Expected vs Actual Behavior
**Expected:** [What should have happened]
**Actual:** [What actually happened]

## Additional Context
**Screenshots/Videos**
If applicable, add screenshots of the error or screen recordings.

**Related Serpstat API behavior:**
- [ ] This works correctly when calling Serpstat API directly
- [ ] This also fails when calling Serpstat API directly
- [ ] Haven't tested direct API call
- [ ] Not applicable

**API Rate Limiting:**
- [ ] Could be related to 1 RPS rate limit
- [ ] Multiple requests made simultaneously
- [ ] Single request
- [ ] Not applicable

**Search Engine Code:** [e.g., g_us, g_uk, g_de - if relevant]

**Workaround (if found):**
[Describe any temporary workaround you discovered]

**Related Issues:**
Link any related issues: #123

## Priority Level
How critical is this issue for your SEO workflow?
- [ ] Critical (blocks core SEO analysis)
- [ ] High (significantly impacts SEO workflow)
- [ ] Medium (minor inconvenience)
- [ ] Low (cosmetic issue)

---
**For maintainers:**
- [ ] Bug confirmed
- [ ] Serpstat API issue vs MCP server issue identified
- [ ] Priority assigned
- [ ] Ready for development
