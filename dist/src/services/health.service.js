import { config } from "../config/env.config.js";
export class HealthService {
    /**
     * Get health status of the server
     */
    async getHealthStatus() {
        return {
            status: "OK",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.NODE_ENV,
            version: config.API_VERSION,
            memory: {
                used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
                total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
                unit: "MB",
            },
        };
    }
    /**
     * Get simple health check
     */
    async ping() {
        return {
            status: "OK",
            timestamp: new Date().toISOString(),
        };
    }
}
export default new HealthService();
//# sourceMappingURL=health.service.js.map