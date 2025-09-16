import { z } from 'zod';
import { SEARCH_ENGINES } from '../types/serpstat.js';
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
} from './constants.js';

const searchEngineSchema = z.enum(SEARCH_ENGINES);
const sortOrderSchema = z.enum(SORT_ORDER);
const keywordIntentsSchema = z.enum(KEYWORD_INTENTS);

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
    domain: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    se: z.enum(MAIN_SEARCH_ENGINES),
    size: z.number().int().min(MIN_COMPETITORS_SIZE).max(MAX_COMPETITORS_SIZE).default(DEFAULT_COMPETITORS_HANDLER_SIZE),
    filters: z.object({
        visible: z.number().min(MIN_VISIBLE_VALUE).optional(),
        traff: z.number().int().min(MIN_TRAFFIC_VALUE).optional(),
        minus_domains: z.array(
            z.string().regex(new RegExp(DOMAIN_NAME_REGEX))
        ).min(MIN_MINUS_DOMAINS_ITEMS).max(MAX_MINUS_DOMAINS_ITEMS).optional()
    }).optional()
}).strict();

export type CompetitorsGetParams = z.infer<typeof competitorsGetSchema>;

export const backlinksSummarySchema = z.object({
    query: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    searchType: z.enum(SEARCH_TYPES).default("domain")
});

export type BacklinksSummaryParams = z.infer<typeof backlinksSummarySchema>;

export const domainKeywordsSchema = z.object({
    domain: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    se: z.enum(MAIN_SEARCH_ENGINES),
    withSubdomains: z.boolean().optional(),
    withIntents: z.boolean().optional(),
    url: z.string().url().optional(),
    keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH)).max(MAX_KEYWORDS_ITEMS).optional(),
    minusKeywords: z.array(z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH)).max(MAX_MINUS_KEYWORDS_ITEMS).optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
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
        position: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
        position_from: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
        position_to: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
        cost: z.number().min(MIN_FILTER_VALUE).optional(),
        cost_from: z.number().min(MIN_FILTER_VALUE).optional(),
        cost_to: z.number().min(MIN_FILTER_VALUE).optional(),
        region_queries_count: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        traff: z.number().int().min(MIN_FILTER_VALUE).optional(),
        difficulty: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_from: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_to: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        concurrency: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_from: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_to: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        right_spelling: z.boolean().optional(),
        keyword_contain: z.string().optional(),
        keyword_not_contain: z.string().optional(),
        intents_contain: z.array(keywordIntentsSchema).optional(),
        intents_not_contain: z.array(keywordIntentsSchema).optional(),
    }).partial().optional(),
}).strict();

export type DomainKeywordsParams = z.infer<typeof domainKeywordsSchema>;

export const domainUrlsSchema = z.object({
    domain: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    se: z.enum(MAIN_SEARCH_ENGINES),
    filters: z.object({
        url_prefix: z.string().max(MAX_URL_PREFIX_LENGTH).optional(),
        url_contain: z.string().max(MAX_URL_CONTAIN_LENGTH).optional(),
        url_not_contain: z.string().max(MAX_URL_CONTAIN_LENGTH).optional(),
    }).optional(),
    sort: z.object({
        keywords: sortOrderSchema.optional(),
    }).optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
}).strict();

export type DomainUrlsParams = z.infer<typeof domainUrlsSchema>;

export const domainRegionsCountSchema = z.object({
    domain: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    sort: z.enum(DOMAIN_REGIONS_SORT_FIELDS).optional(),
    order: sortOrderSchema.optional(),
}).strict();

export type DomainRegionsCountParams = z.infer<typeof domainRegionsCountSchema>;

export const domainUniqKeywordsSchema = z.object({
    se: z.enum(MAIN_SEARCH_ENGINES),
    domains: z.array(
        z.string()
            .min(MIN_DOMAIN_LENGTH)
            .max(MAX_DOMAIN_LENGTH)
            .regex(new RegExp(DOMAIN_NAME_REGEX))
    ).min(MIN_UNIQ_DOMAINS).max(MAX_UNIQ_DOMAINS).refine(arr => new Set(arr).size === arr.length, {
        message: 'domains must be unique',
    }),
    minusDomain: z.string()
        .min(MIN_DOMAIN_LENGTH)
        .max(MAX_DOMAIN_LENGTH)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
    filters: z.object({
        right_spelling: z.boolean().optional(),
        misspelled: z.boolean().optional(),
        keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH)).max(MAX_UNIQ_KEYWORDS_ITEMS).optional(),
        minus_keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH)).max(MAX_UNIQ_KEYWORDS_MINUS_ITEMS).optional(),
        queries: z.number().int().min(MIN_FILTER_VALUE).optional(),
        queries_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        queries_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        cost: z.number().min(MIN_FILTER_VALUE).optional(),
        cost_from: z.number().min(MIN_FILTER_VALUE).optional(),
        cost_to: z.number().min(MIN_FILTER_VALUE).optional(),
        concurrency: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_from: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_to: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        difficulty: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        keyword_length_from: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        keyword_length_to: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        traff: z.number().int().min(MIN_FILTER_VALUE).optional(),
        traff_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        traff_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        position: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
        position_from: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
        position_to: z.number().int().min(MIN_FILTER_POSITION).max(MAX_FILTER_POSITION).optional(),
    }).strict().optional(),
}).strict();

export type DomainUniqKeywordsParams = z.infer<typeof domainUniqKeywordsSchema>;

