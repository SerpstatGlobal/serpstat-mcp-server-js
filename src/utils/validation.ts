import { z } from 'zod';
import { SEARCH_ENGINES } from '../types/serpstat.js';
import {
    SORT_ORDER,
    SEARCH_TYPES,
    KEYWORD_SORT_FIELDS,
    KEYWORD_GET_SORT_FIELDS,
    URL_SORT_FIELDS,
    DOMAIN_REGIONS_SORT_FIELDS,
    KEYWORD_INTENTS,
    MAIN_SEARCH_ENGINES,
    DOMAIN_NAME_REGEX,
    
} from './constants.js';

const searchEngineSchema = z.enum(SEARCH_ENGINES);
const sortOrderSchema = z.enum(SORT_ORDER);
const keywordIntentsSchema = z.enum(KEYWORD_INTENTS);

export const domainsInfoSchema = z.object({
    domains: z.array(z.string().min(1)).min(1).max(10),
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
        .min(4)
        .max(253)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    se: z.enum(MAIN_SEARCH_ENGINES),
    size: z.number().int().min(1).max(100).default(10),
    filters: z.object({
        visible: z.number().min(0).optional(),
        traff: z.number().int().min(0).optional(),
        minus_domains: z.array(
            z.string().regex(new RegExp(DOMAIN_NAME_REGEX))
        ).min(1).max(50).optional()
    }).optional()
}).strict();

export type CompetitorsGetParams = z.infer<typeof competitorsGetSchema>;

export const backlinksSummarySchema = z.object({
    query: z.string()
        .min(4)
        .max(253)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    searchType: z.enum(SEARCH_TYPES).default("domain")
});

export type BacklinksSummaryParams = z.infer<typeof backlinksSummarySchema>;

export const domainKeywordsSchema = z.object({
    domain: z.string()
        .min(4)
        .max(253)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    se: z.enum(MAIN_SEARCH_ENGINES),
    withSubdomains: z.boolean().optional(),
    withIntents: z.boolean().optional(),
    url: z.string().url().optional(),
    keywords: z.array(z.string().min(1).max(100)).max(50).optional(),
    minusKeywords: z.array(z.string().min(1).max(100)).max(50).optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
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
        position: z.number().int().min(1).max(100).optional(),
        position_from: z.number().int().min(1).max(100).optional(),
        position_to: z.number().int().min(1).max(100).optional(),
        cost: z.number().min(0).optional(),
        cost_from: z.number().min(0).optional(),
        cost_to: z.number().min(0).optional(),
        region_queries_count: z.number().int().min(0).optional(),
        region_queries_count_from: z.number().int().min(0).optional(),
        region_queries_count_to: z.number().int().min(0).optional(),
        traff: z.number().int().min(0).optional(),
        difficulty: z.number().min(0).max(100).optional(),
        difficulty_from: z.number().min(0).max(100).optional(),
        difficulty_to: z.number().min(0).max(100).optional(),
        keyword_length: z.number().int().min(1).optional(),
        concurrency: z.number().int().min(1).max(100).optional(),
        concurrency_from: z.number().int().min(1).max(100).optional(),
        concurrency_to: z.number().int().min(1).max(100).optional(),
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
        .min(4)
        .max(253)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    se: z.enum(MAIN_SEARCH_ENGINES),
    filters: z.object({
        url_prefix: z.string().max(500).optional(),
        url_contain: z.string().max(200).optional(),
        url_not_contain: z.string().max(200).optional(),
    }).optional(),
    sort: z.object({
        keywords: sortOrderSchema.optional(),
    }).optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
}).strict();

export type DomainUrlsParams = z.infer<typeof domainUrlsSchema>;

export const domainRegionsCountSchema = z.object({
    domain: z.string()
        .min(4)
        .max(253)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    sort: z.enum(DOMAIN_REGIONS_SORT_FIELDS).optional(),
    order: sortOrderSchema.optional(),
}).strict();

export type DomainRegionsCountParams = z.infer<typeof domainRegionsCountSchema>;

