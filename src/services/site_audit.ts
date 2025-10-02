import { BaseService } from './base.js';
import {
    GetSiteAuditSettingsParams,
    SetSiteAuditSettingsParams,
    StartSiteAuditParams,
    StopSiteAuditParams,
    GetCategoriesStatisticParams,
    GetHistoryByCountErrorParams,
    GetSiteAuditsListParams,
    GetScanUserUrlListParams,
    GetDefaultSettingsParams,
    GetBasicInfoParams,
    GetReportWithoutDetailsParams,
    GetErrorElementsParams,
    GetSubElementsByCrcParams
} from '../utils/validation.js';
import {
    GetSiteAuditSettingsResponse,
    StartSiteAuditResponse,
    StopSiteAuditResponse,
    GetCategoriesStatisticResponse,
    GetHistoryByCountErrorResponse,
    GetSiteAuditsListResponse,
    GetScanUserUrlListResponse,
    GetDefaultSettingsResponse,
    GetBasicInfoResponse,
    GetReportWithoutDetailsResponse,
    GetErrorElementsResponse,
    GetSubElementsByCrcResponse,
    SerpstatRequest,
    SerpstatResponse
} from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class SiteAuditService extends BaseService {
    async getSettings(params: GetSiteAuditSettingsParams): Promise<GetSiteAuditSettingsResponse> {
        logger.info('Getting site audit settings', { projectId: params.projectId });
        const request: SerpstatRequest = {
            id: `get_site_audit_settings_${Date.now()}`,
            method: 'AuditSite.getSettings',
            params,
        };
        const response:SerpstatResponse<GetSiteAuditSettingsResponse> = await this.makeRequest<GetSiteAuditSettingsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved site audit settings', {
            projectId: params.projectId,
            domain: response.result.mainSettings.domain
        });
        return response.result;
    }

    async setSettings(params: SetSiteAuditSettingsParams): Promise<null> {
        logger.info('Setting site audit settings', {
            projectId: params.projectId,
            domain: params.mainSettings.domain
        });
        const request: SerpstatRequest = {
            id: `set_site_audit_settings_${Date.now()}`,
            method: 'AuditSite.setSettings',
            params,
        };

        const response = await this.makeRequest<null>(request);
        logger.info('Successfully set site audit settings', { projectId: params.projectId });
        return null;
    }

    async start(params: StartSiteAuditParams): Promise<StartSiteAuditResponse> {
        logger.info('Starting site audit', { projectId: params.projectId });
        const request: SerpstatRequest = {
            id: `start_site_audit_${Date.now()}`,
            method: 'AuditSite.start',
            params,
        };
        const response = await this.makeRequest<StartSiteAuditResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully started site audit', {
            projectId: params.projectId,
            reportId: response.result.reportId
        });
        return response.result;
    }

    async stop(params: StopSiteAuditParams): Promise<boolean> {
        logger.info('Stopping site audit', { projectId: params.projectId });
        const request: SerpstatRequest = {
            id: `stop_site_audit_${Date.now()}`,
            method: 'AuditSite.stop',
            params,
        };
        const response = await this.makeRequest<StopSiteAuditResponse>(request);
        if (response.result === undefined || response.result === null) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully stopped site audit', {
            projectId: params.projectId,
            result: response.result.result
        });
        return response.result.result;
    }

    async getCategoriesStatistic(params: GetCategoriesStatisticParams): Promise<GetCategoriesStatisticResponse> {
        logger.info('Getting categories statistic', { reportId: params.reportId });
        const request: SerpstatRequest = {
            id: `get_categories_statistic_${Date.now()}`,
            method: 'AuditSite.getCategoriesStatistic',
            params,
        };
        const response = await this.makeRequest<GetCategoriesStatisticResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved categories statistic', {
            reportId: params.reportId,
            categoriesCount: response.result.length
        });
        return response.result;
    }

    async getHistoryByCountError(params: GetHistoryByCountErrorParams): Promise<GetHistoryByCountErrorResponse> {
        logger.info('Getting history by count error', {
            projectId: params.projectId,
            errorName: params.errorName,
            limit: params.limit,
            offset: params.offset
        });
        const request: SerpstatRequest = {
            id: `get_history_by_count_error_${Date.now()}`,
            method: 'AuditSite.getHistoryByCountError',
            params,
        };
        const response = await this.makeRequest<GetHistoryByCountErrorResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved history by count error', {
            projectId: params.projectId,
            errorName: params.errorName,
            historyCount: response.result.errorCounts.length
        });
        return response.result;
    }

    async getSiteAuditsList(params: GetSiteAuditsListParams): Promise<GetSiteAuditsListResponse> {
        logger.info('Getting site audits list', {
            projectId: params.projectId,
            limit: params.limit,
            offset: params.offset
        });
        const request: SerpstatRequest = {
            id: `get_site_audits_list_${Date.now()}`,
            method: 'AuditSite.getList',
            params,
        };
        const response:SerpstatResponse<GetSiteAuditsListResponse> = await this.makeRequest<GetSiteAuditsListResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved site audits list', {
            projectId: params.projectId,
            auditsCount: response.result.length
        });
        return response.result;
    }

    async getScanUserUrlList(params: GetScanUserUrlListParams): Promise<GetScanUserUrlListResponse> {
        logger.info('Getting scan user URL list', { projectId: params.projectId });
        const request: SerpstatRequest = {
            id: `get_scan_user_url_list_${Date.now()}`,
            method: 'AuditSite.getScanUserUrlList',
            params,
        };
        const response = await this.makeRequest<GetScanUserUrlListResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved scan user URL list', {
            projectId: params.projectId,
            urlsCount: response.result.urls.length,
            scanType: response.result.scanType
        });
        return response.result;
    }

    async getDefaultSettings(params: GetDefaultSettingsParams): Promise<GetDefaultSettingsResponse> {
        logger.info('Getting default settings');
        const request: SerpstatRequest = {
            id: `get_default_settings_${Date.now()}`,
            method: 'AuditSite.getDefaultSettings',
            params,
        };
        const response = await this.makeRequest<GetDefaultSettingsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved default settings');
        return response.result;
    }

    async getBasicInfo(params: GetBasicInfoParams): Promise<GetBasicInfoResponse> {
        logger.info('Getting basic audit info', { reportId: params.reportId });
        const request: SerpstatRequest = {
            id: `get_basic_info_${Date.now()}`,
            method: 'AuditSite.getBasicInfo',
            params,
        };
        const response = await this.makeRequest<GetBasicInfoResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved basic audit info', {
            reportId: params.reportId,
            sdo: response.result.sdo,
            progress: response.result.progress
        });
        return response.result;
    }

    async getReportWithoutDetails(params: GetReportWithoutDetailsParams): Promise<GetReportWithoutDetailsResponse> {
        logger.info('Getting report without details', {
            reportId: params.reportId,
            compareReportId: params.compareReportId
        });
        const request: SerpstatRequest = {
            id: `get_report_without_details_${Date.now()}`,
            method: 'AuditSite.getReportWithoutDetails',
            params,
        };
        const response = await this.makeRequest<GetReportWithoutDetailsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved report without details', {
            reportId: params.reportId,
            categoriesCount: response.result.categories.length
        });
        return response.result;
    }

    async getErrorElements(params: GetErrorElementsParams): Promise<GetErrorElementsResponse> {
        logger.info('Getting error elements', {
            reportId: params.reportId,
            errorName: params.errorName,
            mode: params.mode,
            limit: params.limit,
            offset: params.offset
        });
        const request: SerpstatRequest = {
            id: `get_error_elements_${Date.now()}`,
            method: 'AuditSite.getErrorElements',
            params,
        };
        const response = await this.makeRequest<GetErrorElementsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved error elements', {
            reportId: params.reportId,
            errorName: params.errorName,
            totalCount: response.result.totalCount
        });
        return response.result;
    }

    async getSubElementsByCrc(params: GetSubElementsByCrcParams): Promise<GetSubElementsByCrcResponse> {
        logger.info('Getting sub-elements by CRC', {
            reportId: params.reportId,
            errorName: params.errorName,
            crc: params.crc,
            mode: params.mode,
            limit: params.limit,
            offset: params.offset
        });
        const request: SerpstatRequest = {
            id: `get_sub_elements_by_crc_${Date.now()}`,
            method: 'AuditSite.getSubElementsByCrc',
            params,
        };
        const response = await this.makeRequest<GetSubElementsByCrcResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved sub-elements by CRC', {
            reportId: params.reportId,
            crc: params.crc,
            totalCount: response.result.totalCount
        });
        return response.result;
    }
}
