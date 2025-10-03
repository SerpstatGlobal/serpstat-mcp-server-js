import { BaseService } from './base.js';
import {
    StartOnePageAuditScanParams,
    GetOnePageAuditsListParams,
    GetOnePageReportsListParams,
    GetOnePageAuditResultsParams
} from '../utils/validation.js';
import {
    StartOnePageAuditScanResponse,
    GetOnePageAuditsListResponse,
    GetOnePageReportsListResponse,
    GetOnePageAuditResultsResponse,
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
}
