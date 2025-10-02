import { z } from 'zod';
import {
    SORT_ORDER,
    SEARCH_TYPES,
    DOMAIN_REGIONS_SORT_FIELDS,
    KEYWORD_INTENTS,
    MAIN_SEARCH_ENGINES,
    DOMAIN_NAME_REGEX,
    DEFAULT_PAGE_SIZE,
    MIN_DOMAIN_LENGTH,
    MAX_DOMAIN_LENGTH,
    MIN_DOMAINS_ITEMS,
    MAX_DOMAINS_INFO_ITEMS,
    MIN_MINUS_DOMAINS_ITEMS,
    MAX_MINUS_DOMAINS_ITEMS,
    MIN_COMPETITORS_SIZE,
    MAX_COMPETITORS_SIZE,
    DEFAULT_COMPETITORS_HANDLER_SIZE,
    MIN_KEYWORD_LENGTH,
    MAX_KEYWORD_LENGTH,
    MAX_KEYWORDS_ITEMS,
    MAX_MINUS_KEYWORDS_ITEMS,
    MIN_PAGE,
    MAX_PAGE_SIZE,
    MIN_FILTER_POSITION,
    MAX_FILTER_POSITION,
    MIN_FILTER_VALUE,
    MAX_FILTER_DIFFICULTY,
    MIN_FILTER_CONCURRENCY,
    MAX_FILTER_CONCURRENCY,
    MAX_URL_PREFIX_LENGTH,
    MAX_URL_CONTAIN_LENGTH,
    MIN_UNIQ_DOMAINS,
    MAX_UNIQ_DOMAINS,
    MAX_UNIQ_KEYWORDS_ITEMS,
    MAX_UNIQ_KEYWORDS_MINUS_ITEMS,
    MAX_FILTER_COST,
    MAX_QUERIES_COUNT,
    MAX_RELATED_KEYWORD_LENGTH,
    MIN_WEIGHT,
    MIN_KEYWORDS_INFO_ITEMS,
    MAX_KEYWORDS_INFO_ITEMS,
    MIN_KEYWORD_TOP_SIZE,
    MAX_KEYWORD_TOP_SIZE,
    MIN_VISIBLE_VALUE,
    MIN_TRAFFIC_VALUE,
    MAX_KEYWORD_COMPETITORS_SIZE,
    DEFAULT_TOP_SIZE,
    MAX_TOP_SIZE,
    ALLOWED_PAGE_SIZES,
    SEARCH_TYPES_URL,
    ANCHORS_SORT_FIELDS,
    ANCHORS_COMPLEX_FILTER_FIELDS,
    COMPLEX_FILTER_COMPARE_TYPES,
    ADDITIONAL_FILTERS,
    BACKLINKS_SORT_FIELDS,
    BACKLINKS_COMPLEX_FILTER_FIELDS,
    REFERRING_DOMAINS_SORT_FIELDS,
    REFERRING_DOMAINS_COMPLEX_FILTER_FIELDS,
    LOST_BACKLINKS_SORT_FIELDS,
    LOST_BACKLINKS_COMPLEX_FILTER_FIELDS,
    TOP_PAGES_SORT_FIELDS,
    TOP_PAGES_COMPLEX_FILTER_FIELDS,
    BACKLINKS_INTERSECTION_SORT_FIELDS,
    BACKLINKS_INTERSECTION_COMPLEX_FILTER_FIELDS,
    MAX_INTERSECT_DOMAINS,
    ACTIVE_OUTLINKS_SORT_FIELDS,
    ACTIVE_OUTLINKS_COMPLEX_FILTER_FIELDS,
    ACTIVE_OUTLINK_DOMAINS_SORT_FIELDS,
    ACTIVE_OUTLINK_DOMAINS_COMPLEX_FILTER_FIELDS,
    BACKLINKS_THREAT_SORT_FIELDS,
    BACKLINKS_THREAT_COMPLEX_FILTER_FIELDS,
    PROJECT_ALLOWED_PAGE_SIZES,
    DEFAULT_PROJECT_PAGE_SIZE,
    MIN_PROJECT_NAME_LENGTH,
    MAX_PROJECT_NAME_LENGTH,
    MIN_PROJECT_ID,
    MAX_PROJECT_GROUP_NAME_LENGTH,
    RT_ALLOWED_PAGE_SIZES,
    DEFAULT_RT_PAGE_SIZE,
    MIN_RT_PROJECT_ID,
    MIN_RT_REGION_ID,
    RT_SERP_HISTORY_SORT_TYPES,
    MAX_RT_KEYWORDS_FILTER,
    URL_OUTPUT_DATA_TYPES,
    DEFAULT_AUDIT_LIMIT,
    MIN_AUDIT_OFFSET,
    MIN_REPORT_ID,
    SITE_AUDIT_ERROR_DISPLAY_MODES,
    DEFAULT_ERROR_ELEMENTS_LIMIT,
    MIN_SCAN_SPEED,
    MAX_SCAN_SPEED,
    MIN_SCAN_DURATION,
    MIN_FOLDER_DEPTH,
    MIN_URL_DEPTH,
    MIN_PAGES_LIMIT,
    MIN_TITLE_LENGTH,
    MIN_DESC_LENGTH,
    MIN_URL_LENGTH,
    MIN_IMAGE_SIZE,
    MIN_PAGE_SIZE,
    MIN_EXTERNAL_LINKS,
} from './constants.js';

// Common schemas
const searchEngineSchema = z.enum(MAIN_SEARCH_ENGINES);
const sortOrderSchema = z.enum(SORT_ORDER);
const keywordIntentsSchema = z.enum(KEYWORD_INTENTS);