export const keywordGetSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH),
    se: z.enum(MAIN_SEARCH_ENGINES),
    minusKeywords: z.array(z.string().min(MIN_KEYWORD_LENGTH).max(MAX_KEYWORD_LENGTH)).max(MAX_MINUS_KEYWORDS_ITEMS).optional(),
    withIntents: z.boolean().optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        found_results: sortOrderSchema.optional(),
        keyword_length: sortOrderSchema.optional(),
    }).partial().optional(),
    filters: z.object({
        cost: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
        cost_from: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
        cost_to: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
        region_queries_count: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
        region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
        region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
        keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        keyword_length_from: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        keyword_length_to: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        difficulty: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        concurrency: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_from: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_to: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        right_spelling: z.boolean().optional(),
        keyword_contain: z.array(z.string()).optional(),
        keyword_not_contain: z.array(z.string()).optional(),
        keyword_contain_one_of: z.array(z.string()).optional(),
        keyword_not_contain_one_of: z.array(z.string()).optional(),
        keyword_contain_broad_match: z.array(z.string()).optional(),
        keyword_not_contain_broad_match: z.array(z.string()).optional(),
        lang: z.string().optional(),
        intents_contain: z.array(keywordIntentsSchema).optional(),
        intents_not_contain: z.array(keywordIntentsSchema).optional(),
    }).strict().optional(),
}).strict();

export type KeywordGetParams = z.infer<typeof keywordGetSchema>;

export const getRelatedKeywordsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH).max(MAX_RELATED_KEYWORD_LENGTH),
    se: z.enum(MAIN_SEARCH_ENGINES),
    withIntents: z.boolean().default(false).optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        weight: sortOrderSchema.optional(),
        keyword: sortOrderSchema.optional(),
    }).strict().optional(),
    filters: z.object({
        cost: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
        cost_from: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
        cost_to: z.number().min(MIN_FILTER_VALUE).max(MAX_FILTER_COST).optional(),
        region_queries_count: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
        region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
        region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_QUERIES_COUNT).optional(),
        keyword_length: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        keyword_length_from: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        keyword_length_to: z.number().int().min(MIN_KEYWORD_LENGTH).optional(),
        difficulty: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        difficulty_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_DIFFICULTY).optional(),
        concurrency: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_from: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_to: z.number().int().min(MIN_FILTER_CONCURRENCY).max(MAX_FILTER_CONCURRENCY).optional(),
        weight: z.number().int().min(MIN_WEIGHT).optional(),
        weight_from: z.number().min(MIN_WEIGHT).optional(),
        weight_to: z.number().min(MIN_WEIGHT).optional(),
        right_spelling: z.boolean().optional(),
        keyword_contain: z.array(z.string()).optional(),
        keyword_not_contain: z.array(z.string()).optional(),
        keyword_contain_one_of: z.array(z.string()).optional(),
        keyword_not_contain_one_of: z.array(z.string()).optional(),
        keyword_contain_broad_match: z.array(z.string()).optional(),
        keyword_not_contain_broad_match: z.array(z.string()).optional(),
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
    se: z.enum(MAIN_SEARCH_ENGINES),
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
        cost: z.number().min(MIN_FILTER_VALUE).optional(),
        cost_from: z.number().min(MIN_FILTER_VALUE).optional(),
        cost_to: z.number().min(MIN_FILTER_VALUE).optional(),
        concurrency: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_from: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_CONCURRENCY).optional(),
        concurrency_to: z.number().int().min(MIN_FILTER_VALUE).max(MAX_FILTER_CONCURRENCY).optional(),
        found_results: z.number().int().min(MIN_FILTER_VALUE).optional(),
        found_results_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        found_results_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_from: z.number().int().min(MIN_FILTER_VALUE).optional(),
        region_queries_count_wide_to: z.number().int().min(MIN_FILTER_VALUE).optional(),
        intents_contain: z.array(keywordIntentsSchema).optional(),
        intents_not_contain: z.array(keywordIntentsSchema).optional(),
        right_spelling: z.boolean().optional(),
        minus_keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH)).optional(),
    }).strict().optional(),
}).strict();

export type KeywordsInfoParams = z.infer<typeof keywordsInfoSchema>;

export const keywordSuggestionsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH).max(MAX_RELATED_KEYWORD_LENGTH),
    se: z.enum(MAIN_SEARCH_ENGINES),
    filters: z.object({
        minus_keywords: z.array(z.string().min(MIN_KEYWORD_LENGTH)).optional(),
    }).strict().optional(),
    page: z.number().int().min(MIN_PAGE).default(1).optional(),
    size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE).optional(),
}).strict();

export type KeywordSuggestionsParams = z.infer<typeof keywordSuggestionsSchema>;

export const keywordFullTopSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH),
    se: z.enum(MAIN_SEARCH_ENGINES),
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
    se: z.enum(MAIN_SEARCH_ENGINES).optional(),
    sort: z.string().optional(),
    order: sortOrderSchema.optional(),
    page: z.number().int().min(MIN_PAGE).optional(),
    page_size: z.number().int().min(MIN_KEYWORD_LENGTH).max(MAX_PAGE_SIZE).optional(),
}).strict();

export type KeywordTopUrlsParams = z.infer<typeof keywordTopUrlsSchema>;

export const keywordCompetitorsSchema = z.object({
    keyword: z.string().min(MIN_KEYWORD_LENGTH),
    se: z.enum(MAIN_SEARCH_ENGINES),
    filters: z.object({
        domain: z.array(z.string().regex(new RegExp(DOMAIN_NAME_REGEX))).optional(),
        minus_domain: z.array(z.string().regex(new RegExp(DOMAIN_NAME_REGEX))).optional(),
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
