/**
 * General API rate limiter
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for authentication routes
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
export default apiLimiter;
//# sourceMappingURL=rateLimiter.middleware.d.ts.map