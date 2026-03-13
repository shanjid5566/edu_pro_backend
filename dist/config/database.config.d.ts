import { PrismaClient } from "@prisma/client";
/**
 * Get Prisma Client instance
 */
export declare const getPrismaClient: () => PrismaClient;
/**
 * Connect to database
 */
export declare const connectDatabase: () => Promise<void>;
/**
 * Disconnect from database
 */
export declare const disconnectDatabase: () => Promise<void>;
export declare const db: PrismaClient;
export default db;
//# sourceMappingURL=database.config.d.ts.map