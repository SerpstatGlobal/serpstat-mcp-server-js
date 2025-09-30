import { BaseService } from './base.js';
import { SerpstatRequest } from '../types/serpstat.js';
import { GetAuditStatsResponse, GetCreditsStatsResponse } from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class CreditsService extends BaseService {
    async getAuditStats(): Promise<GetAuditStatsResponse> {
        logger.info('Getting audit credits statistics');

        const request: SerpstatRequest = {
            id: `audit_stats_${Date.now()}`,
            method: 'SerpstatLimitsProcedure.getAuditStats',
            params: {},
        };

        const response = await this.makeRequest<GetAuditStatsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved audit stats', {
            total: response.result.data.total,
            used: response.result.data.used,
            left: response.result.data.left
        });

        return response.result;
    }

    async getCreditsStats(): Promise<GetCreditsStatsResponse> {
        logger.info('Getting API credits statistics');

        const request: SerpstatRequest = {
            id: `credits_stats_${Date.now()}`,
            method: 'SerpstatLimitsProcedure.getStats',
            params: {},
        };

        const response = await this.makeRequest<GetCreditsStatsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved credits stats', {
            max_lines: response.result.data.max_lines,
            used_lines: response.result.data.used_lines,
            left_lines: response.result.data.left_lines
        });

        return response.result;
    }
}