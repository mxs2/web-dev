import * as dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
};
