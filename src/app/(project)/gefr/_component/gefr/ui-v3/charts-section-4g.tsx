// components/charts-section.tsx
"use client";

// biome-ignore assist/source/organizeImports: <will fix later>
import type { Data2G4GModel } from "@/types/schema";
import { ColumnLayoutToggle } from "./column-layout-toggle";
import LineChart4GAggDaily from "./line-chart-4g-agg-daily-v9";

interface ChartsSectionProps {
  filteredData: Data2G4GModel[];
  chartLayout: number;
  setChartLayout: (layout: number) => void;
  aggregateBy: string;
}

const CHART_CONFIGS = [
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
];

export function ChartsSection4G({ filteredData, chartLayout, setChartLayout, aggregateBy }: ChartsSectionProps) {
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
            <LineChart4GAggDaily
              key={chart.metric_num}
              data={filteredData}
              metric_num={chart.metric_num}
              metric_denum={chart.metric_denum}
              title={chart.title}
              aggregation_by={aggregateBy}
              isExtractCellName={!!aggregateBy.includes("CELL")}
              // isSR100={chart.metric_num === "NUM_TBF_DL_EST"}
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
