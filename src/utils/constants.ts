export const SORT_ORDER = ["asc", "desc"] as const;

export const SEARCH_TYPES = ["domain", "domain_with_subdomains"] as const;

export const SEARCH_TYPES_URL = ["url", "domain", "part_url", "domain_with_subdomains"] as const;

export const ANCHORS_SORT_FIELDS = [
    "total",
    "refDomains",
    "nofollow",
    "anchor",
    "lastupdate"
] as const;

export const ANCHORS_COMPLEX_FILTER_FIELDS = [
    "total",
    "refDomains",
    "nofollow",
    "anchor",
    "lastupdate"
] as const;

export const COMPLEX_FILTER_COMPARE_TYPES = [
    "gt",
    "lt",
    "gte",
    "lte",
    "eq",
    "neq",
    "between",
    "contains",
    "notContains",
    "startsWith",
    "endsWith"
] as const;

export const ADDITIONAL_FILTERS = ["no_subdomains", "only_main_page", "last_week", "only_subdomains", "only_hosts"] as const;

export const BACKLINKS_SORT_FIELDS = [
    "url_from",
    "anchor",
    "link_nofollow",
    "links_external",
    "link_type",
    "url_to",
    "check",
    "add",
    "domain_rank"
] as const;

export const BACKLINKS_COMPLEX_FILTER_FIELDS = [
    "url_from",
    "anchor",
    "link_nofollow",
    "links_external",
    "link_type",
    "url_to",
    "check",
    "add"
] as const;

export const REFERRING_DOMAINS_SORT_FIELDS = [
    "domain_links",
    "domain_from",
    "domain_rank",
    "check"
] as const;

export const REFERRING_DOMAINS_COMPLEX_FILTER_FIELDS = [
    "domain_links",
    "domain_from",
    "domain_rank"
] as const;

export const LOST_BACKLINKS_SORT_FIELDS = [
    "url_from",
    "anchor",
    "link_nofollow",
    "links_external",
    "link_type",
    "url_to",
    "check",
    "date_del"
] as const;

export const LOST_BACKLINKS_COMPLEX_FILTER_FIELDS = [
    "url_from",
    "anchor",
    "link_nofollow",
    "links_external",
    "link_type",
    "url_to",
    "check",
    "date_del"
] as const;

export const DOMAIN_REGIONS_SORT_FIELDS = [
    "keywords_count",
    "country_name_en",
    "db_name"
] as const;

export const KEYWORD_INTENTS = [
    "informational",
    "navigational",
    "commercial",
    "transactional"
] as const;

export const LOG_LEVELS = ["error", "warn", "info", "debug"] as const;

export const MAIN_SEARCH_ENGINES = [
    'g_af', 'g_al', 'g_dz', 'g_as', 'g_ad', 'g_ao', 'g_ai', 'g_ag', 'g_ar', 'g_am', 'g_aw', 'g_au', 'g_at', 'g_az',
    'g_bh', 'g_bd', 'g_bb', 'g_by', 'g_be', 'g_bz', 'g_bj', 'g_bm', 'g_bt', 'g_bo', 'g_ba', 'g_bw', 'g_br', 'g_io',
    'g_vg', 'g_bn', 'g_bg', 'g_bf', 'g_bi', 'g_kh', 'g_cm', 'g_ca', 'g_cv', 'g_ky', 'g_cf', 'g_td', 'g_cl', 'g_cn',
    'g_cx', 'g_cc', 'g_co', 'g_km', 'g_ck', 'g_cr', 'g_ci', 'g_hr', 'g_cw', 'g_cy', 'g_cz', 'g_cd', 'g_dk', 'g_dj',
    'g_dm', 'g_do', 'g_ec', 'g_eg', 'g_sv', 'g_gq', 'g_er', 'g_ee', 'g_et', 'g_fk', 'g_fo', 'g_fm', 'g_fj', 'g_fi',
    'g_fr', 'g_gf', 'g_pf', 'g_ga', 'g_ge', 'g_de', 'g_gh', 'g_gi', 'g_gr', 'g_gl', 'g_gd', 'g_gp', 'g_gu', 'g_gt',
    'g_gg', 'g_gn', 'g_gw', 'g_gy', 'g_ht', 'g_hn', 'g_hk', 'g_hu', 'g_is', 'g_in', 'g_id', 'g_iq', 'g_ie', 'g_im',
    'g_il', 'g_it', 'g_jm', 'g_jp', 'g_je', 'g_jo', 'g_kz', 'g_ke', 'g_ki', 'g_kw', 'g_kg', 'g_la', 'g_lv', 'g_lb',
    'g_ls', 'g_lr', 'g_ly', 'g_li', 'g_lt', 'g_lu', 'g_mo', 'g_mk', 'g_mg', 'g_mw', 'g_my', 'g_mv', 'g_ml', 'g_mt',
    'g_mh', 'g_mq', 'g_mr', 'g_mu', 'g_yt', 'g_mx', 'g_md', 'g_mc', 'g_mn', 'g_me', 'g_ms', 'g_ma', 'g_mz', 'g_mm',
    'g_na', 'g_nr', 'g_np', 'g_nl', 'g_nc', 'g_nz', 'g_ni', 'g_ne', 'g_ng', 'g_nu', 'g_nf', 'g_mp', 'g_no', 'g_om',
    'g_pk', 'g_pw', 'g_ps', 'g_pa', 'g_pg', 'g_py', 'g_pe', 'g_ph', 'g_pn', 'g_pl', 'g_pt', 'g_pr', 'g_qa', 'g_cg',
    'g_re', 'g_ro', 'g_ru', 'g_rw', 'g_sh', 'g_kn', 'g_lc', 'g_pm', 'g_vc', 'g_ws', 'g_sm', 'g_st', 'g_sa', 'g_sn',
    'g_rs', 'g_sc', 'g_sl', 'g_sg', 'g_sx', 'g_sk', 'g_si', 'g_sb', 'g_so', 'g_za', 'g_kr', 'g_es', 'g_lk', 'g_sr',
    'g_sz', 'g_se', 'g_ch', 'g_tw', 'g_tj', 'g_tz', 'g_th', 'g_bs', 'g_gm', 'g_tl', 'g_tg', 'g_tk', 'g_to', 'g_tt',
    'g_tn', 'g_tr', 'g_tm', 'g_tc', 'g_tv', 'g_vi', 'g_ug', 'g_ua', 'g_ae', 'g_uk', 'g_us', 'g_uy', 'g_uz', 'g_vu',
    'g_va', 'g_ve', 'g_vn', 'g_wf', 'g_ye', 'g_zm', 'g_zw', 'bing_us'
] as const;

