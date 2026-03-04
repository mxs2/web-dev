
import cron from "node-cron";
import { redis } from "../config/redis";
import { generateSalesReportFromDb } from "../services/salesService";
import { SalesReport } from "../types/SalesReport";

const CACHE_KEY = "sales:report";

export function startCacheJob() {
  // roda a cada 1 minuto
  cron.schedule("* * * * *", async () => {
    console.log("[CRON] Recalculando relatório de vendas e atualizando cache...");
    const report = await generateSalesReportFromDb();
    await redis.set(CACHE_KEY, JSON.stringify(report), "EX", 60);
  });
}

export async function getCachedReportOrRebuild(): Promise<SalesReport> {
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached) as SalesReport;
  }

  const report = await generateSalesReportFromDb();
  await redis.set(CACHE_KEY, JSON.stringify(report), "EX", 60);
  return report;
}