export const domainUniqKeywordsSchema = z.object({
    se: z.enum(MAIN_SEARCH_ENGINES),
    domains: z.array(
        z.string()
            .min(4)
            .max(253)
            .regex(new RegExp(DOMAIN_NAME_REGEX))
    ).min(1).max(2).refine(arr => new Set(arr).size === arr.length, {
        message: 'domains must be unique',
    }),
    minusDomain: z.string()
        .min(4)
        .max(253)
        .regex(new RegExp(DOMAIN_NAME_REGEX)),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
    filters: z.object({
        right_spelling: z.boolean().optional(),
        misspelled: z.boolean().optional(),
        keywords: z.array(z.string().min(1).max(100)).max(100).optional(),
        minus_keywords: z.array(z.string().min(1).max(100)).max(100).optional(),
        queries: z.number().int().min(0).optional(),
        queries_from: z.number().int().min(0).optional(),
        queries_to: z.number().int().min(0).optional(),
        region_queries_count: z.number().int().min(0).optional(),
        region_queries_count_from: z.number().int().min(0).optional(),
        region_queries_count_to: z.number().int().min(0).optional(),
        region_queries_count_wide: z.number().int().min(0).optional(),
        region_queries_count_wide_from: z.number().int().min(0).optional(),
        region_queries_count_wide_to: z.number().int().min(0).optional(),
        cost: z.number().min(0).optional(),
        cost_from: z.number().min(0).optional(),
        cost_to: z.number().min(0).optional(),
        concurrency: z.number().int().min(1).max(100).optional(),
        concurrency_from: z.number().int().min(1).max(100).optional(),
        concurrency_to: z.number().int().min(1).max(100).optional(),
        difficulty: z.number().int().min(0).max(100).optional(),
        difficulty_from: z.number().int().min(0).max(100).optional(),
        difficulty_to: z.number().int().min(0).max(100).optional(),
        keyword_length: z.number().int().min(1).optional(),
        keyword_length_from: z.number().int().min(1).optional(),
        keyword_length_to: z.number().int().min(1).optional(),
        traff: z.number().int().min(0).optional(),
        traff_from: z.number().int().min(0).optional(),
        traff_to: z.number().int().min(0).optional(),
        position: z.number().int().min(1).max(100).optional(),
        position_from: z.number().int().min(1).max(100).optional(),
        position_to: z.number().int().min(1).max(100).optional(),
    }).strict().optional(),
}).strict();

export type DomainUniqKeywordsParams = z.infer<typeof domainUniqKeywordsSchema>;

export const keywordGetSchema = z.object({
    keyword: z.string().min(1).max(100),
    se: z.enum(MAIN_SEARCH_ENGINES),
    minusKeywords: z.array(z.string().min(1).max(100)).max(50).optional(),
    withIntents: z.boolean().optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        found_results: sortOrderSchema.optional(),
        keyword_length: sortOrderSchema.optional(),
    }).partial().optional(),
    filters: z.object({
        cost: z.number().min(0).max(200).optional(),
        cost_from: z.number().min(0).max(200).optional(),
        cost_to: z.number().min(0).max(200).optional(),
        region_queries_count: z.number().int().min(0).max(100000000).optional(),
        region_queries_count_from: z.number().int().min(0).max(100000000).optional(),
        region_queries_count_to: z.number().int().min(0).max(100000000).optional(),
        keyword_length: z.number().int().min(1).optional(),
        keyword_length_from: z.number().int().min(1).optional(),
        keyword_length_to: z.number().int().min(1).optional(),
        difficulty: z.number().int().min(0).max(100).optional(),
        difficulty_from: z.number().int().min(0).max(100).optional(),
        difficulty_to: z.number().int().min(0).max(100).optional(),
        concurrency: z.number().int().min(1).max(100).optional(),
        concurrency_from: z.number().int().min(1).max(100).optional(),
        concurrency_to: z.number().int().min(1).max(100).optional(),
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
    keyword: z.string().min(1).max(200),
    se: z.enum(MAIN_SEARCH_ENGINES),
    withIntents: z.boolean().default(false).optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
    sort: z.object({
        region_queries_count: sortOrderSchema.optional(),
        cost: sortOrderSchema.optional(),
        difficulty: sortOrderSchema.optional(),
        concurrency: sortOrderSchema.optional(),
        weight: sortOrderSchema.optional(),
        keyword: sortOrderSchema.optional(),
    }).strict().optional(),
    filters: z.object({
        cost: z.number().min(0).max(200).optional(),
        cost_from: z.number().min(0).max(200).optional(),
        cost_to: z.number().min(0).max(200).optional(),
        region_queries_count: z.number().int().min(0).max(100000000).optional(),
        region_queries_count_from: z.number().int().min(0).max(100000000).optional(),
        region_queries_count_to: z.number().int().min(0).max(100000000).optional(),
        keyword_length: z.number().int().min(1).optional(),
        keyword_length_from: z.number().int().min(1).optional(),
        keyword_length_to: z.number().int().min(1).optional(),
        difficulty: z.number().int().min(0).max(100).optional(),
        difficulty_from: z.number().int().min(0).max(100).optional(),
        difficulty_to: z.number().int().min(0).max(100).optional(),
        concurrency: z.number().int().min(1).max(100).optional(),
        concurrency_from: z.number().int().min(1).max(100).optional(),
        concurrency_to: z.number().int().min(1).max(100).optional(),
        weight: z.number().int().min(1).optional(),
        weight_from: z.number().min(1).optional(),
        weight_to: z.number().min(1).optional(),
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
