import { LINK_TYPES, SORT_ORDER, MAIN_SEARCH_ENGINES } from "../utils/constants";

// Base types
export type SortOrder = typeof SORT_ORDER[number];
export type SearchEngine = typeof MAIN_SEARCH_ENGINES[number];

// Common summary info interfaces
export interface BaseSummaryInfo {
    left_lines: number;
}

export interface PaginatedSummaryInfo extends BaseSummaryInfo {
    page: number;
}

export interface SortableSummaryInfo extends BaseSummaryInfo {
    sort: string;
    order: SortOrder;
}

export interface PaginatedSortableSummaryInfo extends PaginatedSummaryInfo, SortableSummaryInfo {
    count: number;
    total: number;
}

export interface SizedSummaryInfo extends PaginatedSummaryInfo {
    size: number;
    total: number;
}

// Request/Response base interfaces
export interface SerpstatRequest {
    id: string;
    method: string;
    params: Record<string, any>;
}

export interface SerpstatResponse<T = any> {
    id: string;
    result?: T;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

// Domain related interfaces
export interface DomainInfo {
    domain: string;
    visible: number;
    keywords: number;
    traff: number;
    visible_dynamic: number;
    keywords_dynamic: number;
    traff_dynamic: number;
    ads_dynamic: number;
    new_keywords: number;
    out_keywords: number;
    rised_keywords: number;
    down_keywords: number;
    ad_keywords: number;
    ads: number;
    prev_date: string;
}

export interface DomainsInfoResponse {
    data: DomainInfo[];
    summary_info: PaginatedSummaryInfo;
}

export interface Competitor {
    domain: string;
    visible: number;
    traff: number;
    keywords: number;
    relevance: number;
}

export interface CompetitorsResponse {
    data: Competitor[];
    summary_info: PaginatedSummaryInfo;
}

export interface BacklinksSummaryData {
    sersptat_domain_rank: number;
    referring_domains: number;
    referring_domains_change: number;
    redirected_domains: number;
    referring_malicious_domains: number;
    referring_malicious_domains_change: number;
    referring_ip_addresses: number;
    referring_ip_addresses_change: number;
    referring_subnets: number;
    referring_subnets_change: number;
    backlinks: number;
    backlinks_change: number;
    backlinks_from_mainpages: number;
    backlinks_from_mainpages_change: number;
    nofollow_backlinks: number;
    nofollow_backlinks_change: number;
    dofollow_backlinks: number;
    dofollow_backlinks_change: number;
    text_backlinks: number;
    text_backlinks_change: number;
    image_backlinks: number;
    image_backlinks_change: number;
    redirect_backlinks: number;
    redirect_backlinks_change: number;
    canonical_backlinks: number;
    canonical_backlinks_change: number;
    alternate_backlinks: number;
    alternate_backlinks_change: number;
    rss_backlinks: number;
    rss_backlinks_change: number;
    frame_backlinks: number;
    frame_backlinks_change: number;
    form_backlinks: number;
    form_backlinks_change: number;
    external_domains: number;
    external_domains_change: number;
    external_malicious_domains: number;
    external_malicious_domains_change: number;
    external_links: number;
    external_links_change: number;
}

export interface BacklinksSummaryResponse {
    data: BacklinksSummaryData;
    summary_info: BaseSummaryInfo & {
        sort?: string | null;
        order?: string | null;
    };
}

export interface DomainKeyword {
    domain: string;
    subdomain?: string;
    keyword: string;
    keyword_length: number;
    url: string;
    position: number;
    types: string[];
    found_results: number;
    cost?: number;
    traff?: number;
    difficulty?: number;
    concurrency?: number;
    region_queries_count?: number;
    intents?: string[];
}

export interface DomainKeywordsResponse {
    data: DomainKeyword[];
    summary_info: SizedSummaryInfo;
}

export interface DomainUrl {
    url: string;
    keywords: number;
}

export interface DomainUrlsResponse {
    data: DomainUrl[];
    summary_info: SizedSummaryInfo;
}

export interface DomainRegionCount {
    country_name_en: string;
    db_name: string;
    domain: string;
    keywords_count: number;
}

export interface DomainRegionsCountSummaryInfo extends SortableSummaryInfo {
    analysed_domain: string;
    regions_db_count: number;
    total_keywords: number;
}

export interface DomainRegionsCountResponse {
    data: DomainRegionCount[];
    summary_info: DomainRegionsCountSummaryInfo;
}

export interface DomainUniqKeywordData {
    domain: string;
    subdomain: string;
    keyword: string;
    keyword_length: number;
    url: string;
    position: number;
    date: string;
    types: string[];
    found_results: number;
    cost: number;
    concurrency: number;
    region_queries_count: number;
    region_queries_count_wide: number;
    geo_names: string[];
    traff: number;
    difficulty: number;
    dynamic: number;
    [domainName: string]: string | number | string[] | undefined;
}

export interface DomainUniqKeywordsSummaryInfo extends PaginatedSummaryInfo {
    total: number;
}

export interface DomainUniqKeywordsResponse {
    data: DomainUniqKeywordData[];
    summary_info: DomainUniqKeywordsSummaryInfo;
}

export interface KeywordGetData {
    keyword: string;
    cost: number;
    concurrency: number;
    found_results: number;
    region_queries_count: number;
    region_queries_count_wide: number;
    types: string[];
    geo_names: any[];
    social_domains: string[];
    right_spelling: string | null;
    lang: string;
    keyword_length: number;
    difficulty: number;
    intents: string[];
}

export interface KeywordGetSummaryInfo extends PaginatedSummaryInfo {
    total: number;
}

export interface KeywordGetResponse {
    data: KeywordGetData[];
    summary_info: KeywordGetSummaryInfo;
}

export interface GetRelatedKeywordData {
    keyword: string;
    cost?: number;
    concurrency?: number;
    region_queries_count?: number;
    difficulty?: number;
    weight?: number;
    types?: string[];
    geo_names?: string[];
    right_spelling?: boolean;
    keyword_length?: number;
    intents?: string[];
}

export interface GetRelatedKeywordsSummaryInfo extends PaginatedSummaryInfo {
    total: number;
}

export interface GetRelatedKeywordsResponse {
    data: GetRelatedKeywordData[];
    summary_info: GetRelatedKeywordsSummaryInfo;
}

export interface KeywordInfoData {
    keyword: string;
    cost: number;
    concurrency: number;
    found_results: number;
    region_queries_count: number;
    region_queries_count_wide: number;
    types: string[];
    geo_names: object[];
    social_domains: string[];
    right_spelling: string | null;
    lang: string;
    difficulty: number;
    suggestions_count: number;
    keywords_count: number;
    intents?: string[];
}

export interface KeywordInfoSummaryInfo extends PaginatedSummaryInfo {}

export interface KeywordsInfoResponse {
    data: KeywordInfoData[];
    summary_info: KeywordInfoSummaryInfo;
}

export interface KeywordSuggestionData {
    keyword: string;
    geo_names: string[];
}

export interface KeywordSuggestionsSummaryInfo extends PaginatedSummaryInfo {
    total: number;
}

export interface KeywordSuggestionsResponse {
    data: KeywordSuggestionData[];
    summary_info: KeywordSuggestionsSummaryInfo;
}

export interface KeywordFullTopData {
    position: number;
    url: string;
    url_keywords_count: number;
    domain: string;
    domain_visibility: number;
    domain_keywords_organic: number;
    domain_keywords_ppc: number;
    domain_top_10_keywords_count: number;
    domain_sdr: number;
    domain_in_urls_count: number;
    domain_in_domains_count: number;
    domain_out_urls_count: number;
    domain_out_domains_count: number;
}

export interface KeywordFullTopSummaryInfo {
    keywords: number;
    frequency: number;
    cost: number;
    difficulty: number;
    concurrency: number;
    types: string[];
    sorting?: object;
    left_limits: number;
    count_top_results: number;
    keyword: string;
    se: SearchEngine;
}

export interface KeywordFullTopResponse {
    top: KeywordFullTopData[];
    summary_info: KeywordFullTopSummaryInfo;
}

export interface KeywordTopUrlData {
    url: string;
    keywords: number;
    traff: number;
    fbShares: number;
}

export interface KeywordTopUrlsSummaryInfo extends BaseSummaryInfo {
    keyword: string;
    se: SearchEngine;
    page: number;
    page_size: number;
    sort: string;
    order: SortOrder;
    total_urls: number;
}

export interface KeywordTopUrlsResponse {
    urls: KeywordTopUrlData[];
    summary_info: KeywordTopUrlsSummaryInfo;
}

export interface KeywordCompetitorData {
    domain: string;
    visible: number;
    keywords: number;
    traff: number;
    visible_dynamic: number;
    keywords_dynamic: number;
    traff_dynamic: number;
    ads_dynamic: number;
    new_keywords: number;
    out_keywords: number;
    rised_keywords: number;
    down_keywords: number;
    ad_keywords: number;
    ads: number;
    intersected: number;
    relevance: number;
    our_relevance: number;
}

export interface KeywordCompetitorsSummaryInfo extends PaginatedSummaryInfo {}

export interface KeywordCompetitorsResponse {
    data: Record<string, KeywordCompetitorData>;
    summary_info: KeywordCompetitorsSummaryInfo;
}

export interface KeywordTopResultData {
    position: number;
    url: string;
    domain: string;
    subdomain: string;
    types: string[];
}

export interface KeywordTopDataResponse {
    top?: KeywordTopResultData[];
    ads: any[];
    types: string[];
    results: number;
}

export interface KeywordTopSummaryInfo extends PaginatedSummaryInfo {}

export interface KeywordTopResponse {
    data: KeywordTopDataResponse;
    summary_info: KeywordTopSummaryInfo;
}

export interface AnchorData {
    anchor: string;
    refDomains: number;
    total: number;
    noFollow: number;
}

export interface AnchorsSummaryInfo extends SortableSummaryInfo {
    page: number;
    count: number;
    total: number;
}

export interface AnchorsResponse {
    data: AnchorData[];
    summary_info: AnchorsSummaryInfo;
}

export interface ActiveBacklinkData {
    url_from: string;
    url_to: string;
    nofollow: string;
    link_type: typeof LINK_TYPES[number];
    links_ext: number;
    link_text: string;
    first_seen: string;
    last_visited: string;
    domain_rank: string;
}

export interface ActiveBacklinksSummaryInfo extends PaginatedSortableSummaryInfo {}

export interface ActiveBacklinksResponse {
    data: ActiveBacklinkData[];
    summary_info: ActiveBacklinksSummaryInfo;
}

export interface ReferringDomainData {
    domain_from: string;
    ref_pages: string;
    domainRank: string;
}

export interface ReferringDomainsSummaryInfo extends PaginatedSortableSummaryInfo {}

export interface ReferringDomainsResponse {
    data: ReferringDomainData[];
    summary_info: ReferringDomainsSummaryInfo;
}

export interface LostBacklinkData {
    url_from: string;
    url_to: string;
    anchor: string;
    date_add: string;
    date_del: string;
    check: string;
    link_nofollow: string;
    link_external: string;
    link_type: typeof LINK_TYPES[number];
    domain_rank: number;
}

export interface LostBacklinksSummaryInfo extends PaginatedSortableSummaryInfo {}

export interface LostBacklinksResponse {
    data: LostBacklinkData[];
    summary_info: LostBacklinksSummaryInfo;
}

export interface TopAnchorData {
    anchor: string;
    backlinks_count: number;
    domains_count: number;
}

export interface TopAnchorsSummaryInfo extends SortableSummaryInfo {
    referring_domains: number;
    backlinks: number;
    unique_anchors: number;
}

export interface TopAnchorsResponse {
    data: TopAnchorData[];
    summary_info: TopAnchorsSummaryInfo;
}

export interface TopPageData {
    url: string;
    ref_pages: number;
    ref_domains: number;
    ips: number;
    urlTo: string;
}

export interface TopPagesSummaryInfo extends PaginatedSortableSummaryInfo {}

export interface TopPagesByBacklinksResponse {
    data: TopPageData[];
    summary_info: TopPagesSummaryInfo;
}

export interface BacklinksIntersectionData {
    Domain: string;
    SDR: number;
    [key: string]: string | number; // Dynamic keys for "Links count for domain #1 {domain_name}", etc.
}

export interface BacklinksIntersectionResponse {
    data: BacklinksIntersectionData[];
    summary_info: PaginatedSortableSummaryInfo;
}

export interface ActiveOutlinksData {
    url_from: string;
    url_to: string;
    nofollow: string;
    link_type: string;
    links_ext: number;
    link_text: string;
    first_seen: string;
    last_visited: string;
    date_del: string | null;
}

export interface ActiveOutlinksResponse {
    data: ActiveOutlinksData[];
    summary_info: PaginatedSortableSummaryInfo;
}

export interface ActiveOutlinkDomainsData {
    domains_to: string;
    domain_links: string;
    domain_rank: string;
}

export interface ActiveOutlinkDomainsResponse {
    data: ActiveOutlinkDomainsData[];
    summary_info: PaginatedSortableSummaryInfo;
}

export interface ThreatBacklinksData {
    domain: string;
    link_from: string;
    link_to: string;
    platform_type: string[];
    threat_type: string[];
    lastupdate: string;
}

export interface ThreatBacklinksResponse {
    data: ThreatBacklinksData[];
    summary_info: PaginatedSortableSummaryInfo;
}

// Project management interfaces
export interface CreateProjectResponse {
    project_id: string;
}

export interface DeleteProjectResponse {
    result: boolean;
}

export interface ProjectData {
    project_id: string;
    project_name: string;
    domain: string;
    created_at: string;
    group: string;
    type: string;
}

export interface ProjectsSummaryInfo {
    page: number;
    page_total: number;
    count: number;
    total: number;
}

export interface GetProjectsResponse {
    data: ProjectData[];
    summary_info: ProjectsSummaryInfo;
}
