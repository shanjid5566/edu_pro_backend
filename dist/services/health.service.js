import os from 'os';
function getHealthStatus() {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        hostname: os.hostname(),
        version: process.env.npm_package_version ?? '1.0.0',
    };
}
export { getHealthStatus };
//# sourceMappingURL=health.service.js.map