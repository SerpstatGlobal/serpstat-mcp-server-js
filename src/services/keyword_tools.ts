import { BaseService } from './base.js';
import { KeywordGetParams, GetRelatedKeywordsParams } from '../utils/validation.js';
import { KeywordGetResponse, GetRelatedKeywordsResponse, SerpstatRequest } from '../types/serpstat.js';
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
}
