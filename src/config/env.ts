import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getPort(): number {
  const rawPort = getRequiredEnv("PORT");
  const parsed = Number(rawPort);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Invalid PORT value. PORT must be a positive integer");
  }

  return parsed;
}

function getCorsOrigins(): string[] {
  const rawOrigins = getRequiredEnv("CORS_ORIGINS");
  const origins = rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error("Invalid CORS_ORIGINS value. Provide at least one origin");
  }

  return origins;
}

export const env = {
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  JWT_EXPIRY: getRequiredEnv("JWT_EXPIRY"),
  PORT: getPort(),
  CORS_ORIGINS: getCorsOrigins(),
};
