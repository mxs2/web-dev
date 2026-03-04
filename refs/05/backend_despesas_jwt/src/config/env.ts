import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 3003),
  DATABASE_URL: process.env.DATABASE_URL ?? ""
};
