import { BaseHandler } from './base.js';
import { ProjectService } from '../services/project_service.js';
import { MCPToolCall, MCPToolResponse } from '../types/mcp.js';
import { createProjectSchema, deleteProjectSchema, getProjectsSchema } from '../utils/validation.js';
import { loadConfig } from '../utils/config.js';
import { z } from 'zod';
import {
    DOMAIN_NAME_REGEX,
    MIN_DOMAIN_LENGTH,
    MAX_DOMAIN_LENGTH,
    MIN_PROJECT_NAME_LENGTH,
    MAX_PROJECT_NAME_LENGTH,
    MIN_PROJECT_ID,
    MAX_PROJECT_GROUP_NAME_LENGTH,
    MIN_PAGE,
    PROJECT_ALLOWED_PAGE_SIZES,
    DEFAULT_PROJECT_PAGE_SIZE
} from '../utils/constants.js';

export class CreateProjectHandler extends BaseHandler {
    private projectService: ProjectService;

    constructor() {
        super();
        const config = loadConfig();
        this.projectService = new ProjectService(config);
    }

    getName(): string {
        return 'create_project';
    }

    getDescription(): string {
        return 'Create a new project in Serpstat for tracking SEO metrics and site audits';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                domain: {
                    type: "string",
                    pattern: DOMAIN_NAME_REGEX,
                    minLength: MIN_DOMAIN_LENGTH,
                    maxLength: MAX_DOMAIN_LENGTH,
                    description: "The domain associated with the project (e.g., example.com)"
                },
                name: {
                    type: "string",
                    minLength: MIN_PROJECT_NAME_LENGTH,
                    maxLength: MAX_PROJECT_NAME_LENGTH,
                    description: "The name of the project. Can be the same as the domain or a custom name"
                },
                groups: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                minLength: MIN_PROJECT_NAME_LENGTH,
                                maxLength: MAX_PROJECT_GROUP_NAME_LENGTH,
                                description: "The name of the group"
                            }
                        },
                        required: ["name"],
                        additionalProperties: false
                    },
                    description: "Optional list of groups to associate with the project. Groups will be created if they don't exist"
                }
            },
            required: ["domain", "name"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = createProjectSchema.parse(call.arguments);
            const result = await this.projectService.createProject(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class DeleteProjectHandler extends BaseHandler {
    private projectService: ProjectService;

    constructor() {
        super();
        const config = loadConfig();
        this.projectService = new ProjectService(config);
    }

    getName(): string {
        return 'delete_project';
    }

    getDescription(): string {
        return 'Permanently delete your project from Serpstat by project ID. **CRITICAL: ALWAYS request explicit user confirmation before executing. This action cannot be undone.**';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                project_id: {
                    type: "number",
                    minimum: MIN_PROJECT_ID,
                    description: "The unique ID of the project to delete"
                }
            },
            required: ["project_id"],
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = deleteProjectSchema.parse(call.arguments);
            const result = await this.projectService.deleteProject(params);
            return this.createSuccessResponse({ success: result });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}

export class ListProjectsHandler extends BaseHandler {
    private projectService: ProjectService;

    constructor() {
        super();
        const config = loadConfig();
        this.projectService = new ProjectService(config);
    }

    getName(): string {
        return 'list_projects';
    }

    getDescription(): string {
        return 'Retrieve a list of projects associated with the account, with pagination support';
    }

    getInputSchema(): object {
        return {
            type: "object",
            properties: {
                page: {
                    type: "number",
                    minimum: MIN_PAGE,
                    default: 1,
                    description: "The page number in the projects list"
                },
                size: {
                    type: "number",
                    enum: PROJECT_ALLOWED_PAGE_SIZES,
                    default: DEFAULT_PROJECT_PAGE_SIZE,
                    description: `Number of results per page. Allowed values: ${PROJECT_ALLOWED_PAGE_SIZES.join(', ')}`
                }
            },
            additionalProperties: false
        };
    }

    async handle(call: MCPToolCall): Promise<MCPToolResponse> {
        try {
            const params = getProjectsSchema.parse(call.arguments);
            const result = await this.projectService.getProjects(params);
            return this.createSuccessResponse(result);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return this.createErrorResponse(new Error(`Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`));
            }
            return this.createErrorResponse(error as Error);
        }
    }
}