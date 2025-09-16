import { BaseService } from './base.js';
import { KeywordGetParams, GetRelatedKeywordsParams, KeywordsInfoParams, KeywordSuggestionsParams, KeywordFullTopParams } from '../utils/validation.js';
import { KeywordGetResponse, GetRelatedKeywordsResponse, KeywordsInfoResponse, KeywordSuggestionsResponse, KeywordFullTopResponse, SerpstatRequest } from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class KeywordService extends BaseService {
    async getKeywords(params: KeywordGetParams): Promise<KeywordGetResponse> {
        logger.info('Getting keywords', { keyword: params.keyword, se: params.se });
        const request: SerpstatRequest = {
            id: `get_keywords_${Date.now()}`,
            method: 'SerpstatKeywordProcedure.getKeywords',
            params,
        };
        const response = await this.makeRequest<KeywordGetResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved keywords', {
            keywordsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getRelatedKeywords(params: GetRelatedKeywordsParams): Promise<GetRelatedKeywordsResponse> {
        logger.info('Getting related keywords', { keyword: params.keyword, se: params.se });
        const request: SerpstatRequest = {
            id: `get_related_keywords_${Date.now()}`,
            method: 'SerpstatKeywordProcedure.getRelatedKeywords',
            params,
        };
        const response = await this.makeRequest<GetRelatedKeywordsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved related keywords', {
            keywordsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getKeywordsInfo(params: KeywordsInfoParams): Promise<KeywordsInfoResponse> {
        logger.info('Getting keywords info', { 
            keywordsCount: params.keywords.length, 
            se: params.se,
            withIntents: params.withIntents 
        });
        const request: SerpstatRequest = {
            id: `get_keywords_info_${Date.now()}`,
            method: 'SerpstatKeywordProcedure.getKeywordsInfo',
            params,
        };
        const response = await this.makeRequest<KeywordsInfoResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved keywords info', {
            keywordsDataCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getKeywordSuggestions(params: KeywordSuggestionsParams): Promise<KeywordSuggestionsResponse> {
        logger.info('Getting keyword suggestions', { 
            keyword: params.keyword, 
            se: params.se,
            page: params.page,
            size: params.size
        });
        const request: SerpstatRequest = {
            id: `get_keyword_suggestions_${Date.now()}`,
            method: 'SerpstatKeywordProcedure.getSuggestions',
            params,
        };
        const response = await this.makeRequest<KeywordSuggestionsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved keyword suggestions', {
            suggestionsCount: response.result.data.length,
            totalSuggestions: response.result.summary_info.total,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getKeywordFullTop(params: KeywordFullTopParams): Promise<KeywordFullTopResponse> {
        logger.info('Getting keyword full top', {
            keyword: params.keyword,
            se: params.se,
            size: params.size
        });
        const request: SerpstatRequest = {
            id: `get_keyword_full_top_${Date.now()}`,
            method: 'SerpstatKeywordProcedure.getKeywordFullTop',
            params,
        };
        const response = await this.makeRequest<KeywordFullTopResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved keyword full top', {
            topResultsCount: response.result.top.length,
            leftLimits: response.result.summary_info.left_limits
        });
        return response.result;
    }
}
