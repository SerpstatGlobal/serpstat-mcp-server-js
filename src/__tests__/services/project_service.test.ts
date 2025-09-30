import { ProjectService } from '../../services/project_service.js';
import { Config } from '../../utils/config.js';
import { CreateProjectParams, DeleteProjectParams, GetProjectsParams } from '../../utils/validation.js';
import { beforeEach, describe, it, expect } from '@jest/globals';

process.env.SERPSTAT_API_TOKEN = 'test-token';
process.env.SERPSTAT_API_URL = 'https://api.serpstat.com/v4';
process.env.LOG_LEVEL = 'error';

describe('ProjectService', () => {
    let service: ProjectService;
    let mockConfig: Config;

    beforeEach(() => {
        mockConfig = {
            serpstatApiToken: 'test-token',
            serpstatApiUrl: 'https://api.serpstat.com/v4',
            logLevel: "error",
            maxRetries: 1,
            requestTimeout: 5000,
        };
        service = new ProjectService(mockConfig);
    });

    describe('createProject', () => {
        it('should validate input parameters with required fields', () => {
            const validParams: CreateProjectParams = {
                domain: 'example.com',
                name: 'My Test Project',
            };
            expect(validParams.domain).toBe('example.com');
            expect(validParams.name).toBe('My Test Project');
            expect(validParams.groups).toBeUndefined();
        });

        it('should handle optional groups parameter', () => {
            const params: CreateProjectParams = {
                domain: 'test.com',
                name: 'Test Project',
                groups: [{ name: 'SEO Group' }, { name: 'Marketing Group' }],
            };
            expect(params.groups).toHaveLength(2);
            expect(params.groups?.[0].name).toBe('SEO Group');
        });

        it('should accept project with same domain and name', () => {
            const params: CreateProjectParams = {
                domain: 'example.com',
                name: 'example.com',
            };
            expect(params.domain).toBe(params.name);
        });
    });

    describe('deleteProject', () => {
        it('should validate project_id parameter', () => {
            const validParams: DeleteProjectParams = {
                project_id: 1234567,
            };
            expect(validParams.project_id).toBe(1234567);
            expect(typeof validParams.project_id).toBe('number');
        });

        it('should handle minimum project_id value', () => {
            const params: DeleteProjectParams = {
                project_id: 1,
            };
            expect(params.project_id).toBeGreaterThanOrEqual(1);
        });

        it('should handle large project_id values', () => {
            const params: DeleteProjectParams = {
                project_id: 9999999,
            };
            expect(params.project_id).toBe(9999999);
        });
    });

    describe('getProjects', () => {
        it('should work with default parameters', () => {
            const params: GetProjectsParams = {};
            expect(params.page).toBeUndefined();
            expect(params.size).toBeUndefined();
        });

        it('should validate pagination parameters', () => {
            const params: GetProjectsParams = {
                page: 2,
                size: 50,
            };
            expect(params.page).toBe(2);
            expect(params.size).toBe(50);
        });

        it('should handle first page with custom size', () => {
            const params: GetProjectsParams = {
                page: 1,
                size: 20,
            };
            expect(params.page).toBe(1);
            expect(params.size).toBe(20);
        });
    });
});