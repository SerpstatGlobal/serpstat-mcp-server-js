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
    summary_info: {
        page: number;
        left_lines: number;
    };
}

export type SearchEngine =
    | 'g_us' | 'g_uk' | 'g_de' | 'g_fr' | 'g_es' | 'g_it' | 'g_ca' | 'g_au'
    | 'g_nl' | 'g_be' | 'g_dk' | 'g_se' | 'g_no' | 'g_fi' | 'g_pl' | 'g_cz'
    | 'g_ua' | 'g_ru' | 'bing_us';

export interface Competitor {
    domain: string;
    visible: number;
    traff: number;
    keywords: number;
    relevance: number;
}

export interface CompetitorsResponse {
    data: Competitor[];
    summary_info: {
        page: number;
        left_lines: number;
    };
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
    summary_info: {
        left_lines: number;
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
    summary_info: {
        page: number;
        size: number;
        total: number;
        left_lines: number;
    };
}

export interface DomainUrl {
    url: string;
    keywords: number;
}

export interface DomainUrlsResponse {
    data: DomainUrl[];
    summary_info: {
        page: number;
        size: number;
        total: number;
        left_lines: number;
    };
}

export interface DomainRegionCount {
    country_name_en: string;
    db_name: string;
    domain: string;
    keywords_count: number;
}

export interface DomainRegionsCountSummaryInfo {
    analysed_domain: string;
    sort: string;
    order: string;
    regions_db_count: number;
    total_keywords: number;
    left_lines: number;
}

export interface DomainRegionsCountResponse {
    data: DomainRegionCount[];
    summary_info: DomainRegionsCountSummaryInfo;
}
