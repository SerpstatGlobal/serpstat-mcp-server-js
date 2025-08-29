import { SerpstatMCPServer } from './server.js';
import { logger } from './utils/logger.js';
import { loadConfig } from './utils/config.js';

async function main() {
    try {
        // Validate configuration on startup
        loadConfig();
        logger.info('Configuration loaded successfully');

        const server = new SerpstatMCPServer();
        await server.start();
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

main().catch((error) => {
    logger.error('Unhandled error:', error);
    process.exit(1);
});