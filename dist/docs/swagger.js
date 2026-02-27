import { env } from '../config/env.js';
const swaggerDocument = {
    openapi: '3.1.0',
    info: {
        title: 'EduPro API',
        version: '1.0.0',
        description: 'API documentation for the EduPro backend service.',
    },
    servers: [
        {
            url: `http://localhost:${env.port}`,
            description: 'Local development',
        },
    ],
    paths: {
        '/api/health': {
            get: {
                summary: 'Health check',
                tags: ['Health'],
                responses: {
                    '200': {
                        description: 'Service is healthy.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'ok' },
                                        timestamp: { type: 'string', format: 'date-time' },
                                        uptime: { type: 'number', example: 123.45 },
                                        hostname: { type: 'string', example: 'server-host' },
                                        version: { type: 'string', example: '1.0.0' },
                                    },
                                    required: ['status', 'timestamp', 'uptime', 'hostname', 'version'],
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
export { swaggerDocument };
//# sourceMappingURL=swagger.js.map