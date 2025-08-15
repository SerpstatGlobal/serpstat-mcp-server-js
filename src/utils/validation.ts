import { z } from 'zod';
import { SEARCH_ENGINES } from '../types/serpstat';

const searchEngineSchema = z.enum(SEARCH_ENGINES);

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
        .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/),
    se: searchEngineSchema,
    size: z.number().int().min(1).max(100).default(10),
    filters: z.object({
        visible: z.number().min(0).optional(),
        traff: z.number().int().min(0).optional(),
        minus_domains: z.array(
            z.string().regex(/^([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/)
        ).min(1).max(50).optional()
    }).optional()
}).strict();

export type CompetitorsGetParams = z.infer<typeof competitorsGetSchema>;

export const backlinksSummarySchema = z.object({
    query: z.string()
        .min(4)
        .max(253)
        .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/),
    searchType: z.enum(["domain", "domain_with_subdomains"]).default("domain")
});

export type BacklinksSummaryParams = z.infer<typeof backlinksSummarySchema>;

export const domainKeywordsSchema = z.object({
    domain: z.string()
        .min(4)
        .max(253)
        .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/),
    se: searchEngineSchema,
    withSubdomains: z.boolean().optional(),
    withIntents: z.boolean().optional(),
    url: z.string().url().optional(),
    keywords: z.array(z.string().min(1).max(100)).max(50).optional(),
    minusKeywords: z.array(z.string().min(1).max(100)).max(50).optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
    sort: z.object({
        position: z.enum(["asc", "desc"]).optional(),
        region_queries_count: z.enum(["asc", "desc"]).optional(),
        cost: z.enum(["asc", "desc"]).optional(),
        traff: z.enum(["asc", "desc"]).optional(),
        difficulty: z.enum(["asc", "desc"]).optional(),
        keyword_length: z.enum(["asc", "desc"]).optional(),
        concurrency: z.enum(["asc", "desc"]).optional(),
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
        intents_contain: z.array(z.enum(["informational", "navigational", "commercial", "transactional"])).optional(),
        intents_not_contain: z.array(z.enum(["informational", "navigational", "commercial", "transactional"])).optional(),
    }).partial().optional(),
}).strict();

export type DomainKeywordsParams = z.infer<typeof domainKeywordsSchema>;

export const domainUrlsSchema = z.object({
    domain: z.string()
        .min(4)
        .max(253)
        .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/),
    se: searchEngineSchema,
    filters: z.object({
        url_prefix: z.string().max(500).optional(),
        url_contain: z.string().max(200).optional(),
        url_not_contain: z.string().max(200).optional(),
    }).optional(),
    sort: z.object({
        keywords: z.enum(["asc", "desc"]).optional(),
    }).optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
}).strict();

export type DomainUrlsParams = z.infer<typeof domainUrlsSchema>;

export const domainRegionsCountSchema = z.object({
    domain: z.string()
        .min(4)
        .max(253)
        .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/),
    sort: z.enum(["keywords_count", "country_name_en", "db_name"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
}).strict();

export type DomainRegionsCountParams = z.infer<typeof domainRegionsCountSchema>;

export const domainUniqKeywordsSchema = z.object({
    se: searchEngineSchema,
    domains: z.array(
        z.string()
            .min(4)
            .max(253)
            .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/)
    ).min(1).max(2).refine(arr => new Set(arr).size === arr.length, {
        message: 'domains must be unique',
    }),
    minusDomain: z.string()
        .min(4)
        .max(253)
        .regex(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/),
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
    se: z.enum([
        "g_us", "g_uk", "g_au", "g_ca", "g_de",
        "g_fr", "g_br", "g_mx", "g_es", "g_bg",
        "g_it", "g_nl", "g_pl", "g_ua"
    ]),
    minusKeywords: z.array(z.string().min(1).max(100)).max(50).optional(),
    withIntents: z.boolean().optional(),
    page: z.number().int().min(1).default(1).optional(),
    size: z.number().int().min(1).max(1000).default(100).optional(),
    sort: z.object({
        region_queries_count: z.enum(["asc", "desc"]).optional(),
        cost: z.enum(["asc", "desc"]).optional(),
        difficulty: z.enum(["asc", "desc"]).optional(),
        concurrency: z.enum(["asc", "desc"]).optional(),
        found_results: z.enum(["asc", "desc"]).optional(),
        keyword_length: z.enum(["asc", "desc"]).optional(),
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
        intents_contain: z.array(z.enum(["informational", "navigational", "commercial", "transactional"])).optional(),
        intents_not_contain: z.array(z.enum(["informational", "navigational", "commercial", "transactional"])).optional(),
    }).strict().optional(),
}).strict();

export type KeywordGetParams = z.infer<typeof keywordGetSchema>;
