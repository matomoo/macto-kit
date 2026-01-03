"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Agg2gModel } from "@/types/schema";
import LineChart2GAggHourlyV10 from "./line-chart-2g-agg-hourly-v10";
import { useFilterStore } from "@/stores/filterStore";
import { extractCellName } from "../../../_function/helper";
import { TwSmall } from "../../typography/typography";

interface AggCustomProps {
  area: string;
  apiPath: string;
  aggregateBy?: string; // Add this prop
  filterLabel?: string; // Add this for the filter section label
  columnNumber?: number;
}

export default function PageAggCustom2GHourlyV3({
  apiPath,
  aggregateBy = "BTS_NAME", // Grouping
  filterLabel = "BTS Level", // Default value
  columnNumber = 2,
}: AggCustomProps) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [allCells, setAllCells] = useState<string[]>([]);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|");

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ["PageAggCustom2GHourly", apiPath, dateRange2, filter, siteId, nop, kabupaten, batch],
    queryFn: async () => {
      if (!shouldFetch) {
        return [];
      }
      const response = await fetch(
        `/gefr/api/meas/${apiPath}?batch=${batch}&siteId=${siteId}&nop=${nop}&kabupaten=${kabupaten}&tgl_1=${dateRange2?.split("|")[0]}&tgl_2=${dateRange2?.split("|")[1]}`,
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
          data.rows.map((item: Agg2gModel) =>
            aggregateBy.includes("BTS")
              ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
              : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown"),
          ),
        ),
      ).sort() as string[];

      setAllCells(uniqueCells);
      setSelectedCells(uniqueCells); // Select all cells by default
    }
  }, [data, aggregateBy]); // Add aggregateBy to dependency

  const handleCellSelection = (cellName: string) => {
    setSelectedCells((prev) => {
      if (prev.includes(cellName)) {
        return prev.filter((cell) => cell !== cellName);
      }
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
  const filterDataBySelectedCells = (data: Agg2gModel[]) => {
    if (!data || selectedCells.length === 0) return [];

    return data.filter((item) => {
      const cellName = aggregateBy.includes("BTS")
        ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
        : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
      return selectedCells.includes(cellName);
    });
  };

  if (isPending) return "Loading...";
  if (error) return `An error has occurred: ${error.message}`;

  // console.log(data)

  const updatedData = data.rows.map((item: Agg2gModel) => {
    const baseItem = { ...item };
    return baseItem;
  });

  const filteredData = filterDataBySelectedCells(updatedData);

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      {!isFetching && (
        <div>
          <TwSmall text={filterLabel} /> {/* Use the prop here */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Filter by {filterLabel}:</h3> {/* Use the prop here */}
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
                Selected: {selectedCells.length} of {allCells.length} {filterLabel}s {/* Use the prop here */}
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
          {/* <div className="grid grid-cols-1 gap-4">
                <WpcZeroTraffic2g nop={nop!} title={"WPC Zero Traffic"} />
              </div> */}

          <div className={`grid grid-cols-1 md:grid-cols-${columnNumber} gap-4`}>
            {[
              { metric_num: "SDCCH_TRAFFIC_ERL", metric_denum: "DENUMBY1", title: "SDCCH Traffic (Erl)" },
              { metric_num: "TCH_TRAFFIC_ERL", metric_denum: "DENUMBY1", title: "TCH Traffic (Erl)" },
              { metric_num: "TOTAL_PAYLOAD_MB", metric_denum: "DENUMBY1", title: "Total Payload (MB)" },
              { metric_num: "NUM_TCH_AVAIL", metric_denum: "DENUM_TCH_AVAIL", title: "TCH Availability (%)" },
              { metric_num: "NUM_SD_BLOCK", metric_denum: "DENUM_SD_BLOCK", title: "SD Blocking (%)" },
              { metric_num: "NUM_TCH_BLOCK", metric_denum: "DENUM_TCH_BLOCK", title: "TCH Blocking (%)" },
              {
                metric_num: "NUM_PDTCH_CONGESTION",
                metric_denum: "DENUM_PDTCH_CONGESTION",
                title: "PDTCH Congestion (%)",
              },
              { metric_num: "NUM_SDCCH_AVAIL", metric_denum: "DENUM_SDCCH_AVAIL", title: "SDCCH Availability (%)" },
              { metric_num: "NUM_SDSR", metric_denum: "DENUM_SDSR", title: "SDSR (%)" },
              { metric_num: "NUM_TCH_DROP", metric_denum: "DENUM_TCH_DROP", title: "TCH Drop Rate (%)" },
              { metric_num: "NUM_HOSR", metric_denum: "DENUM_HOSR", title: "HOSR (%)" },
              { metric_num: "NUM_TBF_DL_EST", metric_denum: "DENUM_TBF_DL_EST", title: "TBF DL Establishment SR (%)" },
              { metric_num: "NUM_TBF_UL_EST", metric_denum: "DENUM_TBF_UL_EST", title: "User DL Throughput (Kbps)" },
              { metric_num: "NUMBER_SDCCH", metric_denum: "DENUMBY1", title: "Number of SDCCH" },
              { metric_num: "NUMBER_TCH", metric_denum: "DENUMBY1", title: "Number of TCH" },
              { metric_num: "NUMBER_STATIC_PDTCH", metric_denum: "DENUMBY1", title: "Number of Static PDTCH" },
              { metric_num: "NUMBER_DYNAMIC_PDTCH", metric_denum: "DENUMBY1", title: "Number of Dynamic PDTCH" },
              { metric_num: "NUMBER_TRX", metric_denum: "DENUMBY1", title: "Number of TRX" },
              { metric_num: "NUM_DL_QUAL_05", metric_denum: "DENUM_DL_QUAL_05", title: "DL RX Quality (%)" },
              { metric_num: "NUM_UL_QUAL_05", metric_denum: "DENUM_UL_QUAL_05", title: "UL RX Quality (%)" },
              { metric_num: "NUM_TBF_COMP", metric_denum: "DENUM_TBF_COMP", title: "TBF Completion SR (%)" },
              {
                metric_num: "NUM_ICM_INTERFERENCE",
                metric_denum: "DENUM_ICM_INTERFERENCE",
                title: "ICM Interference (%)",
              },
              { metric_num: "NUM_DL_EMI", metric_denum: "DENUM_DL_EMI", title: "DL EVQI" },
              { metric_num: "NUM_UL_EMI", metric_denum: "DENUM_UL_EMI", title: "UL EVQI" },
            ].map((chart) => (
              <LineChart2GAggHourlyV10
                key={chart.metric_num}
                data={filteredData}
                metric_num={chart.metric_num}
                metric_denum={chart.metric_denum}
                title={chart.title}
                aggregation_by={aggregateBy} // Use the prop here
                isExtractCellName={!!aggregateBy.includes("BTS")}
                isSR100={chart.metric_num === "NUM_TBF_DL_EST"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
