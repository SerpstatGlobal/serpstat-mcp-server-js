# Changelog
## [1.0.8] - 2025-09-30

### Added
- **Project Management Tools**: Added three new methods for managing Serpstat projects
    - `create_project` - Create a new project in Serpstat for tracking SEO metrics and site audits
    - `delete_project` - Delete an existing project from Serpstat by project ID
    - `list_projects` - Retrieve a list of projects associated with the account with pagination support
- **Credits & Usage Monitoring Tools**: Added two new methods for monitoring API and audit credits
    - `get_credits_for_audit_stats` - Check available audit credits including one-page audit, JavaScript scanning, and crawl limits (does not consume API credits)
    - `get_credits_stats` - Check API credits usage, account information, and browser plugin limits for monitoring API usage (does not consume API credits)
- Added comprehensive validation schemas and TypeScript types for project management and credits operations
- Added test coverage for all project management and credits methods
- Updated documentation with project management and credits usage examples

## [1.0.7] - 2025-09-30

### Fixed
- **Gemini API Compatibility**: Removed `complexFilter` parameter from backlinks methods (get_lost_backlinks, get_active_backlinks, get_threat_backlinks, etc.) to resolve JSON schema nesting depth error
    - Standard filtering via `sort`, `order`, `size` fully supported
    - Breaking change: users with `complexFilter` usage must migrate to client-side filtering

## [1.0.6] - 2025-09-29
- Added `get_top_pages_by_backlinks` method to retrieve a list of top pages by backlinks with various filtering and sorting parameters
- Added `get_backlinks_intersection` method to get backlinks from domains that link to multiple analyzed sites simultaneously, useful for competitive backlink analysis and identifying potential link sources
- Added `get_active_outlinks` method to get active outbound links from a domain or URL, including target URLs, anchor text, link attributes (nofollow/dofollow), link types, and discovery dates for analyzing linking strategies and partnership opportunities
- Added `get_active_outlink_domains` method to get external domains that receive outbound links from the analyzed domain, revealing partnership networks, referenced sources, and linking patterns for identifying collaboration opportunities
- Added `get_threat_backlinks` method to identify malicious backlinks pointing to the analyzed domain, including links from sites flagged for threats like social engineering, malware, or unwanted software, with detailed threat classification and platform information


## [1.0.5] - 2025-09-18
- Added `get_active_backlinks` method to retrieve a list of active backlinks showing linking pages, target pages, link attributes, link types, external links count, anchor text, and discovery dates for domain or URL analysis
- Added `get_referring_domains` method to retrieve a list of referring domains that link to the analyzed site with domain rank metrics, referring pages count, and filtering options for comprehensive backlink analysis
- Added `get_lost_backlinks` method to retrieve a list of lost backlinks showing linking pages, target pages, link attributes, and deletion dates for domain or URL analysis
- Added `get_top10_anchors` method to retrieve TOP-10 anchors with the number of backlinks and referring domains for domain analysis

## [1.0.4] - 2025-09-16
### Added
- Added `get_keyword_full_top` method to show Google's top-100 search results for analyzed keywords
- Added `get_keywords_info` method to get keyword overview with volume, CPC, competition level, difficulty, and additional metrics for multiple keywords
- Added `get_keyword_suggestions` method to show search suggestions for keywords found by full-text search with geographic names information
- Added `get_keyword_top_urls` method to return website pages that rank for the largest amount of analyzed keyword variations with highest traffic
- Added `get_keyword_competitors` method to list domains that rank for the given keyword in Google top-20 results with detailed competitor analysis
- Added `get_keyword_top` method to show Google's top-100 search results for analyzed keyword with position, URL, domain and SERP features (deprecated method)
- Added `get_anchors` method to analyze anchor text distribution in backlinks with metrics on referring domains, total backlinks, and nofollow counts

## [1.0.3] - 2025-09-09
### Fixed
- Error then LLM's is unable to manage `size` parameters in query.

## [1.0.2] - 2025-08-28
- Added new API methods for domain and keyword analysis.
- Improved error handling.

### Fixed
- Fixed input validation errors.

## [1.0.1] - 2024-08-24
### Added
- Added logging support via Winston.
- Improved project structure.

## [1.0.0] - 2024-08-23
### Added
- Initial release: basic implementation of MCP Server for Serpstat API.
- Core features for SEO analysis, working with domains, keywords, and backlinks.

