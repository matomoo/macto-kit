/** biome-ignore-all lint/suspicious/noExplicitAny: <will fix later> */
"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/stores/filterStore";
import { useState } from "react";
import { ErrorState, exportToExcel, NoDataState } from "./additional-component";
import PerformanceSummarySection from "./performance-summary-section";
import FilterSidebar, { SummaryDashboard } from "./filter-sidebar";
import { EnhancedLoadingState } from "./enhanced-loading-state";
import { ChartsSection } from "./charts-section";
import { Header } from "./header";
import { MobileFloatingButtons } from "./mobile-floating-buttons";
import { useDataManagement } from "../../../_hooks/use-data-management";
import { useDataFiltering } from "../../../_hooks/use-data-filtering";
import { useSummaryMetrics } from "../../../_hooks/use-summary-metrics";

interface AggCustomProps {
  area?: string;
  apiPath: string;
  aggregateBy?: string;
  filterLabel?: string;
  displayWpc?: boolean;
  columnNumber?: number;
}

export default function PageAggCustom2GDaily({
  apiPath,
  aggregateBy = "BTS_NAME",
  filterLabel = "BTS Level",
  columnNumber = 2,
}: AggCustomProps) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();

  // UI states
  const [filterBy, setFilterBy] = useState<string>("cell");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [chartLayout, setChartLayout] = useState<number>(columnNumber);
  const [isPerformanceSummaryExpanded, setIsPerformanceSummaryExpanded] = useState<boolean>(false);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|");

  const { isPending, error, data, isError } = useQuery({
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

  // Custom hooks for data management
  const dataManagement = useDataManagement({ data, aggregateBy });
  const { filteredData } = useDataFiltering({
    data,
    filterBy,
    selectedCells: dataManagement.selectedCells,
    selectedSectors: dataManagement.selectedSectors,
    selectedBands: dataManagement.selectedBands,
    aggregateBy,
  });
  const { summaryMetrics } = useSummaryMetrics({
    filteredData,
    allCellsCount: dataManagement.allCells.length,
  });

  const handleExportAllData = () => {
    if (!data?.rows || data.rows.length === 0) {
      alert("No data available to export.");
      return;
    }

    const filename = `2G_Data__${new Date().toISOString().split("T")[0]}`;
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
      />

      <div className="py-4 lg:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left sidebar - Filters */}
          <FilterSidebar
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
                <PerformanceSummarySection
                  metrics={summaryMetrics}
                  filteredData={filteredData}
                  filterBy={filterBy}
                  isExpanded={isPerformanceSummaryExpanded}
                  onToggle={() => setIsPerformanceSummaryExpanded(!isPerformanceSummaryExpanded)}
                />

                {/* Charts Section */}
                <ChartsSection
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
    </div>
  );
}
