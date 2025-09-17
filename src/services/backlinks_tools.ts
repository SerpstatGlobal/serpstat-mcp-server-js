import { BaseService } from './base.js';
import { BacklinksSummaryParams, AnchorsParams, GetActiveBacklinksParams, GetReferringDomainsParams } from '../utils/validation.js';
import { BacklinksSummaryResponse, AnchorsResponse, ActiveBacklinksResponse, ReferringDomainsResponse, SerpstatRequest } from '../types/serpstat.js';
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

    async getAnchors(params: AnchorsParams): Promise<AnchorsResponse> {
        logger.info('Getting anchors', { query: params.query, searchType: params.searchType });

        const request: SerpstatRequest = {
            id: `anchors_${Date.now()}`,
            method: 'SerpstatBacklinksProcedure.getAnchors',
            params,
        };

        const response = await this.makeRequest<AnchorsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved anchors', {
            leftLines: response.result.summary_info.left_lines,
            count: response.result.summary_info.count
        });

        return response.result;
    }

    async getActiveBacklinks(params: GetActiveBacklinksParams): Promise<ActiveBacklinksResponse> {
        logger.info('Getting active backlinks', { query: params.query, searchType: params.searchType });

        const request: SerpstatRequest = {
            id: `active_backlinks_${Date.now()}`,
            method: 'SerpstatBacklinksProcedure.getNewBacklinks',
            params,
        };

        const response = await this.makeRequest<ActiveBacklinksResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved active backlinks', {
            leftLines: response.result.summary_info.left_lines,
            count: response.result.summary_info.count,
            total: response.result.summary_info.total
        });

        return response.result;
    }

    async getReferringDomains(params: GetReferringDomainsParams): Promise<ReferringDomainsResponse> {
        logger.info('Getting referring domains', { query: params.query, searchType: params.searchType });

        const request: SerpstatRequest = {
            id: `referring_domains_${Date.now()}`,
            method: 'SerpstatBacklinksProcedure.getRefDomains',
            params,
        };

        const response = await this.makeRequest<ReferringDomainsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved referring domains', {
            leftLines: response.result.summary_info.left_lines,
            count: response.result.summary_info.count,
            total: response.result.summary_info.total
        });

        return response.result;
    }
}

