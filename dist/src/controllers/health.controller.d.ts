import { Request, Response, NextFunction } from "express";
export declare class HealthController {
    /**
     * @route   GET /api/v1/health
     * @desc    Get health status
     * @access  Public
     */
    getHealth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   GET /api/v1/health/ping
     * @desc    Simple ping endpoint
     * @access  Public
     */
    ping(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: HealthController;
export default _default;
//# sourceMappingURL=health.controller.d.ts.map