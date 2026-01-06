// components/charts-section.tsx
"use client";

// biome-ignore assist/source/organizeImports: <will fix later>
import LineChart2GAggDailyV8 from "../ui-v2/line-chart-2g-agg-daily-v8";
import type { Agg2gModel } from "@/types/schema";
import { ColumnLayoutToggle } from "./column-layout-toggle";

interface ChartsSectionProps {
  filteredData: Agg2gModel[];
  chartLayout: number;
  setChartLayout: (layout: number) => void;
  aggregateBy: string;
}

const CHART_CONFIGS = [
  { metric_num: "SDCCH_TRAFFIC_ERL", metric_denum: "DENUMBY1", title: "SDCCH Traffic (Erl)" },
  { metric_num: "TCH_TRAFFIC_ERL", metric_denum: "DENUMBY1", title: "TCH Traffic (Erl)" },
  { metric_num: "TOTAL_PAYLOAD_MB", metric_denum: "DENUMBY1", title: "Total Payload (MB)" },
  { metric_num: "NUM_TCH_AVAIL", metric_denum: "DENUM_TCH_AVAIL", title: "TCH Availability (%)" },
  { metric_num: "NUM_SD_BLOCK", metric_denum: "DENUM_SD_BLOCK", title: "SD Blocking (%)" },
  { metric_num: "NUM_TCH_BLOCK", metric_denum: "DENUM_TCH_BLOCK", title: "TCH Blocking (%)" },
  { metric_num: "NUM_PDTCH_CONGESTION", metric_denum: "DENUM_PDTCH_CONGESTION", title: "PDTCH Congestion (%)" },
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
  { metric_num: "NUM_ICM_INTERFERENCE", metric_denum: "DENUM_ICM_INTERFERENCE", title: "ICM Interference (%)" },
  { metric_num: "NUM_DL_EMI", metric_denum: "DENUM_DL_EMI", title: "DL EVQI" },
  { metric_num: "NUM_UL_EMI", metric_denum: "DENUM_UL_EMI", title: "UL EVQI" },
];

export function ChartsSection({ filteredData, chartLayout, setChartLayout, aggregateBy }: ChartsSectionProps) {
  const getGridColumnsClass = () => {
    switch (chartLayout) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "md:grid-cols-2";
      case 3:
        return "md:grid-cols-2 lg:grid-cols-3";
      default:
        return "md:grid-cols-2";
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900 text-lg">Detailed Metrics</h2>
          <ColumnLayoutToggle chartLayout={chartLayout} onLayoutChange={setChartLayout} />
        </div>
        <div className="hidden text-gray-500 text-sm sm:block">{filteredData.length} data points</div>
      </div>

      {/* Chart Grid */}
      <div className={`grid ${getGridColumnsClass()} gap-4`}>
        {CHART_CONFIGS.map((chart) => (
          <div
            key={chart.metric_num}
            className={`rounded-xl border bg-white p-4 shadow-sm ${chartLayout === 1 ? "mx-auto max-w-4xl" : ""}`}
          >
            <LineChart2GAggDailyV8
              data={filteredData}
              metric_num={chart.metric_num}
              metric_denum={chart.metric_denum}
              title={chart.title}
              aggregation_by={aggregateBy}
              isExtractCellName={!!aggregateBy.includes("BTS")}
              isSR100={chart.metric_num === "NUM_TBF_DL_EST"}
            />
          </div>
        ))}
      </div>

      {/* Mobile layout indicator */}
      <div className="mt-4 flex items-center justify-center sm:hidden">
        <div className="text-gray-500 text-xs">
          {chartLayout} column{chartLayout > 1 ? "s" : ""} layout
        </div>
      </div>
    </div>
  );
}
