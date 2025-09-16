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
    const token = process.env.SERPSTAT_API_TOKEN;
    
    // In production, require the token. In tests, allow fallback.
    if (!token && process.env.NODE_ENV === 'production') {
        throw new Error('SERPSTAT_API_TOKEN environment variable is required in production');
    }
    
    return configSchema.parse({
        serpstatApiToken: token ?? 'test-token-for-development',
        serpstatApiUrl: process.env.SERPSTAT_API_URL ?? 'https://api.serpstat.com/v4',
        logLevel: process.env.LOG_LEVEL ?? 'error',
        maxRetries: process.env.MAX_RETRIES ? Number(process.env.MAX_RETRIES) : 1,
        requestTimeout: process.env.REQUEST_TIMEOUT ? Number(process.env.REQUEST_TIMEOUT) : 30000,
    });
}
