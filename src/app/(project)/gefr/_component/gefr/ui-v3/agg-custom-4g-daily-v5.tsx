"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorState, exportToExcel, NoDataState } from "./additional-component";
import { useFilterStore } from "@/stores/filterStore";
import { Header } from "./header";
import { MobileFloatingButtons } from "./mobile-floating-buttons";
import FilterSidebar4G, { SummaryDashboard } from "./filter-sidebar-4g";
import { useDataManagement4G } from "../../../_hooks/use-data-management-4g";
import { useDataFiltering4G } from "../../../_hooks/use-data-filtering-4g";
import PerformanceSummarySection4G from "./performance-summary-section-4g";
import { ChartsSection4G } from "./charts-section-4g";
import { EnhancedLoadingState } from "./enhanced-loading-state";
import { useSummaryMetrics4G } from "../../../_hooks/use-summary-metrics-4g";

interface AggCustomProps {
  area?: string;
  apiPath: string;
  aggregateBy?: string;
  filterLabel?: string;
  columnNumber?: number;
}

export default function PageAggCustom4GDaily({
  apiPath,
  aggregateBy = "CELL_NAME",
  filterLabel = "Cell Name",
  columnNumber = 2,
}: AggCustomProps) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<string>("cell");
  const [isPerformanceSummaryExpanded, setIsPerformanceSummaryExpanded] = useState<boolean>(false);
  const [chartLayout, setChartLayout] = useState<number>(columnNumber);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|") && siteId?.length === 6;

  const { isPending, error, data, isError } = useQuery({
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

  const dataManagement = useDataManagement4G({ data, aggregateBy });
  const { filteredData } = useDataFiltering4G({
    data,
    filterBy,
    selectedCells: dataManagement.selectedCells,
    selectedSectors: dataManagement.selectedSectors,
    selectedBands: dataManagement.selectedBands,
    aggregateBy,
  });

  const { summaryMetrics } = useSummaryMetrics4G({
    filteredData,
    allCellsCount: dataManagement.allCells.length,
  });

  const handleExportAllData = () => {
    if (!data?.rows || data.rows.length === 0) {
      alert("No data available to export.");
      return;
    }

    const filename = `4G_Data__${new Date().toISOString().split("T")[0]}`;
    exportToExcel(data.rows, filename);
  };

  if (isPending) return <EnhancedLoadingState />;
  if (isError) return <ErrorState message={error.message} />;
  if (!shouldFetch) return <NoDataState message="Please select a date range to view data" />;
  if (!data?.rows || data.rows.length === 0) {
    return <NoDataState message="No data available for the selected criteria" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onExportData={handleExportAllData}
        onToggleMobileFilters={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        title="4G Network Performance"
        subtitle="Real-time metrics and analysis dashboard"
      />

      <div className="py-4 lg:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left sidebar - Filters */}
          <FilterSidebar4G
            // Summary data
            allCells={dataManagement.allCells}
            filterBy={filterBy}
            selectedCells={dataManagement.selectedCells}
            selectedSectors={dataManagement.selectedSectors}
            selectedBands={dataManagement.selectedBands}
            // Filter data
            filteredCells={dataManagement.filteredCells}
            filteredSectors={dataManagement.filteredSectors}
            filteredBands={dataManagement.filteredBands}
            // Search states
            cellSearch={dataManagement.cellSearch}
            sectorSearch={dataManagement.sectorSearch}
            bandSearch={dataManagement.bandSearch}
            // Handlers
            onFilterByChange={setFilterBy}
            onCellSearchChange={dataManagement.setCellSearch}
            onSectorSearchChange={dataManagement.setSectorSearch}
            onBandSearchChange={dataManagement.setBandSearch}
            onCellSelection={dataManagement.handleCellSelection}
            onSectorSelection={dataManagement.handleSectorSelection}
            onBandSelection={dataManagement.handleBandsSelection}
            onSelectAllCells={dataManagement.selectAllCells}
            onClearAllCells={dataManagement.clearAllCells}
            onSelectAllSectors={dataManagement.selectAllSectors}
            onClearAllSectors={dataManagement.clearAllSectors}
            onSelectAllBands={dataManagement.selectAllBands}
            onClearAllBands={dataManagement.clearAllBands}
            onExportData={handleExportAllData}
            // Configuration
            filterLabel={filterLabel}
            // Mobile overlay props
            isMobileFilterOpen={isMobileFilterOpen}
            onMobileFilterClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Main content */}
          <div className="lg:col-span-9">
            {/* Mobile Summary Dashboard */}
            <div className="mb-4 lg:hidden">
              <SummaryDashboard
                allCells={dataManagement.allCells}
                filterBy={filterBy}
                selectedCells={dataManagement.selectedCells}
                selectedSectors={dataManagement.selectedSectors}
                selectedBands={dataManagement.selectedBands}
              />
            </div>

            {/* Error/Empty States */}
            {filterBy === "cell" && dataManagement.selectedCells.length === 0 && (
              <NoDataState message={`Please select at least one ${filterLabel.toLowerCase()}`} />
            )}

            {filterBy === "sector" && dataManagement.selectedSectors.length === 0 && (
              <NoDataState message="Please select at least one sector" />
            )}

            {/* Main Content when filters are valid */}
            {(filterBy === "band" ||
              (filterBy === "cell" && dataManagement.selectedCells.length > 0) ||
              (filterBy === "sector" && dataManagement.selectedSectors.length > 0)) && (
              <>
                {/* Performance Summary Section */}
                <PerformanceSummarySection4G
                  metrics={summaryMetrics}
                  filteredData={filteredData}
                  filterBy={filterBy}
                  isExpanded={isPerformanceSummaryExpanded}
                  onToggle={() => setIsPerformanceSummaryExpanded(!isPerformanceSummaryExpanded)}
                />

                {/* Charts Section */}
                <ChartsSection4G
                  filteredData={filteredData}
                  chartLayout={chartLayout}
                  setChartLayout={setChartLayout}
                  aggregateBy={aggregateBy}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <MobileFloatingButtons
        onExportData={handleExportAllData}
        onToggleMobileFilters={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
      />

      {/* <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
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
              <TableComparison2G4GDaily data={filteredData} tech="4G" />
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
      </div> */}
    </div>
  );
}
