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

export const SEARCH_ENGINES = [
    'g_af','g_al','g_dz','g_as','g_ad','g_ao','g_ai','g_ag','g_ar','g_am','g_aw','g_au','g_at',
    'g_az','g_bh','g_bd','g_bb','g_by','g_be','g_bz','g_bj','g_bm','g_bt','g_bo','g_ba','g_bw',
    'g_br','g_io','g_vg','g_bn','g_bg','g_bf','g_bi','g_kh','g_cm','g_ca','g_cv','g_ky','g_cf',
    'g_td','g_cl','g_cn','g_cx','g_сс','g_co','g_km','g_ck','g_cr','g_ci','g_hr','g_cw','g_cy',
    'g_cz','g_cd','g_dk','g_dj','g_dm','g_do','g_ec','g_eg','g_sv','g_gq','g_er','g_ee','g_et',
    'g_fk','g_fo','g_fm','g_fj','g_fi','g_fr','g_gf','g_pf','g_ga','g_ge','g_de','g_gh','g_gi',
    'g_gr','g_gl','g_gd','g_gp','g_gu','g_gt','g_gg','g_gn','g_gw','g_gy','g_ht','g_hn','g_hk',
    'g_hu','g_is','g_in','g_id','g_iq','g_ie','g_im','g_il','g_it','g_jm','g_jp','g_je','g_jo',
    'g_kz','g_ke','g_ki','g_kw','g_kg','g_la','g_lv','g_lb','g_ls','g_lr','g_ly','g_li','g_lt',
    'g_lu','g_mo','g_mk','g_mg','g_mw','g_my','g_mv','g_ml','g_mt','g_mh','g_mq','g_mr','g_mu',
    'g_yt','g_mx','g_md','g_mc','g_mn','g_me','g_ms','g_ma','g_mz','g_mm','g_na','g_nr','g_np',
    'g_nl','g_nc','g_nz','g_ni','g_ne','g_ng','g_nu','g_nf','g_mp','g_no','g_om','g_pk','g_pw',
    'g_ps','g_pa','g_pg','g_py','g_pe','g_ph','g_pn','g_pl','g_pt','g_pr','g_qa','g_cg','g_re',
    'g_ro','g_ru','g_rw','g_sh','g_kn','g_lc','g_pm','g_vc','g_ws','g_sm','g_st','g_sa','g_sn',
    'g_rs','g_sc','g_sl','g_sg','g_sx','g_sk','g_si','g_sb','g_so','g_za','g_kr','g_es','g_lk',
    'g_sr','g_sz','g_se','g_ch','g_tw','g_tj','g_tz','g_th','g_bs','g_gm','g_tl','g_tg','g_tk',
    'g_to','g_tt','g_tn','g_tr','g_tm','g_tc','g_tv','g_vi','g_ug','g_ua','g_ae','g_uk','g_us',
    'g_uy','g_uz','g_vu','g_va','g_ve','g_vn','g_wf','g_ye','g_zm','g_zw','bing_us'
] as const;

export type SearchEngine = typeof SEARCH_ENGINES[number];

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