// Common validation patterns
const domainSchema = z.string()
    .min(MIN_DOMAIN_LENGTH)
    .max(MAX_DOMAIN_LENGTH)
    .regex(new RegExp(DOMAIN_NAME_REGEX));

const keywordSchema = z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH);
const keywordArraySchema = z.array(keywordSchema);

const paginationSchema = z.object({
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
});

// Common filter schemas
const costFilterSchema = z.object({
    cost: z.number().min(MIN_FILTER_VALUE).optional(),
    cost_from: z.number().min(MIN_FILTER_VALUE).optional(),
    cost_to: z.number().min(MIN_FILTER_VALUE).optional(),
});

const costFilterWithMaxSchema = z.object({
    cost: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
    cost_from: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
    cost_to: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
});

const difficultyFilterSchema = z.object({
    difficulty: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
    difficulty_from: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
    difficulty_to: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
});

const concurrencyFilterSchema = z.object({
    concurrency: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
    concurrency_from: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
    concurrency_to: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
});

const positionFilterSchema = z.object({
    position: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
    position_from: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
    position_to: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
});

const regionQueriesFilterSchema = z.object({
    region_queries_count: z.number().int().min(MIN_FILTER_VALUE).optional(),
    region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
    region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
});

const regionQueriesFilterWithMaxSchema = z.object({
    region_queries_count: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
    region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
    region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
});

const keywordLengthFilterSchema = z.object({
    keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
    keyword_length_from: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
    keyword_length_to: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
});

const intentsFilterSchema = z.object({
    intents_contain: z.array(keywordIntentsSchema).optional(),
    intents_not_contain: z.array(keywordIntentsSchema).optional(),
});

const keywordContentFilterSchema = z.object({
    keyword_contain: z.array(z.string()).optional(),
    keyword_not_contain: z.array(z.string()).optional(),
    keyword_contain_one_of: z.array(z.string()).optional(),
    keyword_not_contain_one_of: z.array(z.string()).optional(),
    keyword_contain_broad_match: z.array(z.string()).optional(),
    keyword_not_contain_broad_match: z.array(z.string()).optional(),
});

// URL/Domain validation function
const createQueryValidationRefine = (allowUrlTypes: boolean = true) => (data: any) => {
    if (allowUrlTypes && (data.searchType === 'url' || data.searchType === 'part_url')) {
        const urlPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(\/.*)?\??.*$/;
        if (data.query.startsWith('http://') || data.query.startsWith('https://')) {
            try {
                new URL(data.query);
                return true;
            } catch {
                return false;
            }
        } else {
            return urlPattern.test(data.query);
        }
    } else {
        return data.query.length >= MIN_DOMAIN_LENGTH &&
               data.query.length <= MAX_DOMAIN_LENGTH &&
               new RegExp(DOMAIN_NAME_REGEX).test(data.query);
    }
};

// Complex filter schemas
const createComplexFilterSchema = (fieldsEnum: readonly string[]) => z.union([
    z.object({
        field: z.enum(fieldsEnum as [string, ...string[]]),
        compareType: z.enum(COMPLEX_FILTER_COMPARE_TYPES),
        value: z.array(z.union([z.number().int(), z.string()]))
    }),
    z.object({
        additional_filters: z.enum(ADDITIONAL_FILTERS)
    })
]);

// Existing schemas with refactored parts
export const domainsInfoSchema = z.object({
    domains: z.array(z.string().min(MIN_KEYWORD_LENGTH)).min(MIN_DOMAINS_ITEMS).max(MAX_DOMAINS_INFO_ITEMS),
    se: searchEngineSchema,
    filters: z.object({
        traff: z.number().int().positive().optional(),
        traff_from: z.number().int().positive().optional(),
        traff_to: z.number().int().positive().optional(),
        visible: z.number().positive().optional(),
        visible_from: z.number().positive().optional(),
        visible_to: z.number().positive().optional(),
    }).optional(),
});

export type DomainsInfoParams = z.infer<typeof domainsInfoSchema>;

export const competitorsGetSchema = z.object({
    domain: domainSchema,
    se: searchEngineSchema,
    size: z.number().int().min(MIN_COMPETITORS_SIZE).max(MAX_COMPETITORS_SIZE).default(DEFAULT_COMPETITORS_HANDLER_SIZE),
    filters: z.object({
        visible: z.number().min(MIN_VISIBLE_VALUE).optional(),
        traff: z.number().int().min(MIN_TRAFFIC_VALUE).optional(),
        minus_domains: z.array(domainSchema).min(MIN_MINUS_DOMAINS_ITEMS).max(MAX_MINUS_DOMAINS_ITEMS).optional()
    }).optional()
}).strict();

export type CompetitorsGetParams = z.infer<typeof competitorsGetSchema>;

export const backlinksSummarySchema = z.object({
    query: domainSchema,
    searchType: z.enum(SEARCH_TYPES).default("domain")
});

export type BacklinksSummaryParams = z.infer<typeof backlinksSummarySchema>;

