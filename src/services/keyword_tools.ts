import { BaseService } from './base';
import { KeywordGetParams } from '../utils/validation';
import { KeywordGetResponse, SerpstatRequest } from '../types/serpstat';
import { logger } from '../utils/logger';

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
}

