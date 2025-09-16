import { z } from 'zod';
import { LOG_LEVELS } from './constants.js';

const configSchema = z.object({
    serpstatApiToken: z.string().min(1, 'SERPSTAT_API_TOKEN is required'),
    serpstatApiUrl: z.string().url().default('https://api.serpstat.com/v4'),
    logLevel: z.enum(LOG_LEVELS).default('info'),
    maxRetries: z.number().int().positive().default(3),
    requestTimeout: z.number().int().positive().default(30000),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
    return configSchema.parse({
        serpstatApiToken: process.env.SERPSTAT_API_TOKEN ?? 'test-token',
        serpstatApiUrl: process.env.SERPSTAT_API_URL ?? 'https://api.serpstat.com/v4',
        logLevel: process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug' ?? 'error',
        maxRetries: process.env.MAX_RETRIES ? Number(process.env.MAX_RETRIES) : 1,
        requestTimeout: process.env.REQUEST_TIMEOUT ? Number(process.env.REQUEST_TIMEOUT) : 30000,
    });
}