export const domainKeywordsSchema = z.object({
    domain: domainSchema,
    se: searchEngineSchema,
    withSubdomains: z.boolean().optional(),
    withIntents: z.boolean().optional(),
    url: z.string().url().optional(),
    keywords: keywordArraySchema.max(MAX_KEYWORDS_ITEMS).optional(),
    minusKeywords: keywordArraySchema.max(MAX_MINUS_KEYWORDS_ITEMS).optional(),
    ...paginationSchema.shape,
    sort: z.object({
        position: sortOrderSchema.optional(),
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        traff: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        keyword_length: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
    }).partial().optional(),
    filters: z.object({
        ...positionFilterSchema.shape,
        ...costFilterSchema.shape,
        ...regionQueriesFilterSchema.shape,
        traff: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...difficultyFilterSchema.shape,
        keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        ...concurrencyFilterSchema.shape,
        right_spelling: z.boolean().optional(),
        keyword_contain: z.string().optional(),
        keyword_not_contain: z.string().optional(),
        ...intentsFilterSchema.shape,
    }).partial().optional(),
}).strict();

export type DomainKeywordsParams = z.infer<typeof domainKeywordsSchema>;

export const domainUrlsSchema = z.object({
    domain: domainSchema,
    se: searchEngineSchema,
    filters: z.object({
        url_prefix: z.string().max(MAX_URL_PREFIX_LENGTH).optional(),
        url_contain: z.string().max(MAX_URL_CONTAIN_LENGTH).optional(),
        url_not_contain: z.string().max(MAX_URL_CONTAIN_LENGTH).optional(),
    }).optional(),
    sort: z.object({
        keywords: sortOrderSchema.optional(),
    }).optional(),
    ...paginationSchema.shape,
}).strict();

export type DomainUrlsParams = z.infer<typeof domainUrlsSchema>;

export const domainRegionsCountSchema = z.object({
    domain: domainSchema,
    sort: z.enum(DOMAIN_REGIONS_SORT_FIELDS).optional(),
    order: sortOrderSchema.optional(),
}).strict();

export type DomainRegionsCountParams = z.infer<typeof domainRegionsCountSchema>;

export const domainUniqKeywordsSchema = z.object({
    se: searchEngineSchema,
    domains: z.array(domainSchema).min(MIN_UNIQ_DOMAINS).max(MAX_UNIQ_DOMAINS).refine(arr => new Set(arr).size === arr.length, {
        message: 'domains must be unique',
    }),
    minusDomain: domainSchema,
    ...paginationSchema.shape,
    filters: z.object({
        right_spelling: z.boolean().optional(),
        misspelled: z.boolean().optional(),
        keywords: keywordArraySchema.max(MAX_UNIQ_KEYWORDS_ITEMS).optional(),
        minus_keywords: keywordArraySchema.max(MAX_UNIQ_KEYWORDS_MINUS_ITEMS).optional(),
        queries: z.number().int().min(MIN_FILTER_VALUE).optional(),
        queries_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        queries_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...regionQueriesFilterSchema.shape,
        region_queries_count_wide: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...costFilterSchema.shape,
        ...concurrencyFilterSchema.shape,
        difficulty: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        ...keywordLengthFilterSchema.shape,
        traff: z.number().int().min(MIN_FILTER_VALUE).optional(),
        traff_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        traff_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...positionFilterSchema.shape,
    }).strict().optional(),
}).strict();

export type DomainUniqKeywordsParams = z.infer<typeof domainUniqKeywordsSchema>;

export const keywordGetSchema = z.object({
    keyword: keywordSchema,
    se: searchEngineSchema,
    minusKeywords: keywordArraySchema.max(MAX_MINUS_KEYWORDS_ITEMS).optional(),
    withIntents: z.boolean().optional(),
    ...paginationSchema.shape,
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        found_results: sortOrderSchema.optional(),
        keyword_length: sortOrderSchema.optional(),
    }).partial().optional(),
    filters: z.object({
        ...costFilterWithMaxSchema.shape,
        ...regionQueriesFilterWithMaxSchema.shape,
        ...keywordLengthFilterSchema.shape,
        ...difficultyFilterSchema.shape,
        ...concurrencyFilterSchema.shape,
        right_spelling: z.boolean().optional(),
        ...keywordContentFilterSchema.shape,
        lang: z.string().optional(),
        ...intentsFilterSchema.shape,
    }).strict().optional(),
}).strict();

export type KeywordGetParams = z.infer<typeof keywordGetSchema>;

export const getRelatedKeywordsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH).max(MAX_RELATED_KEYWORD_LENGTH),
    se: searchEngineSchema,
    withIntents: z.boolean().default(false).optional(),
    ...paginationSchema.shape,
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        weight: sortOrderSchema.optional(),
        keyword: sortOrderSchema.optional(),
    }).strict().optional(),
    filters: z.object({
        ...costFilterWithMaxSchema.shape,
        ...regionQueriesFilterWithMaxSchema.shape,
        ...keywordLengthFilterSchema.shape,
        ...difficultyFilterSchema.shape,
        ...concurrencyFilterSchema.shape,
        weight: z.number().int().min(MIN_WEIGHT).optional(),
        weight_from: z.number().min(MIN_WEIGHT).optional(),
        weight_to: z.number().min(MIN_WEIGHT).optional(),
        right_spelling: z.boolean().optional(),
        ...keywordContentFilterSchema.shape,
        keyword_contain_one_of_broad_match: z.array(z.string()).optional(),
        keyword_not_contain_one_of_broad_match: z.array(z.string()).optional(),
        geo_names: z.enum(["contain", "not_contain"]).optional(),
        types: z.array(z.string()).optional(),
        intents_contain: z.array(keywordIntentsSchema).optional(),
    }).strict().optional(),
}).strict();

export type GetRelatedKeywordsParams = z.infer<typeof getRelatedKeywordsSchema>;

