import type { Data2G4GModel } from "@/types/schema";

export interface MetricConfig {
  name: string;
  tech: "2G" | "4G";
  calculate: (data: Data2G4GModel[]) => number;
  growthType?: "successRate100" | "successRate0" | "standard" | "inverse";
}

export interface ComparisonResult {
  tech: "2G" | "4G";
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
