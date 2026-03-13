export declare class HealthService {
    /**
     * Get health status of the server
     */
    getHealthStatus(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
        memory: {
            used: number;
            total: number;
            unit: string;
        };
    }>;
    /**
     * Get simple health check
     */
    ping(): Promise<{
        status: string;
        timestamp: string;
    }>;
}
declare const _default: HealthService;
export default _default;
//# sourceMappingURL=health.service.d.ts.map