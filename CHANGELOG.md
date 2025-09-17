# Changelog

## [Unreleased]
### Added
- Added `get_active_backlinks` method to retrieve a list of active backlinks showing linking pages, target pages, link attributes, link types, external links count, anchor text, and discovery dates for domain or URL analysis
- Added `get_referring_domains` method to retrieve a list of referring domains that link to the analyzed site with domain rank metrics, referring pages count, and filtering options for comprehensive backlink analysis

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