export const keywordsInfoSchema = z.object({
    keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH)).min(MIN_KEYWORDS_INFO_ITEMS).max(MAX_KEYWORDS_INFO_ITEMS),
    se: searchEngineSchema,
    withIntents: z.boolean().optional(),
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        region_queries_count_wide: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        found_results: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
    }).strict().optional(),
    filters: z.object({
        ...costFilterSchema.shape,
        concurrency: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_CONCURRENCY).optional(),
        found_results: z.number().int().min(MIN_FILTER_VALUE).optional(),
        found_results_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        found_results_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...regionQueriesFilterSchema.shape,
        region_queries_count_wide: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...intentsFilterSchema.shape,
        right_spelling: z.boolean().optional(),
        minus_keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH)).optional(),
    }).strict().optional(),
}).strict();

export type KeywordsInfoParams = z.infer<typeof keywordsInfoSchema>;

export const keywordSuggestionsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH).max(MAX_RELATED_KEYWORD_LENGTH),
    se: searchEngineSchema,
    filters: z.object({
        minus_keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH)).optional(),
    }).strict().optional(),
    ...paginationSchema.shape,
}).strict();

export type KeywordSuggestionsParams = z.infer<typeof keywordSuggestionsSchema>;

export const keywordFullTopSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH),
    se: searchEngineSchema,
    sort: z.object({
        position: sortOrderSchema.optional(),
        url_keywords_count: sortOrderSchema.optional(),
        domain_visibility: sortOrderSchema.optional(),
        domain_keywords_organic: sortOrderSchema.optional(),
        domain_keywords_ppc: sortOrderSchema.optional(),
        domain_top_10_keywords_count: sortOrderSchema.optional(),
        domain_sdr: sortOrderSchema.optional(),
        domain_in_urls_count: sortOrderSchema.optional(),
        domain_in_domains_count: sortOrderSchema.optional(),
        domain_out_urls_count: sortOrderSchema.optional(),
        domain_out_domains_count: sortOrderSchema.optional(),
    }).strict().optional(),
    size: z.number().int().min(MIN_KEYWORD_TOP_SIZE).max(MAX_KEYWORD_TOP_SIZE).optional(),
}).strict();

export type KeywordFullTopParams = z.infer<typeof keywordFullTopSchema>;

export const keywordTopUrlsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH),
    se: searchEngineSchema.optional(),
    sort: z.string().optional(),
    order: sortOrderSchema.optional(),
    page: z.number().int().min(MIN_PAGE).optional(),
    page_size: z.union([
        z.literal(ALLOWED_PAGE_SIZES[0]),
        z.literal(ALLOWED_PAGE_SIZES[1]),
        z.literal(ALLOWED_PAGE_SIZES[2]),
        z.literal(ALLOWED_PAGE_SIZES[3]),
        z.literal(ALLOWED_PAGE_SIZES[4]),
        z.literal(ALLOWED_PAGE_SIZES[5]),
        z.literal(ALLOWED_PAGE_SIZES[6])
    ]).optional(),
}).strict();

export type KeywordTopUrlsParams = z.infer<typeof keywordTopUrlsSchema>;

export const keywordCompetitorsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH),
    se: searchEngineSchema,
    filters: z.object({
        domain: z.array(domainSchema).optional(),
        minus_domain: z.array(domainSchema).optional(),
        visible: z.number().int().optional(),
        visible_from: z.number().int().optional(),
        visible_to: z.number().int().optional(),
        traff: z.number().int().optional(),
        traff_from: z.number().int().optional(),
        traff_to: z.number().int().optional(),
        relevance: z.number().int().optional(),
        relevance_from: z.number().int().optional(),
        relevance_to: z.number().int().optional(),
        our_relevance: z.number().int().optional(),
        our_relevance_from: z.number().int().optional(),
        our_relevance_to: z.number().int().optional(),
    }).strict().optional(),
    sort: z.record(z.string(), sortOrderSchema).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_COMPETITORS_SIZE).optional(),
}).strict();

export type KeywordCompetitorsParams = z.infer<typeof keywordCompetitorsSchema>;

export const keywordTopSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH),
    se: searchEngineSchema,
    filters: z.object({
        top_size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_TOP_SIZE).default(DEFAULT_TOP_SIZE).optional(),
        ...positionFilterSchema.shape,
        url: z.string().url().optional(),
        exact_url: z.string().url().optional(),
        domain: z.string().optional(),
        minus_domain: z.string().optional(),
        subdomain: z.string().optional(),
    }).strict().optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).optional(),
}).strict();

export type KeywordTopParams = z.infer<typeof keywordTopSchema>;

// Complex filter schemas
const complexFilterItemSchema = createComplexFilterSchema(ANCHORS_COMPLEX_FILTER_FIELDS);
const backlinksComplexFilterItemSchema = createComplexFilterSchema(BACKLINKS_COMPLEX_FILTER_FIELDS);
const referringDomainsComplexFilterItemSchema = createComplexFilterSchema(REFERRING_DOMAINS_COMPLEX_FILTER_FIELDS);

export const anchorsSchema = z.object({
    query: z.string(),
    searchType: z.enum(SEARCH_TYPES_URL),
    anchor: z.string().optional(),
    count: z.string().optional(),
    sort: z.enum(ANCHORS_SORT_FIELDS).default("refDomains").optional(),
    order: sortOrderSchema.default("desc").optional(),
    ...paginationSchema.shape,
    complexFilter: z.array(z.array(complexFilterItemSchema)).optional()
}).strict().refine(createQueryValidationRefine(true), {
    message: "Invalid query format for the specified search type",
    path: ["query"]
});

export type AnchorsParams = z.infer<typeof anchorsSchema>;

