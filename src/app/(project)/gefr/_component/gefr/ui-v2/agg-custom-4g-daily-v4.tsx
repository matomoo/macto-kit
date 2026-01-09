"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
// import { useFilterStore } from "@stores/filterStore";
import { useEffect, useState } from "react";
import LineChart4GAggV8 from "./line-chart-4g-agg-daily-v8";
// import { extractCellName } from "@functions/helper";
import type { Agg4gModel } from "@/types/schema";
import {
  ErrorState,
  exportToExcel,
  fnExportDataToExcel,
  fnFilterData,
  LoadingState,
  NoDataState,
} from "../ui-v3/additional-component";
import TableComparison4GDailyV1 from "./table-comparison-4g-daily-v1";
import { useFilterStore } from "@/stores/filterStore";
import { extractCellName } from "../../../_function/helper";
import { TwSmall } from "../../typography/typography";

interface AggCustomProps {
  area?: string;
  apiPath: string;
  aggregateBy?: string;
  filterLabel?: string;
}

export default function PageAggCustom4GDaily({
  apiPath,
  aggregateBy = "CELL_NAME",
  filterLabel = "Cell Name",
}: AggCustomProps) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [allCells, setAllCells] = useState<string[]>([]);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|");

  const { isPending, error, data, isFetching, refetch, isError } = useQuery({
    queryKey: ["PageAggCustom4GDaily", apiPath, dateRange2, filter, siteId, nop, kabupaten, batch],
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
  }, [refetch, shouldFetch]);

  useEffect(() => {
    if (data?.rows && data.rows.length > 0) {
      const uniqueCells: string[] = Array.from(
        new Set(
          data.rows.map((item: Agg4gModel) =>
            aggregateBy.includes("CELL")
              ? extractCellName(String(item[aggregateBy as keyof Agg4gModel] ?? "Unknown"))
              : String(item[aggregateBy as keyof Agg4gModel] ?? "Unknown"),
          ),
        ),
      ).sort() as string[];

      setAllCells(uniqueCells);
      setSelectedCells(uniqueCells);
    } else {
      setAllCells([]);
      setSelectedCells([]);
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

  const selectAllCells = () => {
    setSelectedCells([...allCells]);
  };

  const clearAllCells = () => {
    setSelectedCells([]);
  };

  const filterDataBySelectedCells = (data: Agg4gModel[]) => {
    if (!data || selectedCells.length === 0) return [];

    return data.filter((item) => {
      const cellName = aggregateBy.includes("CELL")
        ? extractCellName(String(item[aggregateBy as keyof Agg4gModel] ?? "Unknown"))
        : String(item[aggregateBy as keyof Agg4gModel] ?? "Unknown");
      return selectedCells.includes(cellName);
    });
  };

  const handleExportAllData = () => {
    if (!data?.rows || data.rows.length === 0) {
      alert("No data available to export.");
      return;
    }

    const filename = `4G_Data__${new Date().toISOString().split("T")[0]}`;
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

  const updatedData = data.rows.map((item: Agg4gModel) => {
    const baseItem = { ...item };
    return baseItem;
  });

  const filteredData = filterDataBySelectedCells(updatedData);

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">{fnExportDataToExcel(handleExportAllData)}</div>

      <div>
        <TwSmall text={filterLabel} />
        {fnFilterData(filterLabel, selectAllCells, allCells, clearAllCells, selectedCells, handleCellSelection)}
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
            <TableComparison4GDailyV1 data={filteredData} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { metric_num: "DL_PAYLOAD_GB", metric_denum: "DENUMBY1", title: "Total Payload (GB)" },
              { metric_num: "TRAFFIC_VOLTE_ERL", metric_denum: "DENUMBY1", title: "VoLTE Traffic (Erl)" },
              { metric_num: "AVG_MAX_NUMBER_RRC_CONNECTION_USER", metric_denum: "DENUMBY1", title: "Max RRC User" },
              { metric_num: "AVAILABILITY_NUM", metric_denum: "AVAILABILITY_DENUM", title: "Availability (%)" },
              {
                metric_num: "RRC_SETUP_SR_NUM",
                metric_denum: "RRC_SETUP_SR_DENUM",
                title: "RRC Setup Success Rate (%)",
              },
              {
                metric_num: "ERAB_SETUP_SR_NUM",
                metric_denum: "ERAB_SETUP_SR_DENUM",
                title: "E-RAB Setup Success Rate (%)",
              },
              { metric_num: "CSSR_NUM", metric_denum: "CSSR_DENUM", title: "Call Setup Success Rate (%)" },
              {
                metric_num: "SERVICE_DROP_RATE_NUM",
                metric_denum: "SERVICE_DROP_RATE_DENUM",
                title: "Service Drop Rate (%)",
              },
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
              { metric_num: "AVG_NI_CARRIER_DBM", metric_denum: "DENUMBY1", title: "AVG NI of Carrier (dBm)" },
              { metric_num: "CSFB_SETUP_SR_NUM", metric_denum: "CSFB_SETUP_SR_DENUM", title: "CSFB Preparation (%)" },
              {
                metric_num: "CSFB_RELEASE_SR_NUM",
                metric_denum: "CSFB_RELEASE_SR_DENUM",
                title: "CSFB Release SR (%)",
              },
              { metric_num: "IFHO_SR_NUM", metric_denum: "IFHO_SR_DENUM", title: "Intra Freq LTE HO (%)" },
              { metric_num: "INTER_FHO_SR_NUM", metric_denum: "INTER_FHO_SR_DENUM", title: "Inter Freq LTE HO (%)" },
              { metric_num: "SRVCC_E2G_SR_NUM", metric_denum: "SRVCC_E2G_SR_DENUM", title: "SRVCC E2G SR (%)" },
              { metric_num: "SRVCC_E2W_SR_NUM", metric_denum: "SRVCC_E2W_SR_DENUM", title: "SRVCC E2W SR (%)" },
            ].map((chart) => (
              <LineChart4GAggV8
                key={chart.metric_num}
                data={filteredData}
                metric_num={chart.metric_num}
                metric_denum={chart.metric_denum}
                title={chart.title}
                aggregation_by={aggregateBy}
                isExtractCellName={aggregateBy.includes("CELL")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
