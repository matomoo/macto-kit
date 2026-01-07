import type { Agg2gModel } from "@/types/schema";

export interface MetricConfig {
  name: string;
  calculate: (data: Agg2gModel[]) => number;
  growthType?: "successRate100" | "successRate0" | "standard" | "inverse";
}

export interface ComparisonResult {
  metric: string;
  before: number;
  after: number;
  delta: number;
  growth: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