export const getActiveBacklinksSchema = z.object({
    query: z.string(),
    searchType: z.enum(SEARCH_TYPES_URL).default("domain"),
    sort: z.enum(BACKLINKS_SORT_FIELDS).default("check").optional(),
    order: sortOrderSchema.optional(),
    linkPerDomain: z.number().int().min(1).max(1).optional(),
    complexFilter: z.array(z.array(backlinksComplexFilterItemSchema)).optional(),
    ...paginationSchema.shape,
}).strict().refine(createQueryValidationRefine(true), {
    message: "Invalid query format for the specified search type",
    path: ["query"]
});

export type GetActiveBacklinksParams = z.infer<typeof getActiveBacklinksSchema>;

export const getReferringDomainsSchema = z.object({
    query: domainSchema,
    searchType: z.enum(SEARCH_TYPES).default("domain"),
    sort: z.enum(REFERRING_DOMAINS_SORT_FIELDS).default("check").optional(),
    order: sortOrderSchema.optional(),
    complexFilter: z.array(z.array(referringDomainsComplexFilterItemSchema)).optional(),
    ...paginationSchema.shape,
}).strict();

export type GetReferringDomainsParams = z.infer<typeof getReferringDomainsSchema>;

// Lost backlinks validation schema
const lostBacklinksComplexFilterItemSchema = z.object({
    name: z.enum(LOST_BACKLINKS_COMPLEX_FILTER_FIELDS),
    operator: z.enum(COMPLEX_FILTER_COMPARE_TYPES),
    value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))])
});

export const getLostBacklinksSchema = z.object({
    query: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH),
    searchType: z.enum(SEARCH_TYPES_URL).default("domain"),
    sort: z.enum(LOST_BACKLINKS_SORT_FIELDS).default("check").optional(),
    order: sortOrderSchema.optional(),
    complexFilter: z.array(z.array(lostBacklinksComplexFilterItemSchema)).optional(),
    additionalFilters: z.array(z.enum(ADDITIONAL_FILTERS)).optional(),
    ...paginationSchema.shape,
}).strict().refine((data) => {
    if (data.searchType === "url" || data.searchType === "part_url") {
        return true;
    } else {
        return new RegExp(DOMAIN_NAME_REGEX).test(data.query);
    }
}, {
    message: "Invalid domain format for domain search type"
});

export type GetLostBacklinksParams = z.infer<typeof getLostBacklinksSchema>;

// Top anchors validation schema
export const getTopAnchorsSchema = z.object({
    query: domainSchema,
    searchType: z.enum(SEARCH_TYPES).default("domain")
}).strict();

export type GetTopAnchorsParams = z.infer<typeof getTopAnchorsSchema>;

// Top pages validation schema
const topPagesComplexFilterItemSchema = z.union([
    z.object({
        field: z.enum(TOP_PAGES_COMPLEX_FILTER_FIELDS),
        compareType: z.enum(COMPLEX_FILTER_COMPARE_TYPES),
        value: z.array(z.union([z.string(), z.number()]))
    }),
    z.object({
        additional_filters: z.enum(ADDITIONAL_FILTERS)
    })
]);

export const getTopPagesByBacklinksSchema = z.object({
    query: domainSchema,
    searchType: z.enum(SEARCH_TYPES).default("domain"),
    sort: z.enum(TOP_PAGES_SORT_FIELDS).default("lastupdate"),
    order: sortOrderSchema.default("desc"),
    complexFilter: z.array(z.array(topPagesComplexFilterItemSchema)).optional(),
    page: z.number().int().min(MIN_PAGE).default(1),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
}).strict();

export type GetTopPagesByBacklinksParams = z.infer<typeof getTopPagesByBacklinksSchema>;

// Backlinks intersection validation schema
const backlinksIntersectionComplexFilterItemSchema = createComplexFilterSchema(BACKLINKS_INTERSECTION_COMPLEX_FILTER_FIELDS);

export const getBacklinksIntersectionSchema = z.object({
    query: domainSchema,
    intersect: z.array(domainSchema).min(1).max(MAX_INTERSECT_DOMAINS),
    sort: z.enum(BACKLINKS_INTERSECTION_SORT_FIELDS).default("domain_rank"),
    order: sortOrderSchema.default("desc"),
    complexFilter: z.array(z.array(backlinksIntersectionComplexFilterItemSchema)).optional(),
    page: z.number().int().min(MIN_PAGE).default(1),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
}).strict();

export type GetBacklinksIntersectionParams = z.infer<typeof getBacklinksIntersectionSchema>;

// Active outlinks validation schema
const activeOutlinksComplexFilterItemSchema = createComplexFilterSchema(ACTIVE_OUTLINKS_COMPLEX_FILTER_FIELDS);

export const getActiveOutlinksSchema = z.object({
    query: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH),
    searchType: z.enum(SEARCH_TYPES_URL).default("domain"),
    sort: z.enum(ACTIVE_OUTLINKS_SORT_FIELDS).default("check"),
    order: sortOrderSchema.default("desc"),
    linkPerDomain: z.number().int().min(1).optional(),
    complexFilter: z.array(z.array(activeOutlinksComplexFilterItemSchema)).optional(),
    page: z.number().int().min(MIN_PAGE).default(1),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
}).strict();

export type GetActiveOutlinksParams = z.infer<typeof getActiveOutlinksSchema>;

// Active outlink domains validation schema
const activeOutlinkDomainsComplexFilterItemSchema = createComplexFilterSchema(ACTIVE_OUTLINK_DOMAINS_COMPLEX_FILTER_FIELDS);

