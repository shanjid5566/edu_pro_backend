import dotenv from "dotenv";
dotenv.config();
export const config = {
    // Server Configuration
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    API_VERSION: process.env.API_VERSION || "v1",
    // Database Configuration
    DATABASE_URL: process.env.DATABASE_URL || "",
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0 && config.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}
export default config;
//# sourceMappingURL=env.config.js.map