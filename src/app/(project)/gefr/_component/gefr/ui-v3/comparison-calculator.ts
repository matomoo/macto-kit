// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg2gModel } from "@/types/schema";
import type { MetricConfig, ComparisonResult } from "./comparison-types";
import { calculateSuccessRate0, calculateSuccessRate100 } from "../../../_function/helper";
import { toZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";

// Unified growth calculation function
export const calculateGrowthForMetric = (
  before: number,
  after: number,
  growthType: MetricConfig["growthType"] = "standard",
): { delta: number; growth: number } => {
  let delta = after - before;

  // For metrics that should decrease, invert the delta for display purposes
  if (growthType === "successRate0") {
    delta = -(after - before);
  }

  let growth = 0;

  if (before === 0) {
    return { delta, growth };
  }

  switch (growthType) {
    case "successRate100":
      growth = calculateSuccessRate100(before, after);
      break;
    case "successRate0":
      growth = calculateSuccessRate0(before, after);
      break;
    default:
      growth = ((after - before) / before) * 100;
      break;
  }

  return { delta, growth };
};

// Main comparison calculation function
export const calculateComparisonData = (
  data: Agg2gModel[],
  metricCalculators: MetricConfig[],
  beforeRange: { startDate: string; endDate: string },
  afterRange: { startDate: string; endDate: string },
  timezone = "Asia/Makassar",
): ComparisonResult[] => {
  // Filter data by date range
  const filterByDateRange = (startDate: string, endDate: string): Agg2gModel[] => {
    if (!startDate || !endDate) return [];

    // Convert ISO strings to dates and set to start/end of day in the target timezone
    const start = startOfDay(toZonedTime(new Date(startDate), timezone));
    const end = endOfDay(toZonedTime(new Date(endDate), timezone));

    return data.filter((item) => {
      const itemDate = toZonedTime(new Date(item.BEGIN_TIME), timezone);
      return itemDate >= start && itemDate <= end;
    });
  };

  const beforeData = filterByDateRange(beforeRange.startDate, beforeRange.endDate);
  const afterData = filterByDateRange(afterRange.startDate, afterRange.endDate);

  return metricCalculators.map(({ name, calculate, growthType = "standard" }) => {
    const before = calculate(beforeData);
    const after = calculate(afterData);

    const { delta, growth } = calculateGrowthForMetric(before, after, growthType);

    return {
      metric: name,
      before,
      after,
      delta,
      growth,
    };
  });
};

// Alternative version with custom filter function (for more flexibility)
export const calculateComparisonDataWithFilter = (
  beforeData: Agg2gModel[],
  afterData: Agg2gModel[],
  metricCalculators: MetricConfig[],
): ComparisonResult[] => {
  return metricCalculators.map(({ name, calculate, growthType = "standard" }) => {
    const before = calculate(beforeData);
    const after = calculate(afterData);

    const { delta, growth } = calculateGrowthForMetric(before, after, growthType);

    return {
      metric: name,
      before,
      after,
      delta,
      growth,
    };
  });
};