export const getActiveOutlinkDomainsSchema = z.object({
    query: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH),
    searchType: z.enum(SEARCH_TYPES_URL).default("domain"),
    sort: z.enum(ACTIVE_OUTLINK_DOMAINS_SORT_FIELDS).default("domain_rank"),
    order: sortOrderSchema.default("desc"),
    complexFilter: z.array(z.array(activeOutlinkDomainsComplexFilterItemSchema)).optional(),
    page: z.number().int().min(MIN_PAGE).default(1),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
}).strict();

export type GetActiveOutlinkDomainsParams = z.infer<typeof getActiveOutlinkDomainsSchema>;

// Threat backlinks validation schema
const threatBacklinksComplexFilterItemSchema = createComplexFilterSchema(BACKLINKS_THREAT_COMPLEX_FILTER_FIELDS);

export const getThreatBacklinksSchema = z.object({
    query: domainSchema,
    searchType: z.enum(SEARCH_TYPES).default("domain"),
    sort: z.enum(BACKLINKS_THREAT_SORT_FIELDS).default("lastupdate"),
    order: sortOrderSchema.default("desc"),
    linkPerDomain: z.number().int().min(1).optional(),
    complexFilter: z.array(z.array(threatBacklinksComplexFilterItemSchema)).optional(),
    page: z.number().int().min(MIN_PAGE).default(1),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
}).strict();

export type GetThreatBacklinksParams = z.infer<typeof getThreatBacklinksSchema>;

// Project management validation schemas
export const createProjectSchema = z.object({
    domain: domainSchema,
    name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_NAME_LENGTH),
    groups: z.array(
        z.object({
            name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_GROUP_NAME_LENGTH)
        })
    ).optional()
}).strict();

export type CreateProjectParams = z.infer<typeof createProjectSchema>;

export const deleteProjectSchema = z.object({
    project_id: z.number().int().min(MIN_PROJECT_ID)
}).strict();

export type DeleteProjectParams = z.infer<typeof deleteProjectSchema>;

export const getProjectsSchema = z.object({
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.union([
        z.literal(PROJECT_ALLOWED_PAGE_SIZES[0]),
        z.literal(PROJECT_ALLOWED_PAGE_SIZES[1]),
        z.literal(PROJECT_ALLOWED_PAGE_SIZES[2]),
        z.literal(PROJECT_ALLOWED_PAGE_SIZES[3]),
        z.literal(PROJECT_ALLOWED_PAGE_SIZES[4])
    ]).default(DEFAULT_PROJECT_PAGE_SIZE).optional()
}).strict();

export type GetProjectsParams = z.infer<typeof getProjectsSchema>;

// Credits API validation schemas (no parameters required)
export const getAuditStatsSchema = z.object({}).strict();

export type GetAuditStatsParams = z.infer<typeof getAuditStatsSchema>;

export const getCreditsStatsSchema = z.object({}).strict();

export type GetCreditsStatsParams = z.infer<typeof getCreditsStatsSchema>;

// Rank Tracker validation schemas
export const getRtProjectsListSchema = z.object({
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    pageSize: z.union([
        z.literal(RT_ALLOWED_PAGE_SIZES[0]),
        z.literal(RT_ALLOWED_PAGE_SIZES[1]),
        z.literal(RT_ALLOWED_PAGE_SIZES[2]),
        z.literal(RT_ALLOWED_PAGE_SIZES[3])
    ]).default(DEFAULT_RT_PAGE_SIZE).optional()
}).strict();

export type GetRtProjectsListParams = z.infer<typeof getRtProjectsListSchema>;

export const getRtProjectStatusSchema = z.object({
    projectId: z.number().int().min(MIN_RT_PROJECT_ID),
    regionId: z.number().int().min(MIN_RT_REGION_ID)
}).strict();

export type GetRtProjectStatusParams = z.infer<typeof getRtProjectStatusSchema>;

export const getRtProjectRegionsListSchema = z.object({
    projectId: z.number().int().min(MIN_RT_PROJECT_ID)
}).strict();

export type GetRtProjectRegionsListParams = z.infer<typeof getRtProjectRegionsListSchema>;

export const getRtProjectKeywordSerpHistorySchema = z.object({
    projectId: z.number().int().min(MIN_RT_PROJECT_ID),
    projectRegionId: z.number().int().min(MIN_RT_REGION_ID),
    page: z.number().int().min(MIN_PAGE).default(1),
    pageSize: z.union([
        z.literal(RT_ALLOWED_PAGE_SIZES[0]),
        z.literal(RT_ALLOWED_PAGE_SIZES[1]),
        z.literal(RT_ALLOWED_PAGE_SIZES[2]),
        z.literal(RT_ALLOWED_PAGE_SIZES[3])
    ]).default(DEFAULT_RT_PAGE_SIZE).optional(),
    dateFrom: z.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/).optional(),
    dateTo: z.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/).optional(),
    sort: z.union([
        z.literal(RT_SERP_HISTORY_SORT_TYPES[0]),
        z.literal(RT_SERP_HISTORY_SORT_TYPES[1])
    ]).optional(),
    order: z.union([
        z.literal(SORT_ORDER[0]),
        z.literal(SORT_ORDER[1])
    ]).optional(),
    keywords: z.array(z.string()).max(MAX_RT_KEYWORDS_FILTER).optional(),
    withTags: z.boolean().default(false).optional()
}).strict();

export type GetRtProjectKeywordSerpHistoryParams = z.infer<typeof getRtProjectKeywordSerpHistorySchema>;

