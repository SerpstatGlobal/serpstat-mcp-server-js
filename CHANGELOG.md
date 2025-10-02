# Changelog

## [Unreleased] - 2025-10-01

### Added

- **Site Audit Tools**: Added thirteen methods for comprehensive site audit project management and analysis
    - `get_site_audit_settings` - Retrieve audit settings for a specific project including scan parameters, scheduling options, email notifications, and error detection thresholds (does not consume API credits)
    - `set_site_audit_settings` - Update audit settings for a project with comprehensive configuration options for scan speed, user agent, URL depth, folder depth, keywords filtering, HTTP authentication, scheduling, and custom error thresholds (does not consume API credits)
    - `start_site_audit` - Start an audit session for a specified project and receive a reportId to track audit progress (consumes 1 API credit per successfully scanned page without JS rendering, 10 credits per page with JS rendering)
    - `stop_site_audit` - Stop an active audit session for a project and receive operation result status (does not consume API credits)
    - `get_site_audit_results_by_categories` - Get audit results statistics grouped by issue categories (pages status, meta tags, headings, content, multimedia, indexation, redirects, links, HTTPS, hreflang, AMP, markup, pagespeed) showing critical, medium, low, and informational issue counts per category (does not consume API credits)
    - `get_site_audit_history` - Get historical error count data for a specific error type across multiple audit reports, useful for tracking improvements or regressions in specific SEO issues over time (does not consume API credits)
    - `get_site_audits_list` - Get list of all audit reports for a project with summary statistics including SDO score, pages scanned, error counts, progress percentage, and completion status (does not consume API credits)
    - `get_site_audit_scanned_urls_list` - Get list of URLs that will be scanned based on project scan settings (entire domain, specific URLs only, or imported list) useful for verifying audit scope before starting scans (does not consume API credits)
    - `get_site_audit_project_default_settings` - Get default audit settings template with recommended values for creating new projects, including standard error thresholds, scan parameters, and scheduling options (does not consume API credits)
    - `get_site_audit_bref_info` - Get essential summary information from the latest site audit including Serpstat Domain Optimization Score (SDO), total error counts by priority level (high/medium/low/information), virus count, scan progress percentage, stop status, scanned pages count, redirect count, and captcha detection status (does not consume API credits)
    - `get_site_audit_deteailed_report` - Get the number of errors and issues categorized by issue type found in a specific audit report, with optional comparison to another report showing countAll (total errors), countNew (new errors since comparison), and countFixed (fixed errors since comparison) for tracking audit improvements over time (does not consume API credits)
    - `get_site_audit_pages_spec_errors` - Get a comprehensive list of all pages where a specific audit error was detected, with support for filtering by error display mode (all errors, new errors, or solved errors) and pagination, returning detailed information including startUrl, HTTP status code, finishUrl, occurrence count, and startUrlCrc for each affected page (does not consume API credits)
    - `get_site_audit_elements_with_issues` - Get a list of sub-elements (URLs) which contain specific errors or issues identified by CRC parameter from get_site_audit_pages_spec_errors response, with support for filtering by mode and pagination, useful for drilling down into specific error instances (does not consume API credits)
- Added comprehensive validation schemas and TypeScript types for all site audit operations
- Added test coverage for all site audit methods (51 tests covering validation schemas and service methods)
- Updated documentation with complete site audit tools section and usage examples

## [1.0.9] - 2025-10-01

### Added

- **URL Analysis Tools**: Added four new methods for analyzing website URLs and their search performance
    - `get_url_summary_traff` - Get traffic and keyword statistics for website pages matching a specific URL mask, showing organic traffic and keyword counts for URLs matching the given pattern
    - `get_url_competitors` - Get list of URL competitors showing domains and pages that compete for the same keywords in top-10 search results
    - `get_url_keywords` - Get keywords for which specified URL ranks in top-100 Google and top-50 Bing search results, with comprehensive metrics including positions, traffic, difficulty, and keyword intents
    - `get_url_missing_keywords` - Get keywords that competitors rank for but the given URL does not, helping identify keyword gaps and content optimization opportunities
- Added comprehensive validation schemas and TypeScript types for URL analysis operations
- Added test coverage for all URL analysis methods (24 tests)
- Updated documentation with URL analysis tools section and usage examples

## [1.0.8] - 2025-09-30

### Added

- **Rank Tracking Tools**: Added five new methods for rank tracker project management and SERP analysis
    - `get_rt_projects_list` - Get list of rank tracker projects with ID, name, domain, creation date, and tracking status (does not consume API credits)
    - `get_rt_project_status` - Check if rank tracker project is currently parsing positions; returns true if processing, false if ready for data retrieval (does not consume API credits)
    - `get_rt_project_regions_list` - Get list of regions configured for a rank tracker project, including region ID, status (active/inactive), SERP type (organic/paid), device type (desktop/mobile), search engine, and location details (does not consume API credits)
    - `get_rt_project_keyword_serp_history` - Get Google's top-100 search results history for rank tracker project keywords in a specific region, returning historical position data, URLs, search frequency, and optional keyword tags (does not consume API credits)
    - `get_rt_project_url_serp_history` - Get ranking history of URLs for rank tracker project keywords in a specific region, returning historical position data for URLs ranking in search results, including search frequency and optional keyword tags (does not consume API credits)
- **Project Management Tools**: Added three new methods for managing Serpstat projects
    - `create_project` - Create a new project in Serpstat for tracking SEO metrics and site audits
    - `delete_project` - Delete an existing project from Serpstat by project ID
    - `list_projects` - Retrieve a list of projects associated with the account with pagination support
- **Credits & Usage Monitoring Tools**: Added two new methods for monitoring API and audit credits
    - `get_credits_for_audit_stats` - Check available audit credits including one-page audit, JavaScript scanning, and crawl limits (does not consume API credits)
    - `get_credits_stats` - Check API credits usage, account information, and browser plugin limits for monitoring API usage (does not consume API credits)
- Added comprehensive validation schemas and TypeScript types for project management, credits, and rank tracking operations
- Added test coverage for all project management, credits, and rank tracking methods
- Updated documentation with project management, credits, and rank tracking usage examples

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
- Added `get_keyword_top_urls` method to return website pages that rank for the largest amount of analyzed keyword variations with the highest traffic
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

