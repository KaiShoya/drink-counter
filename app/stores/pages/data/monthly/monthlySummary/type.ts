/**
 * 月別ビュー 入出力型
 * docs/specs/monthly-view.md のデータ契約に準拠
 */

export interface MonthlySummaryInput {
  month: string; // YYYY-MM
  timezone: string; // IANA tz e.g., "Asia/Tokyo"
  dayCutoffHour: number; // 0-23
  filters?: {
    labelIds?: string[];
    visibility?: 'visible' | 'all';
  };
}

export interface MonthlyKPI {
  /** 合計杯数 = Σ(drink_counters.count) */
  totalDrinks: number;
  /** 合計容量(ml) = Σ(drinks.amount × drink_counters.count) */
  totalVolumeMl: number;
  /** その月に1杯以上飲んだ日数 */
  activeDays: number;
  /** 合計杯数/カレンダー日数 */
  avgPerCalendarDay: number;
  /** 合計杯数/アクティブ日数（アクティブ日数=0のときは0） */
  avgPerActiveDay: number;
  /** 前月比（%）。比較対象=0のときは0%を返す仕様 */
  momChangePct?: number;
}

export interface MonthlyCalendarCell {
  /** YYYY-MM-DD （締め時間適用後の日付） */
  date: string;
  /** 当日のΣ(drink_counters.count) */
  count: number;
  /** 当日の容量合計(ml) */
  volumeMl: number;
  /** 最頻ラベルID（同率は任意の一つ） */
  topLabelId?: number;
  /** 目標超過フラグ */
  overGoal?: boolean;
}

export interface MonthlyDailySeriesItem {
  date: string; // YYYY-MM-DD
  /** ラベル別の集計。キーはlabelId */
  byLabel: Record<string, { count: number; volumeMl: number }>;
  total: { count: number; volumeMl: number };
}

export interface MonthlyLabelDonutItem {
  labelId: number | string; // 既存データは number、未知は 'unknown'
  count: number;
  volumeMl: number;
}

export interface MonthlyAverages {
  byWeekday: Array<{
    /** 0(日)~6(土) */
    weekday: number;
    countAvg: number;
    volumeAvgMl: number;
    median?: number;
    stddev?: number;
  }>;
  byLabel: Array<{
    labelId: string;
    countAvg: number;
    /** 任意（UIで使う場合に対応） */
    volumeAvgMl?: number;
    sharePct: number;
  }>;
  byTimeband?: Array<{
    band: string; // 例: "17-19"
    countAvg: number;
    sharePct: number;
  }>;
}

export interface MonthlySummaryOutput {
  period: { start: string; end: string; days: number };
  kpi: MonthlyKPI;
  /** ゼロ埋め済み。指定月の全日が1要素 */
  calendar: MonthlyCalendarCell[];
  dailySeries: MonthlyDailySeriesItem[];
  labelDonut: MonthlyLabelDonutItem[];
  averages: MonthlyAverages;
  meta: {
    unit: 'ml' | 'oz';
    /** カレンダーが密（ゼロ埋め）であることの保証 */
    denseCalendar: true;
  };
}
