import { BaseService } from './base.js';
import { BacklinksSummaryParams } from '../utils/validation.js';
import { BacklinksSummaryResponse, SerpstatRequest } from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class BacklinksService extends BaseService {
    async getBacklinksSummary(params: BacklinksSummaryParams): Promise<BacklinksSummaryResponse> {
        logger.info('Getting backlinks summary', { query: params.query, searchType: params.searchType });

        const request: SerpstatRequest = {
            id: `backlinks_summary_${Date.now()}`,
            method: 'SerpstatBacklinksProcedure.getSummaryV2',
            params,
        };

        const response = await this.makeRequest<BacklinksSummaryResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved backlinks summary', {
            leftLines: response.result.summary_info.left_lines
        });

        return response.result;
    }
}