export const getRtProjectUrlSerpHistorySchema = z.object({
    projectId: z.number().int().min(MIN_RT_PROJECT_ID),
    projectRegionId: z.number().int().min(MIN_RT_REGION_ID),
    page: z.number().int().min(MIN_PAGE).default(1),
    pageSize: z.union([
        z.literal(RT_ALLOWED_PAGE_SIZES[0]),
        z.literal(RT_ALLOWED_PAGE_SIZES[1]),
        z.literal(RT_ALLOWED_PAGE_SIZES[2]),
        z.literal(RT_ALLOWED_PAGE_SIZES[3])
    ]).default(DEFAULT_RT_PAGE_SIZE).optional(),
    dateFrom: z.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/).optional(),
    dateTo: z.string().regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/).optional(),
    sort: z.union([
        z.literal(RT_SERP_HISTORY_SORT_TYPES[0]),
        z.literal(RT_SERP_HISTORY_SORT_TYPES[1])
    ]).optional(),
    order: z.union([
        z.literal(SORT_ORDER[0]),
        z.literal(SORT_ORDER[1])
    ]).optional(),
    keywords: z.array(z.string()).max(MAX_RT_KEYWORDS_FILTER).optional(),
    withTags: z.boolean().default(false).optional(),
    domain: z.string().optional()
}).strict();

export type GetRtProjectUrlSerpHistoryParams = z.infer<typeof getRtProjectUrlSerpHistorySchema>;

// URL Analysis schemas

export const urlSummaryTrafficSchema = z.object({
    se: searchEngineSchema,
    domain: domainSchema,
    urlContains: z.string().min(1).max(MAX_URL_CONTAIN_LENGTH),
    output_data: z.enum(URL_OUTPUT_DATA_TYPES).optional(),
}).strict();

export type UrlSummaryTrafficParams = z.infer<typeof urlSummaryTrafficSchema>;

export const urlCompetitorsSchema = z.object({
    se: searchEngineSchema,
    url: z.string().url(),
    sort: z.object({
        cnt: sortOrderSchema.optional()
    }).optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
}).strict();

export type UrlCompetitorsParams = z.infer<typeof urlCompetitorsSchema>;

export const urlKeywordsSchema = z.object({
    se: searchEngineSchema,
    url: z.string().url(),
    withIntents: z.boolean().optional(),
    sort: z.object({
        position: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        traff: sortOrderSchema.optional(),
    }).optional(),
    filters: z.object({
        ...costFilterWithMaxSchema.shape,
        ...positionFilterSchema.shape,
        ...concurrencyFilterSchema.shape,
        keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        ...difficultyFilterSchema.shape,
        traff: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...regionQueriesFilterSchema.shape,
        region_queries_count_wide: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        url_contains: z.string().optional(),
        right_spelling: z.boolean().optional(),
        keyword_contain: z.string().optional(),
        keyword_not_contain: z.string().optional(),
        keyword_contain_one_of: z.string().optional(),
        keyword_not_contain_one_of: z.string().optional(),
        intents_contain: z.array(keywordIntentsSchema).optional(),
        intents_not_contain: z.array(keywordIntentsSchema).optional(),
    }).optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
}).strict();

export type UrlKeywordsParams = z.infer<typeof urlKeywordsSchema>;

export const urlMissingKeywordsSchema = z.object({
    url: z.string().url(),
    se: searchEngineSchema,
    sort: z.object({
        weight: sortOrderSchema.optional()
    }).optional(),
    filters: z.object({
        region_queries_count: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        ...costFilterSchema.shape,
        keyword: z.string().optional(),
        minus_keywords: keywordArraySchema.optional(),
        concurrency: z.number().min(MIN_FILTER_VALUE).optional(),
        concurrency_to: z.number().min(MIN_FILTER_VALUE).optional(),
        concurrency_from: z.number().min(MIN_FILTER_VALUE).optional(),
        weight: z.number().int().min(MIN_FILTER_VALUE).optional(),
        weight_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        weight_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        right_spelling: z.boolean().optional(),
    }).optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
}).strict();

export type UrlMissingKeywordsParams = z.infer<typeof urlMissingKeywordsSchema>;



const userAgentIdSchema = z.number().int().min(0).max(5);
const scheduleRepeatIdSchema = z.number().int().min(0).max(5);
const intervalIdSchema = z.number().int().min(0).max(5);
const scanTypeSchema = z.number().int().min(1).max(3);

const mainSettingsSchema = z.object({
    domain: z.string().min(MIN_DOMAIN_LENGTH).max(MAX_DOMAIN_LENGTH),
    name: z.string().min(MIN_DOMAIN_LENGTH),
    subdomainsCheck: z.boolean(),
    pagesLimit: z.number().int().min(MIN_PAGES_LIMIT),
    scanSpeed: z.number().int().min(MIN_SCAN_SPEED).max(MAX_SCAN_SPEED),
    autoSpeed: z.boolean(),
    scanNoIndex: z.boolean(),
    autoUserAgent: z.boolean(),
    scanWrongCanonical: z.boolean(),
    scanDuration: z.number().int().min(MIN_SCAN_DURATION),
    folderDepth: z.number().int().min(MIN_FOLDER_DEPTH),
    urlDepth: z.number().int().min(MIN_URL_DEPTH),
    userAgent: userAgentIdSchema,
    robotsTxt: z.boolean(),
    withImages: z.boolean(),
});

const keywordsBlockSchema = z.object({
    checked: z.boolean(),
    keywords: z.string(),
});

