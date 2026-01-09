// biome-ignore assist/source/organizeImports: <will fix later>
import type { Data2G4GModel } from "@/types/schema";
import type { MetricConfig } from "./comparison-types";
import { toZonedTime } from "date-fns-tz";
import { endOfDay, startOfDay } from "date-fns";

// 2G specific metric configurations
export const get2G4GMetricConfigs = (): MetricConfig[] => [
  {
    name: "TCH Traffic (Erl)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TCH_TRAFFIC_ERL || 0), 0),
    growthType: "successRate100",
  },
  {
    name: "SDCCH Traffic (Erl)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.SDCCH_TRAFFIC_ERL || 0), 0),
  },
  {
    name: "Total Payload (MB)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TOTAL_PAYLOAD_MB || 0), 0),
  },
  {
    name: "Payload EDGE (MB)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.EDGE_PAYLOAD_MB || 0), 0),
  },
  {
    name: "Payload GPRS (MB)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.GPRS_PAYLOAD_MB || 0), 0),
  },
  {
    name: "SDSR (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDSR || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDSR || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate100",
  },
  {
    name: "SDCCH Block (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SD_BLOCK || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SD_BLOCK || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
  },
  {
    name: "TCH Block (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_BLOCK || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_BLOCK || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
  },

  {
    name: "SDCCH Drop Rate (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDCCH_DROP || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDCCH_DROP || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate0",
  },
  {
    name: "TBF DL Establish (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_DL_EST || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_DL_EST || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
    growthType: "successRate100",
  },
  {
    name: "TBF UL Establish (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_UL_EST || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_UL_EST || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "TCH Drop (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_DROP || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_DROP || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "TBF Completion SR (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_COMP || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_COMP || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "EDGE DL Throughput (Kbps)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.EDGE_THP_KB || 0), 0),
  },
  {
    name: "GPRS DL Throughput (kbps)",
    tech: "2G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.GPRS_THP_KB || 0), 0),
  },
  {
    name: "HOSR (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_HOSR || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_HOSR || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "TCH Availability (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_AVAIL || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_AVAIL || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "SDCCH Availability (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDCCH_AVAIL || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDCCH_AVAIL || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "DL_RX_Qual_0_5",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_DL_QUAL_05 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_DL_QUAL_05 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "UL_RX_Qual_0_5",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_UL_QUAL_05 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_UL_QUAL_05 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "IB Band 1-3",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_IB_BAND_1_3 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_IB_BAND_1_3 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "IB Band 4-5",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_IB_BAND_4_5 || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_IB_BAND_4_5 || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "PDTCH Congestion (%)",
    tech: "2G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_PDTCH_CONGESTION || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_PDTCH_CONGESTION || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  //// metric 4G
  {
    name: "Total Payload (GB)",
    tech: "4G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TOTAL_PAYLOAD_GB || 0), 0),
  },
  {
    name: "Traffic VoLTE (KErl)",
    tech: "4G",
    calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TRAFFIC_VOLTE_KERL || 0), 0),
  },
  {
    name: "DL PRB Utilization (%)",
    tech: "4G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.DL_PRB_UTILIZATION_NUM || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.DL_PRB_UTILIZATION_DENUM || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
  {
    name: "Max RRC Connection Users",
    tech: "4G",
    calculate: (filteredData) => {
      if (!filteredData || filteredData.length === 0) return 0;

      const values = filteredData
        .map((item) => item.MAX_MAX_NUMBER_RRC_CONNECTION_USER)
        .filter((value) => value !== null && value !== undefined && !Number.isNaN(value));

      if (values.length === 0) return 0;

      return Math.max(...values);
    },
  },
  {
    name: "User DL Throughput (Mbps)",
    tech: "4G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.USER_DL_THP_NUM || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.USER_DL_THP_DENUM || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number((totalNum / totalDenum / 1000).toFixed(2)) : 0;
    },
  },
  {
    name: "Availability (%)",
    tech: "4G",
    calculate: (filteredData) => {
      const totalNum = filteredData.reduce((sum, item) => sum + (item.AVAILABILITY_NUM || 0), 0);
      const totalDenum = filteredData.reduce((sum, item) => sum + (item.AVAILABILITY_DENUM || 0), 0);
      return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
    },
  },
];

// Generic filter function that can be shared
export const filterByDateRange = (
  data: Data2G4GModel[],
  startDate: string,
  endDate: string,
  timezone = "Asia/Makassar",
): Data2G4GModel[] => {
  if (!startDate || !endDate) return [];

  const start = startOfDay(toZonedTime(new Date(startDate), timezone));
  const end = endOfDay(toZonedTime(new Date(endDate), timezone));

  return data.filter((item) => {
    const itemDate = toZonedTime(new Date(item.BEGIN_TIME), timezone);
    return itemDate >= start && itemDate <= end;
  });
};
