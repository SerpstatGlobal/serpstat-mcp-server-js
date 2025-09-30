import { BaseService } from './base.js';
import { SerpstatRequest } from '../types/serpstat.js';
import { CreateProjectParams, DeleteProjectParams, GetProjectsParams } from '../utils/validation.js';
import { CreateProjectResponse, GetProjectsResponse } from '../types/serpstat.js';
import { logger } from '../utils/logger.js';

export class ProjectService extends BaseService {
    async createProject(params: CreateProjectParams): Promise<CreateProjectResponse> {
        logger.info('Creating project', { domain: params.domain, name: params.name });

        const request: SerpstatRequest = {
            id: `create_project_${Date.now()}`,
            method: 'ProjectProcedure.createProject',
            params,
        };

        const response = await this.makeRequest<CreateProjectResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully created project', {
            project_id: response.result.project_id
        });

        return response.result;
    }

    async deleteProject(params: DeleteProjectParams): Promise<boolean> {
        logger.info('Deleting project', { project_id: params.project_id });

        const request: SerpstatRequest = {
            id: `delete_project_${Date.now()}`,
            method: 'ProjectProcedure.deleteProject',
            params,
        };

        const response = await this.makeRequest<boolean>(request);

        if (response.result === undefined) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully deleted project', {
            project_id: params.project_id,
            success: response.result
        });

        return response.result;
    }

    async getProjects(params: GetProjectsParams): Promise<GetProjectsResponse> {
        logger.info('Getting projects list', { page: params.page, size: params.size });

        const request: SerpstatRequest = {
            id: `get_projects_${Date.now()}`,
            method: 'ProjectProcedure.getProjects',
            params,
        };

        const response = await this.makeRequest<GetProjectsResponse>(request);

        if (!response.result) {
            throw new Error('No result data received from Serpstat API');
        }

        logger.info('Successfully retrieved projects', {
            projectsCount: response.result.data.length,
            total: response.result.summary_info.total
        });

        return response.result;
    }
}