export const DOMAIN_NAME_REGEX = "^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}$";

// Default values
export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_COMPETITORS_SIZE = 20;

// Validation constants
export const MIN_DOMAIN_LENGTH = 4;
export const MAX_DOMAIN_LENGTH = 253;
export const MIN_DOMAINS_ITEMS = 1;
export const MAX_DOMAINS_ITEMS = 100;
export const MIN_MINUS_DOMAINS_ITEMS = 1;
export const MAX_MINUS_DOMAINS_ITEMS = 50;
export const MIN_COMPETITORS_SIZE = 1;
export const MAX_COMPETITORS_SIZE = 100;
export const DEFAULT_COMPETITORS_HANDLER_SIZE = 10;
export const MIN_KEYWORD_LENGTH = 1;
export const MAX_KEYWORD_LENGTH = 100;
export const MAX_KEYWORDS_ITEMS = 50;
export const MAX_MINUS_KEYWORDS_ITEMS = 50;
export const MIN_PAGE = 1;
export const MAX_PAGE_SIZE = 1000;
export const MIN_FILTER_POSITION = 1;
export const MAX_FILTER_POSITION = 100;
export const MIN_FILTER_VALUE = 0;
export const MAX_FILTER_DIFFICULTY = 100;
export const MIN_FILTER_CONCURRENCY = 1;
export const MAX_FILTER_CONCURRENCY = 100;
export const MAX_URL_PREFIX_LENGTH = 500;
export const MAX_URL_CONTAIN_LENGTH = 200;
export const MIN_UNIQ_DOMAINS = 1;
export const MAX_UNIQ_DOMAINS = 2;
export const MAX_UNIQ_KEYWORDS_ITEMS = 100;
export const MAX_FILTER_COST = 200;
export const MAX_QUERIES_COUNT = 100000000;
export const MAX_RELATED_KEYWORD_LENGTH = 200;
export const MIN_WEIGHT = 1;
export const MIN_KEYWORDS_INFO_ITEMS = 1;
export const MAX_KEYWORDS_INFO_ITEMS = 1000;
export const MIN_KEYWORD_TOP_SIZE = 10;
export const MAX_KEYWORD_TOP_SIZE = 100;

// Additional validation constants for cleanup
export const MAX_DOMAINS_INFO_ITEMS = 10;
export const MAX_UNIQ_KEYWORDS_MINUS_ITEMS = 100;
export const MIN_VISIBLE_VALUE = 0;
export const MIN_TRAFFIC_VALUE = 0;
export const MAX_KEYWORD_COMPETITORS_SIZE = 1000;
export const DEFAULT_TOP_SIZE = 100;
export const MAX_TOP_SIZE = 60000;
export const ALLOWED_PAGE_SIZES = [10, 20, 30, 50, 100, 200, 500] as const;

export const DEFAULT_REQUEST_TIMEOUT = 60000;
