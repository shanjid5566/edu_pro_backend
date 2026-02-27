import dotenv from 'dotenv';
dotenv.config();
const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    databaseUrl: process.env.DATABASE_URL ?? '',
};
const isProduction = env.nodeEnv === 'production';
export { env, isProduction };
//# sourceMappingURL=env.js.map