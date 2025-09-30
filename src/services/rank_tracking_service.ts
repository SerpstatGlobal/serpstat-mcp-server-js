import { BaseService } from './base.js';
import { SerpstatRequest } from '../types/serpstat.js';
import { GetRtProjectsListParams, GetRtProjectStatusParams, GetRtProjectRegionsListParams, GetRtProjectKeywordSerpHistoryParams, GetRtProjectUrlSerpHistoryParams } from '../utils/validation.js';
import { GetRtProjectsListResponse, GetRtProjectStatusResponse, GetRtProjectRegionsListResponse, GetRtProjectKeywordSerpHistoryResponse, GetRtProjectUrlSerpHistoryResponse } from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class RankTrackingService extends BaseService {
    async getRtProjectsList(params: GetRtProjectsListParams): Promise<GetRtProjectsListResponse> {
        logger.info('Getting rank tracker projects list', { page: params.page, pageSize: params.pageSize });

        const request: SerpstatRequest = {
            id: `rt_projects_list_${Date.now()}`,
            method: 'RtApiProjectProcedure.getProjects',
            params,
        };

        const response = await this.makeRequest<GetRtProjectsListResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved rank tracker projects list', {
            projectsCount: response.result.data.length,
            total: response.result.summary_info.total
        });

        return response.result;
    }

    async getRtProjectStatus(params: GetRtProjectStatusParams): Promise<GetRtProjectStatusResponse> {
        logger.info('Getting rank tracker project status', {
            projectId: params.projectId,
            regionId: params.regionId
        });

        const request: SerpstatRequest = {
            id: `rt_project_status_${Date.now()}`,
            method: 'RtApiProjectProcedure.getProjectStatus',
            params,
        };

        const response = await this.makeRequest<GetRtProjectStatusResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved rank tracker project status', {
            projectId: response.result.projectId,
            regionId: response.result.regionId,
            parsing: response.result.parsing
        });

        return response.result;
    }

    async getRtProjectRegionsList(params: GetRtProjectRegionsListParams): Promise<GetRtProjectRegionsListResponse> {
        logger.info('Getting rank tracker project regions list', { projectId: params.projectId });

        const request: SerpstatRequest = {
            id: `rt_project_regions_${Date.now()}`,
            method: 'RtApiSearchEngineProcedure.getProjectRegions',
            params,
        };

        const response = await this.makeRequest<GetRtProjectRegionsListResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved rank tracker project regions list', {
            projectId: response.result.projectId,
            regionsCount: response.result.regions.length
        });

        return response.result;
    }

    async getRtProjectKeywordSerpHistory(params: GetRtProjectKeywordSerpHistoryParams): Promise<GetRtProjectKeywordSerpHistoryResponse> {
        logger.info('Getting rank tracker keyword SERP history', {
            projectId: params.projectId,
            projectRegionId: params.projectRegionId,
            page: params.page
        });

        const request: SerpstatRequest = {
            id: `rt_keyword_serp_history_${Date.now()}`,
            method: 'RtApiSerpResultsProcedure.getKeywordsSerpResultsHistory',
            params,
        };

        const response = await this.makeRequest<GetRtProjectKeywordSerpHistoryResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved rank tracker keyword SERP history', {
            projectId: response.result.data.projectId,
            projectRegionId: response.result.data.projectRegionId,
            keywordsCount: response.result.data.keywords.length,
            total: response.result.summary_info.total
        });

        return response.result;
    }

    async getRtProjectUrlSerpHistory(params: GetRtProjectUrlSerpHistoryParams): Promise<GetRtProjectUrlSerpHistoryResponse> {
        logger.info('Getting rank tracker URL SERP history', {
            projectId: params.projectId,
            projectRegionId: params.projectRegionId,
            page: params.page,
            domain: params.domain
        });

        const request: SerpstatRequest = {
            id: `rt_url_serp_history_${Date.now()}`,
            method: 'RtApiSerpResultsProcedure.getUrlsSerpResultsHistory',
            params,
        };

        const response = await this.makeRequest<GetRtProjectUrlSerpHistoryResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved rank tracker URL SERP history', {
            projectId: response.result.data.projectId,
            projectRegionId: response.result.data.projectRegionId,
            domain: response.result.data.domain,
            keywordsCount: response.result.data.keywords.length,
            total: response.result.summary_info.total
        });

        return response.result;
    }
}