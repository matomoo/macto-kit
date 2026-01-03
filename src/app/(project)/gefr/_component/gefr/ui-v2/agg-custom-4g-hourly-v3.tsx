"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Agg4gHyModel } from "@/types/schema";
import LineChart4GAggHourlyV9 from "./line-chart-4g-agg-hourly-v9";
import { useFilterStore } from "@/stores/filterStore";
import { extractCellName } from "../../../_function/helper";
import { TwSmall } from "../../typography/typography";
// import DateRangeComparisonV2 from "../component/table-comparison/table-comparison-v2";

interface AggCustomProps {
  area: string;
  apiPath: string;
  aggregateBy?: string; // Add this prop
  filterLabel?: string;
}

export default function PageAggCustom4GHourly({
  area,
  apiPath,
  aggregateBy = "CELL_NAME", // Grouping
  filterLabel = "BTS Level", // Default value
}: AggCustomProps) {
  const { dateRange2, filter, siteId, nop, kabupaten } = useFilterStore();
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [allCells, setAllCells] = useState<string[]>([]);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|");

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ["PageAggCustom4GHourly", apiPath, dateRange2, filter, siteId, nop, kabupaten],
    queryFn: async () => {
      if (!shouldFetch) {
        return [];
      }
      const response = await fetch(
        `/api/gefr/${area}/${apiPath}?siteId=${siteId}&nop=${nop}&kabupaten=${kabupaten}&tgl_1=${dateRange2?.split("|")[0]}&tgl_2=${dateRange2?.split("|")[1]}`,
      );
      return await response.json();
    },
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (shouldFetch) {
      refetch();
    }
  }, [refetch, shouldFetch]);

  // Extract unique cell names when data changes
  useEffect(() => {
    if (data && data.rows.length > 0) {
      const uniqueCells: string[] = Array.from(
        new Set(
          data.rows.map((item: Agg4gHyModel) =>
            aggregateBy.includes("CELL")
              ? extractCellName(String(item[aggregateBy as keyof Agg4gHyModel] ?? "Unknown"))
              : String(item[aggregateBy as keyof Agg4gHyModel]),
          ),
        ),
      ).sort() as string[];

      setAllCells(uniqueCells);
      setSelectedCells(uniqueCells); // Select all cells by default
    }
  }, [data, aggregateBy]);

  const handleCellSelection = (cellName: string) => {
    setSelectedCells((prev) => {
      if (prev.includes(cellName)) {
        // If already selected, remove it
        return prev.filter((cell) => cell !== cellName);
      }
      // If not selected, add it
      return [...prev, cellName];
    });
  };

  const selectAllCells = () => {
    setSelectedCells([...allCells]);
  };

  const clearAllCells = () => {
    setSelectedCells([]);
  };

  // Filter data based on selected cells
  const filterDataBySelectedCells = (data: Agg4gHyModel[]) => {
    if (!data || selectedCells.length === 0) return [];

    return data.filter((item) => {
      const cellName = aggregateBy.includes("CELL")
        ? extractCellName(String(item[aggregateBy as keyof Agg4gHyModel] ?? "Unknown"))
        : String(item[aggregateBy as keyof Agg4gHyModel] ?? "Unknown");
      return selectedCells.includes(cellName);
    });
  };

  if (isPending) return "Loading...";
  if (error) return `An error has occurred: ${error.message}`;

  // console.log(data)

  const updatedData = data.rows.map((item: Agg4gHyModel) => {
    const baseItem = { ...item };
    return baseItem;
    // return transformMeasurementValues_Sulw4G(baseItem);
  });

  const filteredData = filterDataBySelectedCells(updatedData);

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      {!isFetching && (
        <div>
          <TwSmall text={filterLabel} />
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Filter by {filterLabel}:</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllCells}
                  className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearAllCells}
                  className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
              {allCells.map((cellName) => (
                <label key={cellName} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCells.includes(cellName)}
                    onChange={() => handleCellSelection(cellName)}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  {cellName}
                </label>
              ))}
            </div>

            {selectedCells.length > 0 && (
              <div className="mt-2 text-gray-600 text-sm">
                Selected: {selectedCells.length} of {allCells.length} {filterLabel}s
              </div>
            )}
          </div>
        </div>
      )}

      {isFetching ? (
        <div>Searching data...</div>
      ) : filteredData.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {selectedCells.length === 0
            ? `Please select at least one ${filterLabel.toLowerCase()}`
            : "No data available for selected cells"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { metric_num: "DL_PAYLOAD_GB", metric_denum: "DENUMBY1", title: "Total Payload (GB)" },
              { metric_num: "MAX_MAX_NUMBER_RRC_CONNECTION_USER", metric_denum: "DENUMBY1", title: "Max RRC User" },
              { metric_num: "AVAILABILITY_NUM", metric_denum: "AVAILABILITY_DENUM", title: "Availability (%)" },
              {
                metric_num: "DL_PRB_UTILIZATION_NUM",
                metric_denum: "DL_PRB_UTILIZATION_DENUM",
                title: "DL PRB Utilization (%)",
              },
              {
                metric_num: "UL_PRB_UTILIZATION_NUM",
                metric_denum: "UL_PRB_UTILIZATION_DENUM",
                title: "UL PRB Utilization (%)",
              },
              { metric_num: "USER_DL_THP_NUM", metric_denum: "USER_DL_THP_DENUM", title: "User DL Throughput (Kbps)" },
              { metric_num: "USER_UL_THP_NUM", metric_denum: "USER_UL_THP_DENUM", title: "User UL Throughput (Kbps)" },
              { metric_num: "DL_RB_AVAILABLE", metric_denum: "DENUMBY1", title: "DL PRB Available" },
              { metric_num: "SE_NUM", metric_denum: "SE_DENUM", title: "SE" },
              { metric_num: "AVG_CQI", metric_denum: "DENUMBY1", title: "CQI" },
            ].map((chart) => (
              <LineChart4GAggHourlyV9
                key={chart.metric_num}
                data={filteredData}
                metric_num={chart.metric_num}
                metric_denum={chart.metric_denum}
                title={chart.title}
                aggregation_by={aggregateBy} // Use the prop here
                isExtractCellName={!!aggregateBy.includes("CELL")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
