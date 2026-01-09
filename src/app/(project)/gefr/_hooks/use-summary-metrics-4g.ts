// hooks/use-summary-metrics.ts
// biome-ignore assist/source/organizeImports: <will fix later>
import { useMemo, useCallback } from "react";
import type { Data2G4GModel } from "@/types/schema";

interface UseSummaryMetricsProps {
  filteredData: Data2G4GModel[];
  allCellsCount: number;
}

export function useSummaryMetrics4G({ filteredData, allCellsCount }: UseSummaryMetricsProps) {
  const calculateSummaryMetrics = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        productivity: { value: 0, percentage: "0.00%" },
        tchTraffic: { value: 0, percentage: "0.00%" },
        totalPayload: { value: 0, percentage: "0.00%" },
      };
    }

    const totalPayloadGbSum = filteredData.reduce((sum: number, item: Data2G4GModel) => {
      const traffic = Number(item.TOTAL_PAYLOAD_GB) || 0;
      return sum + traffic;
    }, 0);
    const avgTchTraffic = filteredData.length > 0 ? totalPayloadGbSum / filteredData.length : 0;

    const payloadSum = filteredData.reduce((sum: number, item: Data2G4GModel) => {
      const payload = Number(item.TOTAL_PAYLOAD_GB) || 0;
      return sum + payload;
    }, 0);
    const avgPayload = filteredData.length > 0 ? payloadSum / filteredData.length : 0;

    const productivity = allCellsCount > 0 ? totalPayloadGbSum / allCellsCount : 0;

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
