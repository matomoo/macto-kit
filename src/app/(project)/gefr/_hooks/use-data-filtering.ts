// hooks/use-data-filtering.ts
// biome-ignore assist/source/organizeImports: <will fix later>
import { useMemo } from "react";
import type { Agg2gModel } from "@/types/schema";
import { extractBandFromCellName, extractCellName } from "../_function/helper";

interface UseDataFilteringProps {
  data: { rows: Agg2gModel[] } | undefined;
  filterBy: string;
  selectedCells: string[];
  selectedSectors: string[];
  selectedBands: string[];
  aggregateBy: string;
}

export function useDataFiltering({
  data,
  filterBy,
  selectedCells,
  selectedSectors,
  selectedBands,
  aggregateBy,
}: UseDataFilteringProps) {
  const filteredData = useMemo(() => {
    if (!data?.rows) return [];

    if (filterBy === "cell") {
      if (!data || selectedCells.length === 0) return [];

      return data.rows.filter((item: Agg2gModel) => {
        const cellName = aggregateBy.includes("BTS")
          ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
          : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
        return selectedCells.includes(cellName);
      });
    }

    if (filterBy === "sector") {
      if (!data || selectedSectors.length === 0) return [];

      return data.rows.filter((item: Agg2gModel) => {
        const cellName = aggregateBy.includes("BTS")
          ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
          : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
        const sector = cellName.slice(-1);
        return selectedSectors.includes(sector);
      });
    }

    if (filterBy === "band") {
      if (!data || selectedBands.length === 0) return [];

      return data.rows.filter((item: Agg2gModel) => {
        const cellName = aggregateBy.includes("BTS")
          ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
          : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
        const band = extractBandFromCellName(cellName);
        return selectedBands.includes(band);
      });
    }

    return [];
  }, [data, filterBy, selectedCells, selectedSectors, selectedBands, aggregateBy]);

  return { filteredData };
}
