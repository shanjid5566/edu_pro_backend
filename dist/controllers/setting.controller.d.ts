import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
export declare class SettingController {
    /**
     * @route   GET /api/v1/settings/general
     * @desc    Get general settings (public)
     * @access  Public
     */
    getGeneralSettings(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/general
     * @desc    Update general settings (admin only)
     * @access  Private - Admin
     */
    updateGeneralSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   GET /api/v1/settings/user/preferences
     * @desc    Get user preferences
     * @access  Private
     */
    getUserPreferences(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/user/preferences
     * @desc    Update user preferences
     * @access  Private
     */
    updateUserPreferences(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   GET /api/v1/settings/user/profile
     * @desc    Get user profile
     * @access  Private
     */
    getUserProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/user/profile
     * @desc    Update user profile
     * @access  Private
     */
    updateUserProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   POST /api/v1/settings/user/change-password
     * @desc    Change user password
     * @access  Private
     */
    changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/user/two-factor
     * @desc    Enable or disable two-factor authentication
     * @access  Private
     */
    toggleTwoFactor(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/user/notifications
     * @desc    Update notification preferences
     * @access  Private
     */
    updateNotificationPreferences(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/user/appearance
     * @desc    Update appearance settings
     * @access  Private
     */
    updateAppearanceSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   GET /api/v1/settings/:key
     * @desc    Get specific setting by key (admin only)
     * @access  Private - Admin
     */
    getSettingByKey(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   PUT /api/v1/settings/bulk
     * @desc    Bulk update settings (admin only)
     * @access  Private - Admin
     */
    bulkUpdateSettings(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    /**
     * @route   GET /api/v1/settings/health/check
     * @desc    Check system configuration
     * @access  Private
     */
    getSystemStatus(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
declare const _default: SettingController;
export default _default;
//# sourceMappingURL=setting.controller.d.ts.map