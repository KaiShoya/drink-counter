export interface AnnualSummaryInput {
  year: number;
  timezone: string; // IANA tz e.g., "Asia/Tokyo"
  dayCutoffHour: number; // 0-23
  filters?: {
    labelIds?: string[];
    visibility?: 'visible' | 'all';
  };
}

export interface AnnualKPI {
  totalDrinks: number;
  totalVolumeMl: number;
  activeDays: number;
  avgPerCalendarDay: number;
  avgPerActiveDay: number;
  yoyChangePct?: number; // 前年比
}

export interface AnnualSummaryOutput {
  period: { start: string; end: string; days: number };
  kpi: AnnualKPI;
  meta: { unit: 'ml' | 'oz' };
}
