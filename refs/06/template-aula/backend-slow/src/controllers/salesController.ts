
import { Request, Response } from "express";
import { generateSalesReport } from "../services/salesService";

export async function getSalesReport(req: Request, res: Response) {
  const start = process.hrtime.bigint();
  const report = await generateSalesReport();
  const end = process.hrtime.bigint();

  const durationMs = Number(end - start) / 1_000_000;

  return res.json({
    durationMs,
    report,
  });
}
