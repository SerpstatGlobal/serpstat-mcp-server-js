import { BaseService } from './base';
import { DomainsInfoResponse, SerpstatRequest } from '../types/serpstat';
import { DomainsInfoParams, CompetitorsGetParams, DomainKeywordsParams, DomainUrlsParams, DomainRegionsCountParams } from '../utils/validation';
import { logger } from '../utils/logger';
import { CompetitorsResponse, DomainKeywordsResponse, DomainUrlsResponse, DomainRegionsCountResponse } from '../types/serpstat';

export class DomainService extends BaseService {
    async getDomainsInfo(params: DomainsInfoParams): Promise<DomainsInfoResponse> {
        logger.info('Getting domains info', { domains: params.domains, se: params.se });

        const request: SerpstatRequest = {
            id: `domains_info_${Date.now()}`,
            method: 'SerpstatDomainProcedure.getDomainsInfo',
            params,
        };

        const response = await this.makeRequest<DomainsInfoResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved domains info', {
            domainsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });

        return response.result;
    }

    async getCompetitors(params: CompetitorsGetParams): Promise<CompetitorsResponse> {
        logger.info('Getting competitors', { domain: params.domain, se: params.se });

        const request: SerpstatRequest = {
            id: `competitors_${Date.now()}`,
            method: 'SerpstatDomainProcedure.getCompetitors',
            params,
        };

        const response = await this.makeRequest<CompetitorsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved competitors', {
            competitorsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });

        return response.result;
    }

    async getDomainKeywords(params: DomainKeywordsParams): Promise<DomainKeywordsResponse> {
        logger.info('Getting domain keywords', { domain: params.domain, se: params.se });

        const request: SerpstatRequest = {
            id: `domain_keywords_${Date.now()}`,
            method: 'SerpstatDomainProcedure.getDomainKeywords',
            params,
        };

        const response = await this.makeRequest<DomainKeywordsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved domain keywords', {
            keywordsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });

        return response.result;
    }

    async getDomainUrls(params: DomainUrlsParams): Promise<DomainUrlsResponse> {
        logger.info('Getting domain URLs', { domain: params.domain, se: params.se });

        const request: SerpstatRequest = {
            id: `domain_urls_${Date.now()}`,
            method: 'SerpstatDomainProcedure.getDomainUrls',
            params,
        };

        const response = await this.makeRequest<DomainUrlsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved domain URLs', {
            urlsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });

        return response.result;
    }

    async getDomainRegionsCount(params: DomainRegionsCountParams): Promise<DomainRegionsCountResponse> {
        logger.info('Getting domain regions count', { domain: params.domain, sort: params.sort, order: params.order });

        const request: SerpstatRequest = {
            id: `domain_regions_count_${Date.now()}`,
            method: 'SerpstatDomainProcedure.getRegionsCount',
            params,
        };

        const response = await this.makeRequest<DomainRegionsCountResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved domain regions count', {
            regionsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });

        return response.result;
    }
}