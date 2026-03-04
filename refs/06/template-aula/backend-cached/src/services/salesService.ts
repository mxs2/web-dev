
import { prisma } from "../config/prisma";
import { SalesReport, SectorSummary } from "../types/SalesReport";

export async function generateSalesReportFromDb(): Promise<SalesReport> {
  const sales = await prisma.sale.findMany();

  let totalAmount = 0;
  const bySector: Record<string, { amount: number; count: number }> = {};

  for (const sale of sales) {
    totalAmount += sale.amount;

    if (!bySector[sale.sector]) {
      bySector[sale.sector] = { amount: 0, count: 0 };
    }

    bySector[sale.sector].amount += sale.amount;
    bySector[sale.sector].count += 1;
  }

  const sectors: SectorSummary[] = Object.entries(bySector).map(
    ([sector, info]) => ({
      sector,
      totalAmount: parseFloat(info.amount.toFixed(2)),
      avgAmount: parseFloat((info.amount / info.count).toFixed(2)),
      salesCount: info.count,
    })
  );

  return {
    generatedAt: new Date().toISOString(),
    totalSales: sales.length,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    sectors,
  };
}
