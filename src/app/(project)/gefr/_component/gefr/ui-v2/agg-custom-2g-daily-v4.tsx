"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/stores/filterStore";
import { useEffect, useState } from "react";
import LineChart2GAggDailyV8 from "./line-chart-2g-agg-daily-v8";
import type { Agg2gModel } from "@/types/schema";
import {
  ErrorState,
  exportToExcel,
  fnExportDataToExcel,
  fnFilterBySector,
  fnFilterData,
  LoadingState,
  NoDataState,
} from "./additional-component";
import TableComparison2GDailyV2 from "./table-comparison-2g-daily-v2";
import { extractCellName } from "../../../_function/helper";
import { TwSmall } from "../../typography/typography";

interface AggCustomProps {
  area?: string;
  apiPath: string;
  aggregateBy?: string; // Add this prop
  filterLabel?: string; // Add this for the filter section label
  displayWpc?: boolean;
  columnNumber?: number;
}

export default function PageAggCustom2GDaily({
  apiPath,
  aggregateBy = "BTS_NAME", // Grouping
  filterLabel = "BTS Level",
  columnNumber = 2,
}: AggCustomProps) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [allCells, setAllCells] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [allSectors, setAllSectors] = useState<string[]>([]);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|");

  const { isPending, error, data, isFetching, refetch, isError } = useQuery({
    queryKey: ["PageAggCustom2GDaily", apiPath, dateRange2, filter, nop, kabupaten, siteId, batch],
    queryFn: async () => {
      if (!shouldFetch) {
        return { rows: [] };
      }
      const response = await fetch(
        `/gefr/api/meas/${apiPath}?batch=${batch}&siteId=${siteId}&nop=${nop}&kabupaten=${kabupaten}&tgl_1=${dateRange2?.split("|")[0]}&tgl_2=${dateRange2?.split("|")[1]}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    if (shouldFetch) {
      refetch();
    }
  }, [shouldFetch, refetch]);

  useEffect(() => {
    if (data?.rows && data.rows.length > 0) {
      const uniqueCells: string[] = Array.from(
        new Set(
          data.rows.map((item: Agg2gModel) =>
            aggregateBy.includes("BTS")
              ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
              : String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"),
          ),
        ),
      ).sort() as string[];

      setAllCells(uniqueCells);
      setSelectedCells(uniqueCells);

      // Extract unique sectors from cells (rightmost character)
      const uniqueSectors: string[] = Array.from(
        new Set(uniqueCells.map((cellName) => cellName.slice(-1))),
      ).sort() as string[];

      setAllSectors(uniqueSectors);
      setSelectedSectors(uniqueSectors);
    } else {
      setAllCells([]);
      setSelectedCells([]);
      setAllSectors([]);
      setSelectedSectors([]);
    }
  }, [data, aggregateBy]);

  const handleCellSelection = (cellName: string) => {
    setSelectedCells((prev) => {
      if (prev.includes(cellName)) {
        return prev.filter((cell) => cell !== cellName);
      }
      return [...prev, cellName];
    });
  };

  const handleSectorSelection = (sector: string) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        return prev.filter((s) => s !== sector);
      }
      return [...prev, sector];
    });
  };

  const selectAllCells = () => {
    setSelectedCells([...allCells]);
  };

  const clearAllCells = () => {
    setSelectedCells([]);
  };

  const selectAllSectors = () => {
    setSelectedSectors([...allSectors]);
  };

  const clearAllSectors = () => {
    setSelectedSectors([]);
  };

  const filterDataBySelectedCells = (data: Agg2gModel[]) => {
    if (!data || selectedCells.length === 0) return [];

    return data.filter((item) => {
      const cellName = aggregateBy.includes("BTS")
        ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
        : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
      return selectedCells.includes(cellName);
    });
  };

  const _filterDataBySector = (data: Agg2gModel[]) => {
    if (!data || selectedSectors.length === 0) return [];

    return data.filter((item) => {
      const cellName = aggregateBy.includes("BTS")
        ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
        : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
      const sector = cellName.slice(-1); // Get rightmost character (sector)
      return selectedSectors.includes(sector);
    });
  };

  const handleExportAllData = () => {
    if (!data?.rows || data.rows.length === 0) {
      alert("No data available to export.");
      return;
    }

    const filename = `2G_Data__${new Date().toISOString().split("T")[0]}`;
    exportToExcel(data.rows, filename);
  };

  if (isPending) return <LoadingState />;

  if (isError) return <ErrorState message={error.message} />;

  if (!shouldFetch) {
    return <NoDataState message="Please select a date range to view data" />;
  }

  if (!data?.rows || data.rows.length === 0) {
    return <NoDataState message="No data available for the selected criteria" />;
  }

  const updatedData = data.rows.map((item: Agg2gModel) => {
    const baseItem = { ...item };
    return baseItem;
  });

  const filteredData = filterDataBySelectedCells(updatedData);

  console.log(filteredData);

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">{fnExportDataToExcel(handleExportAllData)}</div>

      <div>
        <TwSmall text={filterLabel} />
        {fnFilterData(filterLabel, selectAllCells, allCells, clearAllCells, selectedCells, handleCellSelection)}
      </div>

      <div>
        <TwSmall text={filterLabel} />
        {fnFilterBySector(
          filterLabel,
          selectAllSectors,
          allSectors,
          clearAllSectors,
          selectedSectors,
          handleSectorSelection,
        )}
      </div>

      {isFetching ? (
        <LoadingState />
      ) : filteredData.length === 0 ? (
        <NoDataState
          message={
            selectedCells.length === 0
              ? `Please select at least one ${filterLabel.toLowerCase()}`
              : "No data available for selected cells"
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4">
            <TableComparison2GDailyV2 data={filteredData} />
          </div>
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
              { metric_num: "PACKET_LOSS", metric_denum: "DENUMBY1", title: "Packet Loss (%)" },
              { metric_num: "NUM_TBF_DL_EST", metric_denum: "DENUM_TBF_DL_EST", title: "TBF DL Establishment SR (%)" },
              { metric_num: "NUM_TBF_UL_EST", metric_denum: "DENUM_TBF_UL_EST", title: "User DL Throughput (Kbps)" },
              { metric_num: "NUMBER_SDCCH", metric_denum: "DENUMBY1", title: "Number of SDCCH" },
              { metric_num: "NUMBER_TCH", metric_denum: "DENUMBY1", title: "Number of TCH" },
              { metric_num: "NUMBER_STATIC_PDTCH", metric_denum: "DENUMBY1", title: "Number of Static PDTCH" },
              { metric_num: "NUMBER_DYNAMIC_PDTCH", metric_denum: "DENUMBY1", title: "Number of Dynamic PDTCH" },
              { metric_num: "NUMBER_TRX", metric_denum: "DENUMBY1", title: "Number of TRX" },
              { metric_num: "TCH_HR_TRAFFIC", metric_denum: "DENUMBY1", title: "TCH HR Traffic" },
              { metric_num: "TCH_FR_TRAFFIC", metric_denum: "DENUMBY1", title: "TCH FR Traffic" },
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
              <LineChart2GAggDailyV8
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
