
import { Request, Response } from "express";
import { getCachedReportOrRebuild } from "../jobs/cacheJob";

export async function getSalesReport(req: Request, res: Response) {
  const start = process.hrtime.bigint();
  const report = await getCachedReportOrRebuild();
  const end = process.hrtime.bigint();

  const durationMs = Number(end - start) / 1_000_000;

  return res.json({
    durationMs,
    report,
    fromCache: true,
  });
}
