import { BaseService } from './base.js';
import { UrlSummaryTrafficParams, UrlCompetitorsParams, UrlKeywordsParams, UrlMissingKeywordsParams } from '../utils/validation.js';
import { UrlSummaryTrafficResponse, UrlCompetitorsResponse, UrlKeywordsResponse, UrlMissingKeywordsResponse, SerpstatRequest } from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class UrlService extends BaseService {
    async getUrlSummaryTraffic(params: UrlSummaryTrafficParams): Promise<UrlSummaryTrafficResponse> {
        logger.info('Getting URL summary traffic', { domain: params.domain, urlContains: params.urlContains, se: params.se });
        const request: SerpstatRequest = {
            id: `get_url_summary_traffic_${Date.now()}`,
            method: 'SerpstatUrlProcedure.getSummaryTraffic',
            params,
        };
        const response = await this.makeRequest<UrlSummaryTrafficResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved URL summary traffic', {
            urls: response.result.urls,
            traffic: response.result.traffic,
            keywords: response.result.keywords,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getUrlCompetitors(params: UrlCompetitorsParams): Promise<UrlCompetitorsResponse> {
        logger.info('Getting URL competitors', { url: params.url, se: params.se });
        const request: SerpstatRequest = {
            id: `get_url_competitors_${Date.now()}`,
            method: 'SerpstatUrlProcedure.getUrlCompetitors',
            params,
        };
        const response = await this.makeRequest<UrlCompetitorsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved URL competitors', {
            competitorsCount: response.result.data.length,
            total: response.result.summary_info.total,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getUrlKeywords(params: UrlKeywordsParams): Promise<UrlKeywordsResponse> {
        logger.info('Getting URL keywords', { url: params.url, se: params.se, withIntents: params.withIntents });
        const request: SerpstatRequest = {
            id: `get_url_keywords_${Date.now()}`,
            method: 'SerpstatUrlProcedure.getUrlKeywords',
            params,
        };
        const response = await this.makeRequest<UrlKeywordsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved URL keywords', {
            keywordsCount: response.result.data.length,
            total: response.result.summary_info.total,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }

    async getUrlMissingKeywords(params: UrlMissingKeywordsParams): Promise<UrlMissingKeywordsResponse> {
        logger.info('Getting URL missing keywords', { url: params.url, se: params.se });
        const request: SerpstatRequest = {
            id: `get_url_missing_keywords_${Date.now()}`,
            method: 'SerpstatUrlProcedure.getUrlMissingKeywords',
            params,
        };
        const response = await this.makeRequest<UrlMissingKeywordsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved URL missing keywords', {
            keywordsCount: response.result.data.length,
            leftLines: response.result.summary_info.left_lines
        });
        return response.result;
    }
}
