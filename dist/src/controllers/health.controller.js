import healthService from "../services/health.service.js";
import { ApiResponse } from "../utils/response.js";
export class HealthController {
    /**
     * @route   GET /api/v1/health
     * @desc    Get health status
     * @access  Public
     */
    async getHealth(req, res, next) {
        try {
            const healthData = await healthService.getHealthStatus();
            return ApiResponse.success(res, healthData, "Server is healthy");
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * @route   GET /api/v1/health/ping
     * @desc    Simple ping endpoint
     * @access  Public
     */
    async ping(req, res, next) {
        try {
            const pingData = await healthService.ping();
            return ApiResponse.success(res, pingData, "Pong");
        }
        catch (error) {
            next(error);
        }
    }
}
export default new HealthController();
//# sourceMappingURL=health.controller.js.map