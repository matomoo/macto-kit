// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg2gModel } from "@/types/schema";
import type { MetricConfig } from "./comparison-types";
import { toZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";

// 2G specific metric configurations
export const get2GMetricConfigs = (): MetricConfig[] => [
  {
    name: "SDSR (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDSR || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDSR || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate100",
  },
  {
    name: "TCH Block (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_BLOCK || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_BLOCK || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
  },
  {
    name: "SDCCH Block (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SD_BLOCK || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SD_BLOCK || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
  },
  {
    name: "SDCCH Drop Rate (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDCCH_DROP || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDCCH_DROP || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
  },
  {
    name: "TBF DL Establish (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_DL_EST || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_DL_EST || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate100",
  },
  // ... Add all other metrics from your original code
  // You can also create separate configs for different network types
];

// Generic filter function that can be shared
export const filterByDateRange = (
  data: Agg2gModel[],
  startDate: string,
  endDate: string,
  timezone = "Asia/Makassar",
): Agg2gModel[] => {
  if (!startDate || !endDate) return [];

  const start = startOfDay(toZonedTime(new Date(startDate), timezone));
  const end = endOfDay(toZonedTime(new Date(endDate), timezone));

  return data.filter((item) => {
    const itemDate = toZonedTime(new Date(item.BEGIN_TIME), timezone);
    return itemDate >= start && itemDate <= end;
  });
};
