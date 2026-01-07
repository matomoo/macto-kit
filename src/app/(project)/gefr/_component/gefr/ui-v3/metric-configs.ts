// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg2gModel } from "@/types/schema";
import type { MetricConfig } from "./comparison-types";
import { toZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";

// 2G specific metric configurations
export const get2GMetricConfigs = (): MetricConfig[] => [
  {
    name: "TCH Traffic (Erl)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TCH_TRAFFIC_ERL || 0), 0),
    growthType: "successRate100",
  },
  {
    name: "SDCCH Traffic (Erl)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.SDCCH_TRAFFIC_ERL || 0), 0),
  },
  {
    name: "Total Payload (MB)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TOTAL_PAYLOAD_MB || 0), 0),
  },
  {
    name: "Payload EDGE (MB)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.EDGE_PAYLOAD_MB || 0), 0),
  },
  {
    name: "Payload GPRS (MB)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.GPRS_PAYLOAD_MB || 0), 0),
  },
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
    name: "SDCCH Block (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SD_BLOCK || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SD_BLOCK || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
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
  {
    name: "TBF UL Establish (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_UL_EST || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_UL_EST || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "TCH Drop (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_DROP || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_DROP || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "TBF Completion SR (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_COMP || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_COMP || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "EDGE DL Throughput (Kbps)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.EDGE_THP_KB || 0), 0),
  },
  {
    name: "GPRS DL Throughput (kbps)",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.GPRS_THP_KB || 0), 0),
  },
  {
    name: "HOSR (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_HOSR || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_HOSR || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "TCH Availability (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_AVAIL || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_AVAIL || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "SDCCH Availability (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDCCH_AVAIL || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDCCH_AVAIL || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "DL_RX_Qual_0_5",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_DL_QUAL_05 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_DL_QUAL_05 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "UL_RX_Qual_0_5",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_UL_QUAL_05 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_UL_QUAL_05 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "IB Band 1-3",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_IB_BAND_1_3 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_IB_BAND_1_3 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "IB Band 4-5",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_IB_BAND_4_5 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_IB_BAND_4_5 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "PDTCH Congestion (%)",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_PDTCH_CONGESTION || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_PDTCH_CONGESTION || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
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
