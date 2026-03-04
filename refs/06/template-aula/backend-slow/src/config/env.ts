
import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://cache_user:cache_password@localhost:5432/cache_db?schema=public",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};
