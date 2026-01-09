// hooks/useComparisonCalculation.ts
// biome-ignore assist/source/organizeImports: <will fix later>
import { useMemo } from "react";
import { subDays, differenceInDays, addDays } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import type { Data2G4GModel } from "@/types/schema";
import type { ComparisonResult, DateRange } from "./comparison-types";
import { get2G4GMetricConfigs } from "./metric-configs";
import { calculateComparisonData } from "./comparison-calculator";

export function useComparisonCalculation(data: Data2G4GModel[], tech: string, timezone = "Asia/Makassar") {
  // Calculate default date ranges
  const { beforeRange, afterRange } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        beforeRange: { startDate: "", endDate: "" } as DateRange,
        afterRange: { startDate: "", endDate: "" } as DateRange,
      };
    }

    const dateStrings = data.map((item) => item.BEGIN_TIME);
    dateStrings.sort((a, b) => Date.parse(a) - Date.parse(b));

    const createDateInTimezone = (date: Date) => {
      const zonedDate = toZonedTime(date, timezone);
      return fromZonedTime(zonedDate, timezone);
    };

    const firstDateString = dateStrings[0];
    const lastDateString = dateStrings[dateStrings.length - 1];
    const diffInDays = differenceInDays(new Date(lastDateString), new Date(firstDateString));

    const afterRange: DateRange = {
      startDate: createDateInTimezone(subDays(new Date(lastDateString), diffInDays < 7 ? 1 : 2)).toISOString(),
      endDate: createDateInTimezone(subDays(new Date(lastDateString), diffInDays < 7 ? 0 : 0)).toISOString(),
    };

    const beforeRange: DateRange = {
      startDate: createDateInTimezone(addDays(new Date(firstDateString), diffInDays < 7 ? 0 : 0)).toISOString(),
      endDate: createDateInTimezone(addDays(new Date(firstDateString), diffInDays < 7 ? 1 : 2)).toISOString(),
    };

    return { beforeRange, afterRange };
  }, [data, timezone]);

  // Get metric configurations
  const metricCalculators = useMemo(() => get2G4GMetricConfigs().filter((config) => config.tech === tech), [tech]);

  // Calculate comparison data
  const comparisonData = useMemo((): ComparisonResult[] => {
    if (!data || data.length === 0) return [];
    return calculateComparisonData(data, metricCalculators, beforeRange, afterRange, timezone);
  }, [data, metricCalculators, beforeRange, afterRange, timezone]);

  // Filter for specific metrics
  const productivityMetrics = useMemo(
    () => comparisonData.filter((row) => row.metric === "TCH Traffic (Erl)" || row.metric === "Total Payload (MB)"),
    [comparisonData],
  );

  return {
    beforeRange,
    afterRange,
    comparisonData,
    productivityMetrics,
    getMetric: (metricName: string) => comparisonData.find((item) => item.metric === metricName),
  };
}
