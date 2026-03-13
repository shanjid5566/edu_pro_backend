import app from "./app.js";
import { config } from "./config/env.config.js";
import { connectDatabase, disconnectDatabase } from "./config/database.config.js";
const PORT = config.PORT || 5000;
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
    console.error(error.name, error.message);
    console.error(error.stack);
    process.exit(1);
});
// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDatabase();
        // Start listening
        const server = app.listen(PORT, () => {
            console.log("\n🚀 ========================================");
            console.log(`🚀 Server running in ${config.NODE_ENV} mode`);
            console.log(`🚀 Server is listening on port ${PORT}`);
            console.log(`🚀 Local: http://localhost:${PORT}`);
            console.log(`🚀 Health: http://localhost:${PORT}/api/${config.API_VERSION}/health`);
            console.log(`🚀 API Documentation: http://localhost:${PORT}/api-docs`);
            console.log("🚀 ========================================\n");
        });
        // Handle unhandled promise rejections
        process.on("unhandledRejection", (error) => {
            console.error("❌ UNHANDLED REJECTION! Shutting down...");
            console.error(error.name, error.message);
            server.close(async () => {
                await disconnectDatabase();
                process.exit(1);
            });
        });
        // Graceful shutdown
        process.on("SIGTERM", async () => {
            console.log("👋 SIGTERM received. Shutting down gracefully...");
            server.close(async () => {
                await disconnectDatabase();
                console.log("✅ Process terminated!");
            });
        });
        process.on("SIGINT", async () => {
            console.log("\n👋 SIGINT received. Shutting down gracefully...");
            server.close(async () => {
                await disconnectDatabase();
                console.log("✅ Process terminated!");
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
// Initialize server
startServer();
//# sourceMappingURL=index.js.map