
export type SectorSummary = {
  sector: string;
  totalAmount: number;
  avgAmount: number;
  salesCount: number;
};

export type SalesReport = {
  generatedAt: string;
  totalSales: number;
  totalAmount: number;
  sectors: SectorSummary[];
};
