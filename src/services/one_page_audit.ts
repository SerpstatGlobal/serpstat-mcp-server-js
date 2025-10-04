import { BaseService } from './base.js';
import {
    StartOnePageAuditScanParams,
    GetOnePageAuditsListParams,
    GetOnePageReportsListParams,
    GetOnePageAuditResultsParams,
    RescanOnePageAuditParams,
    StopOnePageAuditParams,
    RemoveOnePageAuditParams,
    GetOnePageAuditByCategoriesParams,
    GetOnePageAuditErrorRowsParams,
    GetOnePageAuditPageNamesParams,
    GetOnePageAuditUserLogParams
} from '../utils/validation.js';
import {
    StartOnePageAuditScanResponse,
    GetOnePageAuditsListResponse,
    GetOnePageReportsListResponse,
    GetOnePageAuditResultsResponse,
    RescanOnePageAuditResponse,
    StopOnePageAuditResponse,
    RemoveOnePageAuditResponse,
    GetOnePageAuditByCategoriesResponse,
    GetOnePageAuditErrorRowsResponse,
    GetOnePageAuditPageNamesResponse,
    GetOnePageAuditUserLogResponse,
    SerpstatRequest
} from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class OnePageAuditService extends BaseService {
    async startScan(params: StartOnePageAuditScanParams): Promise<StartOnePageAuditScanResponse> {
        logger.info('Starting one-page audit scan', { url: params.url, name: params.name });
        const request: SerpstatRequest = {
            id: `start_one_page_audit_scan_${Date.now()}`,
            method: 'AuditOnePage.scan',
            params,
        };
        const response = await this.makeRequest<StartOnePageAuditScanResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully started one-page audit scan', {
            url: params.url,
            pageId: response.result.pageId,
            reportId: response.result.reportId
        });
        return response.result;
    }

    async getPagesList(params: GetOnePageAuditsListParams): Promise<GetOnePageAuditsListResponse> {
        logger.info('Getting one-page audits list', {
            limit: params.limit,
            offset: params.offset,
            teamMemberId: params.teamMemberId
        });
        const request: SerpstatRequest = {
            id: `get_one_page_audits_list_${Date.now()}`,
            method: 'AuditOnePage.getPagesList',
            params,
        };
        const response = await this.makeRequest<GetOnePageAuditsListResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved one-page audits list', {
            pagesCount: response.result.data.length,
            totalCount: response.result.totalCount
        });
        return response.result;
    }

    async getReportsListByPage(params: GetOnePageReportsListParams): Promise<GetOnePageReportsListResponse> {
        logger.info('Getting reports list for page', {
            pageId: params.pageId,
            limit: params.limit,
            offset: params.offset
        });
        const request: SerpstatRequest = {
            id: `get_one_page_reports_list_${Date.now()}`,
            method: 'AuditOnePage.getReportsListByPage',
            params,
        };
        const response = await this.makeRequest<GetOnePageReportsListResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved reports list for page', {
            pageId: params.pageId,
            reportsCount: response.result.length
        });
        return response.result;
    }

    async getPageAudit(params: GetOnePageAuditResultsParams): Promise<GetOnePageAuditResultsResponse> {
        logger.info('Getting one-page audit results', { pageId: params.pageId });
        const request: SerpstatRequest = {
            id: `get_one_page_audit_results_${Date.now()}`,
            method: 'AuditOnePage.getPageAudit',
            params,
        };
        const response = await this.makeRequest<GetOnePageAuditResultsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved one-page audit results', {
            pageId: params.pageId,
            categoriesCount: response.result.categories.length,
            sdo: response.result.report.sdo
        });
        return response.result;
    }

    async rescan(params: RescanOnePageAuditParams): Promise<RescanOnePageAuditResponse> {
        logger.info('Rescanning one-page audit', { pageId: params.pageId, name: params.name });
        const request: SerpstatRequest = {
            id: `rescan_one_page_audit_${Date.now()}`,
            method: 'AuditOnePage.rescan',
            params,
        };
        const response = await this.makeRequest<RescanOnePageAuditResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully initiated one-page audit rescan', {
            pageId: params.pageId,
            reportId: response.result.reportId
        });
        return response.result;
    }

    async stop(params: StopOnePageAuditParams): Promise<StopOnePageAuditResponse> {
        logger.info('Stopping one-page audit', { pageId: params.pageId });
        const request: SerpstatRequest = {
            id: `stop_one_page_audit_${Date.now()}`,
            method: 'AuditOnePage.stop',
            params,
        };
        const response = await this.makeRequest<StopOnePageAuditResponse>(request);
        if (response.result === undefined || response.result === null) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully stopped one-page audit', {
            pageId: params.pageId,
            result: response.result
        });
        return response.result;
    }

    async remove(params: RemoveOnePageAuditParams): Promise<RemoveOnePageAuditResponse> {
        logger.info('Removing one-page audit', { pageId: params.pageId });
        const request: SerpstatRequest = {
            id: `remove_one_page_audit_${Date.now()}`,
            method: 'AuditOnePage.remove',
            params,
        };
        const response = await this.makeRequest<RemoveOnePageAuditResponse>(request);
        if (response.result === undefined || response.result === null) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully removed one-page audit', {
            pageId: params.pageId,
            result: response.result
        });
        return response.result;
    }

    async getAuditByCategories(params: GetOnePageAuditByCategoriesParams): Promise<GetOnePageAuditByCategoriesResponse> {
        logger.info('Getting one-page audit by categories', {
            reportId: params.reportId,
            compareReportId: params.compareReportId
        });
        const request: SerpstatRequest = {
            id: `get_one_page_audit_by_categories_${Date.now()}`,
            method: 'AuditOnePage.getAudit',
            params,
        };
        const response = await this.makeRequest<GetOnePageAuditByCategoriesResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved one-page audit by categories', {
            reportId: params.reportId,
            categoriesCount: response.result.categories.length,
            sdo: response.result.report.sdo
        });
        return response.result;
    }

    async getErrorRows(params: GetOnePageAuditErrorRowsParams): Promise<GetOnePageAuditErrorRowsResponse> {
        logger.info('Getting one-page audit error rows', {
            reportId: params.reportId,
            error: params.error,
            mode: params.mode
        });
        const request: SerpstatRequest = {
            id: `get_one_page_audit_error_rows_${Date.now()}`,
            method: 'AuditOnePage.getErrorRows',
            params,
        };
        const response = await this.makeRequest<GetOnePageAuditErrorRowsResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved one-page audit error rows', {
            reportId: params.reportId,
            error: params.error,
            rowsCount: response.result.length
        });
        return response.result;
    }

    async getPageNames(params: GetOnePageAuditPageNamesParams): Promise<GetOnePageAuditPageNamesResponse> {
        logger.info('Getting one-page audit page names', { teamMemberId: params.teamMemberId });
        const request: SerpstatRequest = {
            id: `get_one_page_audit_page_names_${Date.now()}`,
            method: 'AuditOnePage.pageNames',
            params,
        };
        const response = await this.makeRequest<GetOnePageAuditPageNamesResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved one-page audit page names', {
            pagesCount: response.result.data.length,
            totalCount: response.result.totalCount
        });
        return response.result;
    }

    async getUserLog(params: GetOnePageAuditUserLogParams): Promise<GetOnePageAuditUserLogResponse> {
        logger.info('Getting one-page audit user log', {
            reportId: params.reportId,
            pageSize: params.pageSize,
            page: params.page
        });
        const request: SerpstatRequest = {
            id: `get_one_page_audit_user_log_${Date.now()}`,
            method: 'AuditOnePage.userLog',
            params,
        };
        const response = await this.makeRequest<GetOnePageAuditUserLogResponse>(request);
        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }
        logger.info('Successfully retrieved one-page audit user log', {
            reportId: params.reportId,
            itemsCount: response.result.items.length,
            totalCount: response.result.totalCount
        });
        return response.result;
    }
}
