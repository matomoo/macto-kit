/** biome-ignore-all lint/suspicious/noExplicitAny: <will fix later> */
"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/stores/filterStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import LineChart2GAggDailyV8 from "./line-chart-2g-agg-daily-v8";
import type { Agg2gModel } from "@/types/schema";
import {
  ErrorState,
  exportToExcel,
  fnExportDataToExcel,
  // fnFilterByBand,
  // fnFilterBySector,
  // fnFilterData,
  // LoadingState,
  NoDataState,
} from "./additional-component";
// import TableComparison2GDailyV2 from "./table-comparison-2g-daily-v2";
import { BandIndicator, extractBandFromCellName, extractCellName } from "../../../_function/helper";
import { TwSmall } from "../../typography/typography";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { FixedSizeList } from "react-window";
import {
  Search,
  Filter,
  Download,
  // ChevronUp, ChevronDown,
  X,
  Grid,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import PerformanceSummarySection from "./performance-summary-section";

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
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [allCells, setAllCells] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [allSectors, setAllSectors] = useState<string[]>([]);
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [allBands, setAllBands] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<string>("cell");

  // Search states
  const [cellSearch, setCellSearch] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [bandSearch, setBandSearch] = useState("");

  // UI states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Column layout state
  const [chartLayout, setChartLayout] = useState<number>(columnNumber);

  // Performance Summary section state
  const [isPerformanceSummaryExpanded, setIsPerformanceSummaryExpanded] = useState<boolean>(false);

  const shouldFetch = !!dateRange2 && dateRange2.includes("|");

  const { isPending, error, data, refetch, isError } = useQuery({
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

      const uniqueSectors: string[] = Array.from(
        new Set(uniqueCells.map((cellName) => cellName.slice(-1))),
      ).sort() as string[];

      setAllSectors(uniqueSectors);
      setSelectedSectors(uniqueSectors);

      const uniqueBands: string[] = Array.from(
        new Set(uniqueCells.map((cellName) => extractBandFromCellName(cellName))),
      ).sort() as string[];

      setAllBands(uniqueBands);
      setSelectedBands(uniqueBands);
    } else {
      setAllCells([]);
      setSelectedCells([]);
      setAllSectors([]);
      setSelectedSectors([]);
      setAllBands([]);
      setSelectedBands([]);
    }
  }, [data, aggregateBy]);

  // Filter lists based on search
  // const filteredCells = useMemo(() =>
  //   allCells.filter(cell =>
  //     cell.toLowerCase().includes(cellSearch.toLowerCase())
  //   ),
  //   [allCells, cellSearch]
  // );

  // const filteredSectors = useMemo(() =>
  //   allSectors.filter(sector =>
  //     sector.toLowerCase().includes(sectorSearch.toLowerCase())
  //   ),
  //   [allSectors, sectorSearch]
  // );

  // const filteredBands = useMemo(() =>
  //   allBands.filter(band =>
  //     band.toLowerCase().includes(bandSearch.toLowerCase())
  //   ),
  //   [allBands, bandSearch]
  // );

  // const filteredData = useMemo(() => getFilteredData(), [data, filterBy, selectedCells, selectedSectors, selectedBands, aggregateBy]);

  const filteredCells = useMemo(
    () => allCells.filter((cell) => cell.toLowerCase().includes(cellSearch.toLowerCase())),
    [allCells, cellSearch],
  );

  const filteredSectors = useMemo(
    () => allSectors.filter((sector) => sector.toLowerCase().includes(sectorSearch.toLowerCase())),
    [allSectors, sectorSearch],
  );

  const filteredBands = useMemo(
    () => allBands.filter((band) => band.toLowerCase().includes(bandSearch.toLowerCase())),
    [allBands, bandSearch],
  );

  // Memoized filtered data calculation
  const filteredData = useMemo(() => {
    if (!data?.rows) return [];

    if (filterBy === "cell") {
      if (!data || selectedCells.length === 0) return [];

      return data.rows.filter((item: { [x: string]: any }) => {
        const cellName = aggregateBy.includes("BTS")
          ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
          : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
        return selectedCells.includes(cellName);
      });
    }

    if (filterBy === "sector") {
      if (!data || selectedSectors.length === 0) return [];

      return data.rows.filter((item: { [x: string]: any }) => {
        const cellName = aggregateBy.includes("BTS")
          ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
          : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
        const sector = cellName.slice(-1);
        return selectedSectors.includes(sector);
      });
    }

    if (filterBy === "band") {
      if (!data || selectedBands.length === 0) return [];

      return data.rows.filter((item: { [x: string]: any }) => {
        const cellName = aggregateBy.includes("BTS")
          ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
          : (String(item[aggregateBy as keyof Agg2gModel]) ?? "Unknown");
        const band = extractBandFromCellName(cellName);
        return selectedBands.includes(band);
      });
    }

    return [];
  }, [data, filterBy, selectedCells, selectedSectors, selectedBands, aggregateBy]);

  // Calculate key metrics for summary when collapsed
  const calculateSummaryMetrics = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        productivity: { value: 0, percentage: "0.00%" },
        tchTraffic: { value: 0, percentage: "0.00%" },
        totalPayload: { value: 0, percentage: "0.00%" },
      };
    }

    // Calculate TCH Traffic (average of TCH_TRAFFIC_ERL)
    const tchTrafficSum = filteredData.reduce((sum: number, item: { TCH_TRAFFIC_ERL: any }) => {
      const traffic = Number(item.TCH_TRAFFIC_ERL) || 0;
      return sum + traffic;
    }, 0);
    const avgTchTraffic = filteredData.length > 0 ? tchTrafficSum / filteredData.length : 0;

    // Calculate Total Payload (average of TOTAL_PAYLOAD_MB)
    const payloadSum = filteredData.reduce((sum: number, item: { TOTAL_PAYLOAD_MB: any }) => {
      const payload = Number(item.TOTAL_PAYLOAD_MB) || 0;
      return sum + payload;
    }, 0);
    const avgPayload = filteredData.length > 0 ? payloadSum / filteredData.length : 0;

    // Calculate Productivity (this is an example - adjust based on your business logic)
    // For example: productivity could be (TCH traffic / number of cells) or similar
    const productivity = allCells.length > 0 ? tchTrafficSum / allCells.length : 0;

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
  }, [filteredData, allCells.length]);

  const summaryMetrics = useMemo(() => calculateSummaryMetrics(), [calculateSummaryMetrics]);

  // Get grid columns class based on chartLayout
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

  // Handler functions
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

  const handleBandsSelection = (band: string) => {
    setSelectedBands((prev) => {
      if (prev.includes(band)) {
        return prev.filter((s) => s !== band);
      }
      return [...prev, band];
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

  const selectAllBands = () => {
    setSelectedBands([...allBands]);
  };

  const clearAllBands = () => {
    setSelectedBands([]);
  };

  const handleExportAllData = () => {
    if (!data?.rows || data.rows.length === 0) {
      alert("No data available to export.");
      return;
    }

    const filename = `2G_Data__${new Date().toISOString().split("T")[0]}`;
    exportToExcel(data.rows, filename);
  };

  // Enhanced Filter Components
  // Add useCallback to prevent recreation
  const EnhancedFilterWithSearch = useCallback(
    ({
      title,
      items,
      selectedItems,
      onSelect,
      onSelectAll,
      onClear,
      searchValue,
      onSearchChange,
      placeholder,
    }: any) => (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <TwSmall text={title} />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onSelectAll}
              className="rounded bg-blue-50 px-2 py-1 text-blue-700 text-xs hover:bg-blue-100"
            >
              All
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded bg-gray-50 px-2 py-1 text-gray-700 text-xs hover:bg-gray-100"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder || `Search ${title.toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-2 pr-8 pl-9 text-sm focus:border-blue-500 focus:outline-none"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="-translate-y-1/2 absolute top-1/2 right-2 h-4 w-4 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto rounded border">
          {items.length === 0 ? (
            <div className="p-3 text-center text-gray-500 text-sm">No items found</div>
          ) : (
            items.map((item: string) => (
              <label
                key={item}
                className={`flex cursor-pointer items-center gap-2 border-b px-3 py-2 last:border-b-0 hover:bg-gray-50 ${
                  selectedItems.includes(item) ? "bg-blue-50" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => onSelect(item)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-xs">{item}</span>
                {filterBy === "band" && <BandIndicator band={item} />}
              </label>
            ))
          )}
        </div>
        <div className="text-gray-500 text-xs">
          {selectedItems.length} of {items.length} selected
        </div>
      </div>
    ),
    [filterBy],
  );

  // Summary Dashboard Component
  const SummaryDashboard = () => (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
      <div className="rounded-lg bg-white p-3 shadow-sm">
        <div className="text-gray-500 text-xs">Total Cells</div>
        <div className="font-bold text-xl">{allCells.length}</div>
      </div>

      <div className="rounded-lg bg-white p-3 shadow-sm">
        <div className="text-gray-500 text-xs">Selected Items</div>
        <div className="font-bold text-xl">
          {filterBy === "cell"
            ? selectedCells.length
            : filterBy === "sector"
              ? selectedSectors.length
              : selectedBands.length}
        </div>
      </div>
    </div>
  );

  // Column Layout Toggle Component
  const ColumnLayoutToggle = () => (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-sm">Layout:</span>
      <ToggleGroup
        type="single"
        value={chartLayout.toString()}
        onValueChange={(value) => value && setChartLayout(parseInt(value, 10))}
        className="flex items-center rounded-lg border border-gray-200 bg-white p-1"
      >
        <ToggleGroupItem
          value="1"
          className="h-8 w-8 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
          title="1 Column"
        >
          <span className="flex items-center justify-center">
            <LayoutGrid size={16} />
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="2"
          className="h-8 w-8 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
          title="2 Columns"
        >
          <span className="flex items-center justify-center">
            <Grid size={16} />
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="3"
          className="h-8 w-8 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
          title="3 Columns"
        >
          <span className="flex items-center justify-center">
            <Grid3X3 size={16} />
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="text-gray-500 text-xs">
        {chartLayout} column{chartLayout > 1 ? "s" : ""}
      </div>
    </div>
  );

  // Performance Summary Toggle Component
  // const PerformanceSummaryToggle = () => (
  //   <button
  //     type="button"
  //     onClick={() => setIsPerformanceSummaryExpanded(!isPerformanceSummaryExpanded)}
  //     className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
  //   >
  //     {isPerformanceSummaryExpanded ? (
  //       <>
  //         <ChevronUp size={16} />
  //         <span>Collapse Summary</span>
  //       </>
  //     ) : (
  //       <>
  //         <ChevronDown size={16} />
  //         <span>Expand Summary</span>
  //       </>
  //     )}
  //   </button>
  // );

  // Performance Summary Section Component

  // Enhanced Loading State
  const EnhancedLoadingState = () => (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-10 animate-pulse rounded bg-gray-200" />
          <div className="h-10 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </div>
  );

  if (isPending) return <EnhancedLoadingState />;

  if (isError) return <ErrorState message={error.message} />;

  if (!shouldFetch) {
    return <NoDataState message="Please select a date range to view data" />;
  }

  if (!data?.rows || data.rows.length === 0) {
    return <NoDataState message="No data available for the selected criteria" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b bg-white px-4 py-3 shadow-sm lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-xl">2G Network Performance</h1>
            <p className="text-gray-600 text-sm">Real-time metrics and analysis dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportAllData}
              className="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 lg:flex"
            >
              <Download size={16} />
              Export Data
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 lg:hidden"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="py-4 lg:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left sidebar - Filters (Desktop) */}
          <div className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Summary Dashboard */}
              <SummaryDashboard />

              {/* Filter Panel */}
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Filter size={16} className="text-gray-600" />
                    <TwSmall text="Filter View By" />
                  </div>
                  <ToggleGroup
                    type="single"
                    value={filterBy}
                    onValueChange={setFilterBy}
                    className="flex *:data-[slot=toggle-group-item]:flex-1 *:data-[slot=toggle-group-item]:py-2"
                  >
                    <ToggleGroupItem
                      value="cell"
                      className="data-[state=on]:border-blue-200 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
                    >
                      <span className="font-medium text-sm">Cell</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="sector"
                      className="data-[state=on]:border-blue-200 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
                    >
                      <span className="font-medium text-sm">Sector</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="band"
                      className="data-[state=on]:border-blue-200 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
                    >
                      <span className="font-medium text-sm">Band</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Dynamic Filter Content */}
                {filterBy === "cell" && (
                  <EnhancedFilterWithSearch
                    title={`Select ${filterLabel}`}
                    items={filteredCells}
                    selectedItems={selectedCells}
                    onSelect={handleCellSelection}
                    onSelectAll={selectAllCells}
                    onClear={clearAllCells}
                    searchValue={cellSearch}
                    onSearchChange={setCellSearch}
                    placeholder={`Search ${filterLabel.toLowerCase()}...`}
                  />
                )}

                {filterBy === "sector" && (
                  <EnhancedFilterWithSearch
                    title="Select Sector"
                    items={filteredSectors}
                    selectedItems={selectedSectors}
                    onSelect={handleSectorSelection}
                    onSelectAll={selectAllSectors}
                    onClear={clearAllSectors}
                    searchValue={sectorSearch}
                    onSearchChange={setSectorSearch}
                    placeholder="Search sectors..."
                  />
                )}

                {filterBy === "band" && (
                  <EnhancedFilterWithSearch
                    title="Select Band"
                    items={filteredBands}
                    selectedItems={selectedBands}
                    onSelect={handleBandsSelection}
                    onSelectAll={selectAllBands}
                    onClear={clearAllBands}
                    searchValue={bandSearch}
                    onSearchChange={setBandSearch}
                    placeholder="Search bands..."
                  />
                )}

                {/* Export Button in Sidebar */}
                <div className="mt-4 border-t pt-4">{fnExportDataToExcel(handleExportAllData)}</div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsMobileFilterOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsMobileFilterOpen(false);
                  }
                }}
                aria-label="Close filters"
              />
              <div className="absolute top-0 right-0 h-full w-80 overflow-y-auto bg-white p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Filter Content */}
                <div className="space-y-4">
                  <SummaryDashboard />

                  <div>
                    <TwSmall text="Filter View By" />
                    <ToggleGroup
                      type="single"
                      value={filterBy}
                      onValueChange={setFilterBy}
                      className="mt-2 flex *:data-[slot=toggle-group-item]:flex-1 *:data-[slot=toggle-group-item]:py-2"
                    >
                      <ToggleGroupItem value="cell">Cell</ToggleGroupItem>
                      <ToggleGroupItem value="sector">Sector</ToggleGroupItem>
                      <ToggleGroupItem value="band">Band</ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {filterBy === "cell" && (
                    <EnhancedFilterWithSearch
                      title={`Select ${filterLabel}`}
                      items={filteredCells}
                      selectedItems={selectedCells}
                      onSelect={handleCellSelection}
                      onSelectAll={selectAllCells}
                      onClear={clearAllCells}
                      searchValue={cellSearch}
                      onSearchChange={setCellSearch}
                    />
                  )}

                  {filterBy === "sector" && (
                    <EnhancedFilterWithSearch
                      title="Select Sector"
                      items={filteredSectors}
                      selectedItems={selectedSectors}
                      onSelect={handleSectorSelection}
                      onSelectAll={selectAllSectors}
                      onClear={clearAllSectors}
                      searchValue={sectorSearch}
                      onSearchChange={setSectorSearch}
                    />
                  )}

                  {filterBy === "band" && (
                    <EnhancedFilterWithSearch
                      title="Select Band"
                      items={filteredBands}
                      selectedItems={selectedBands}
                      onSelect={handleBandsSelection}
                      onSelectAll={selectAllBands}
                      onClear={clearAllBands}
                      searchValue={bandSearch}
                      onSearchChange={setBandSearch}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="lg:col-span-9">
            {/* Mobile Summary Dashboard */}
            <div className="mb-4 lg:hidden">
              <SummaryDashboard />
            </div>

            {/* Error/Empty States */}
            {filterBy === "cell" && selectedCells.length === 0 && (
              <NoDataState message={`Please select at least one ${filterLabel.toLowerCase()}`} />
            )}

            {filterBy === "sector" && selectedSectors.length === 0 && (
              <NoDataState message="Please select at least one sector" />
            )}

            {/* Main Content when filters are valid */}
            {(filterBy === "band" ||
              (filterBy === "cell" && selectedCells.length > 0) ||
              (filterBy === "sector" && selectedSectors.length > 0)) && (
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
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="font-semibold text-gray-900 text-lg">Detailed Metrics</h2>
                      <ColumnLayoutToggle />
                    </div>
                    <div className="hidden text-gray-500 text-sm sm:block">{filteredData.length} data points</div>
                  </div>

                  {/* Chart Grid */}
                  <div className={`grid ${getGridColumnsClass()} gap-4`}>
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
                      {
                        metric_num: "NUM_SDCCH_AVAIL",
                        metric_denum: "DENUM_SDCCH_AVAIL",
                        title: "SDCCH Availability (%)",
                      },
                      { metric_num: "NUM_SDSR", metric_denum: "DENUM_SDSR", title: "SDSR (%)" },
                      { metric_num: "NUM_TCH_DROP", metric_denum: "DENUM_TCH_DROP", title: "TCH Drop Rate (%)" },
                      { metric_num: "NUM_HOSR", metric_denum: "DENUM_HOSR", title: "HOSR (%)" },
                      { metric_num: "PACKET_LOSS", metric_denum: "DENUMBY1", title: "Packet Loss (%)" },
                      {
                        metric_num: "NUM_TBF_DL_EST",
                        metric_denum: "DENUM_TBF_DL_EST",
                        title: "TBF DL Establishment SR (%)",
                      },
                      {
                        metric_num: "NUM_TBF_UL_EST",
                        metric_denum: "DENUM_TBF_UL_EST",
                        title: "User DL Throughput (Kbps)",
                      },
                      { metric_num: "NUMBER_SDCCH", metric_denum: "DENUMBY1", title: "Number of SDCCH" },
                      { metric_num: "NUMBER_TCH", metric_denum: "DENUMBY1", title: "Number of TCH" },
                      { metric_num: "NUMBER_STATIC_PDTCH", metric_denum: "DENUMBY1", title: "Number of Static PDTCH" },
                      {
                        metric_num: "NUMBER_DYNAMIC_PDTCH",
                        metric_denum: "DENUMBY1",
                        title: "Number of Dynamic PDTCH",
                      },
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
                      <div
                        key={chart.metric_num}
                        className={`rounded-xl border bg-white p-4 shadow-sm ${
                          chartLayout === 1 ? "mx-auto max-w-4xl" : ""
                        }`}
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed right-4 bottom-4 z-20 lg:hidden">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleExportAllData}
            className="flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
            title="Export all data"
          >
            <Download size={20} />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center justify-center rounded-full bg-white p-4 text-gray-700 shadow-lg hover:bg-gray-50"
            title="Toggle filters"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
