import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { SerpstatRequest, SerpstatResponse } from '../types/serpstat.js';
import { Config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export abstract class BaseService {
    protected readonly client: AxiosInstance;
    protected readonly config: Config;

    constructor(config: Config) {
        this.config = config;
        this.client = axios.create({
            baseURL: config.serpstatApiUrl,
            timeout: config.requestTimeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                logger.debug('Making API request', {
                    url: config.url,
                    method: config.method,
                    data: config.data
                });
                return config;
            },
            (error) => {
                logger.error('Request interceptor error', error);
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                logger.debug('API response received', {
                    status: response.status,
                    data: response.data
                });
                return response;
            },
            (error) => {
                logger.error('Response interceptor error', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                return Promise.reject(error);
            }
        );
    }

    async makeRequest<T>(
        request: SerpstatRequest,
        retries: number = this.config.maxRetries
    ): Promise<SerpstatResponse<T>> {
        const requestConfig: AxiosRequestConfig = {
            method: 'POST',
            url: '/',
            params: { token: this.config.serpstatApiToken },
            data: request,
        };

        try {
            const response = await this.client.request<SerpstatResponse<T>>(requestConfig);

            if (response.data.error) {
                throw new Error(`Serpstat API error: ${response.data.error.message} (code: ${response.data.error.code})`);
            }

            return response.data;
        } catch (error) {
            if (retries > 0 && this.isRetryableError(error)) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                logger.warn(`Request failed, retrying... (${retries} retries left)`, { error: errorMessage });
                await this.delay(1000);
                return this.makeRequest<T>(request, retries - 1);
            }
            throw error;
        }
    }

    private isRetryableError(error: any): boolean {
        return (
            error.code === 'ECONNRESET' ||
            error.code === 'ETIMEDOUT' ||
            (error.response && error.response.status >= 500)
        );
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}