const baseAuthBlockSchema = z.object({
    login: z.string(),
    password: z.string(),
});

const mailTriggerSettingsSchema = z.object({
    emails: z.array(z.string()),
    interval: intervalIdSchema,
    enabled: z.boolean(),
});

const scheduleSettingsSchema = z.object({
    scheduleRepeatOption: scheduleRepeatIdSchema,
});

const scanSettingSchema = z.object({
    type: scanTypeSchema,
    list: z.array(z.string()),
    importedFilename: z.string().optional(),
});

const errorsSettingsSchema = z.object({
    tiny_title: z.number().int().min(MIN_TITLE_LENGTH),
    long_title: z.number().int().min(MIN_TITLE_LENGTH),
    tiny_desc: z.number().int().min(MIN_DESC_LENGTH),
    long_desc: z.number().int().min(MIN_DESC_LENGTH),
    long_url: z.number().int().min(MIN_URL_LENGTH),
    large_image_size: z.number().int().min(MIN_IMAGE_SIZE),
    large_page_size: z.number().int().min(MIN_PAGE_SIZE),
    many_external_links: z.number().int().min(MIN_EXTERNAL_LINKS),
});

export const getSiteAuditSettingsSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
}).strict();

export type GetSiteAuditSettingsParams = z.infer<typeof getSiteAuditSettingsSchema>;

export const setSiteAuditSettingsSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
    mainSettings: mainSettingsSchema,
    dontScanKeywordsBlock: keywordsBlockSchema,
    onlyScanKeywordsBlock: keywordsBlockSchema,
    baseAuthBlock: baseAuthBlockSchema,
    mailTriggerSettings: mailTriggerSettingsSchema,
    scheduleSettings: scheduleSettingsSchema,
    scanSetting: scanSettingSchema,
    errorsSettings: errorsSettingsSchema.optional(),
}).strict();

export type SetSiteAuditSettingsParams = z.infer<typeof setSiteAuditSettingsSchema>;

export const startSiteAuditSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
}).strict();

export type StartSiteAuditParams = z.infer<typeof startSiteAuditSchema>;

export const stopSiteAuditSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
}).strict();

export type StopSiteAuditParams = z.infer<typeof stopSiteAuditSchema>;

export const getCategoriesStatisticSchema = z.object({
    reportId: z.number().int().min(MIN_REPORT_ID),
}).strict();

export type GetCategoriesStatisticParams = z.infer<typeof getCategoriesStatisticSchema>;

export const getHistoryByCountErrorSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
    errorName: z.string(),
    limit: z.number().int().min(1).default(DEFAULT_AUDIT_LIMIT),
    offset: z.number().int().min(MIN_AUDIT_OFFSET).default(MIN_AUDIT_OFFSET),
}).strict();

export type GetHistoryByCountErrorParams = z.infer<typeof getHistoryByCountErrorSchema>;

export const getSiteAuditsListSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
    limit: z.number().int().min(1).default(DEFAULT_AUDIT_LIMIT),
    offset: z.number().int().min(MIN_AUDIT_OFFSET).default(MIN_AUDIT_OFFSET),
}).strict();

export type GetSiteAuditsListParams = z.infer<typeof getSiteAuditsListSchema>;

export const getScanUserUrlListSchema = z.object({
    projectId: z.number().int().min(MIN_PROJECT_ID),
}).strict();

export type GetScanUserUrlListParams = z.infer<typeof getScanUserUrlListSchema>;

export const getDefaultSettingsSchema = z.object({}).strict();

export type GetDefaultSettingsParams = z.infer<typeof getDefaultSettingsSchema>;

export const getBasicInfoSchema = z.object({
    reportId: z.number().int().min(MIN_REPORT_ID),
}).strict();

export type GetBasicInfoParams = z.infer<typeof getBasicInfoSchema>;

export const getReportWithoutDetailsSchema = z.object({
    reportId: z.number().int().min(MIN_REPORT_ID),
    compareReportId: z.number().int().min(MIN_REPORT_ID).optional(),
}).strict();

export type GetReportWithoutDetailsParams = z.infer<typeof getReportWithoutDetailsSchema>;

const errorDisplayModeSchema = z.enum(SITE_AUDIT_ERROR_DISPLAY_MODES);

export const getErrorElementsSchema = z.object({
    reportId: z.number().int().min(MIN_REPORT_ID),
    compareReportId: z.number().int().min(MIN_REPORT_ID),
    projectId: z.number().int().min(MIN_PROJECT_ID),
    errorName: z.string(),
    mode: errorDisplayModeSchema.default("all"),
    limit: z.number().int().min(1).default(DEFAULT_ERROR_ELEMENTS_LIMIT),
    offset: z.number().int().min(MIN_AUDIT_OFFSET).default(MIN_AUDIT_OFFSET),
}).strict();

export type GetErrorElementsParams = z.infer<typeof getErrorElementsSchema>;

export const getSubElementsByCrcSchema = z.object({
    reportId: z.number().int().min(MIN_REPORT_ID),
    compareReportId: z.number().int().min(MIN_REPORT_ID).optional(),
    projectId: z.number().int().min(MIN_PROJECT_ID),
    errorName: z.string(),
    mode: errorDisplayModeSchema.default("all"),
    limit: z.number().int().min(1).default(DEFAULT_AUDIT_LIMIT),
    offset: z.number().int().min(MIN_AUDIT_OFFSET).default(MIN_AUDIT_OFFSET),
    crc: z.number().int(),
}).strict();

export type GetSubElementsByCrcParams = z.infer<typeof getSubElementsByCrcSchema>;
