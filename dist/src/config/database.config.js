import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { config } from "./env.config.js";
// Singleton Prisma Client
let prisma = null;
/**
 * Get Prisma Client instance
 */
export const getPrismaClient = () => {
    if (!prisma) {
        if (!config.DATABASE_URL) {
            throw new Error("DATABASE_URL is not configured. Set it in your deployment environment variables.");
        }
        const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({
            adapter,
            log: config.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        });
    }
    return prisma;
};
/**
 * Connect to database
 */
export const connectDatabase = async () => {
    try {
        const client = getPrismaClient();
        await client.$connect();
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
};
/**
 * Disconnect from database
 */
export const disconnectDatabase = async () => {
    try {
        if (prisma) {
            await prisma.$disconnect();
            prisma = null;
            console.log("✅ Database disconnected successfully");
        }
    }
    catch (error) {
        console.error("❌ Database disconnection failed:", error);
        throw error;
    }
};
// Lazy db proxy prevents startup crashes in serverless environments.
export const db = new Proxy({}, {
    get(_target, prop, receiver) {
        return Reflect.get(getPrismaClient(), prop, receiver);
    },
});
export default db;
//# sourceMappingURL=database.config.js.map