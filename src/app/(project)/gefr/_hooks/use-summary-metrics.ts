// hooks/use-summary-metrics.ts
// biome-ignore assist/source/organizeImports: <will fix later>
import { useMemo, useCallback } from "react";
import type { Agg2gModel } from "@/types/schema";

interface UseSummaryMetricsProps {
  filteredData: Agg2gModel[];
  allCellsCount: number;
}

export function useSummaryMetrics({ filteredData, allCellsCount }: UseSummaryMetricsProps) {
  const calculateSummaryMetrics = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        productivity: { value: 0, percentage: "0.00%" },
        tchTraffic: { value: 0, percentage: "0.00%" },
        totalPayload: { value: 0, percentage: "0.00%" },
      };
    }

    const tchTrafficSum = filteredData.reduce((sum: number, item: Agg2gModel) => {
      const traffic = Number(item.TCH_TRAFFIC_ERL) || 0;
      return sum + traffic;
    }, 0);
    const avgTchTraffic = filteredData.length > 0 ? tchTrafficSum / filteredData.length : 0;

    const payloadSum = filteredData.reduce((sum: number, item: Agg2gModel) => {
      const payload = Number(item.TOTAL_PAYLOAD_MB) || 0;
      return sum + payload;
    }, 0);
    const avgPayload = filteredData.length > 0 ? payloadSum / filteredData.length : 0;

    const productivity = allCellsCount > 0 ? tchTrafficSum / allCellsCount : 0;

    return {
      productivity: {
        value: productivity,
        percentage: `${productivity.toFixed(2)}%`,
      },
      tchTraffic: {
        value: avgTchTraffic,
        percentage: `${avgTchTraffic.toFixed(2)}%`,
      },
      totalPayload: {
        value: avgPayload,
        percentage: `${avgPayload.toFixed(2)}%`,
      },
    };
  }, [filteredData, allCellsCount]);

  const summaryMetrics = useMemo(() => calculateSummaryMetrics(), [calculateSummaryMetrics]);

  return { summaryMetrics };
}
