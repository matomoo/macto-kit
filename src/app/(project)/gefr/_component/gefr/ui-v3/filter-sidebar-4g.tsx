"use client";

// biome-ignore assist/source/organizeImports: <will fix later>
import { Search, Filter, X } from "lucide-react";
import { TwSmall } from "../../typography/typography";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BandIndicator } from "../../../_function/helper";

interface FilterSidebarProps {
  // Summary data
  allCells: string[];
  filterBy: string;
  selectedCells: string[];
  selectedSectors: string[];
  selectedBands: string[];

  // Filter data
  filteredCells: string[];
  filteredSectors: string[];
  filteredBands: string[];

  // Search states
  cellSearch: string;
  sectorSearch: string;
  bandSearch: string;

  // Handlers
  onFilterByChange: (value: string) => void;
  onCellSearchChange: (value: string) => void;
  onSectorSearchChange: (value: string) => void;
  onBandSearchChange: (value: string) => void;
  onCellSelection: (cellName: string) => void;
  onSectorSelection: (sector: string) => void;
  onBandSelection: (band: string) => void;
  onSelectAllCells: () => void;
  onClearAllCells: () => void;
  onSelectAllSectors: () => void;
  onClearAllSectors: () => void;
  onSelectAllBands: () => void;
  onClearAllBands: () => void;
  onExportData: () => void;

  // Configuration
  filterLabel: string;

  // Mobile overlay props
  isMobileFilterOpen?: boolean;
  onMobileFilterClose?: () => void;
}

export function SummaryDashboard({
  allCells,
  filterBy,
  selectedCells,
  selectedSectors,
  selectedBands,
}: {
  allCells: string[];
  filterBy: string;
  selectedCells: string[];
  selectedSectors: string[];
  selectedBands: string[];
}) {
  return (
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
}

interface EnhancedFilterWithSearchProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onSelect: (item: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filterBy: string;
}

export function EnhancedFilterWithSearch({
  title,
  items,
  selectedItems,
  onSelect,
  onSelectAll,
  onClear,
  searchValue,
  onSearchChange,
  placeholder,
  filterBy,
}: EnhancedFilterWithSearchProps) {
  return (
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
  );
}

export function FilterSidebar4G({
  allCells,
  filterBy,
  selectedCells,
  selectedSectors,
  selectedBands,
  filteredCells,
  filteredSectors,
  filteredBands,
  cellSearch,
  sectorSearch,
  bandSearch,
  onFilterByChange,
  onCellSearchChange,
  onSectorSearchChange,
  onBandSearchChange,
  onCellSelection,
  onSectorSelection,
  onBandSelection,
  onSelectAllCells,
  onClearAllCells,
  onSelectAllSectors,
  onClearAllSectors,
  onSelectAllBands,
  onClearAllBands,
  // onExportData,
  filterLabel,
  isMobileFilterOpen,
  onMobileFilterClose,
}: FilterSidebarProps) {
  const FilterPanelContent = () => (
    <>
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <Filter size={16} className="text-gray-600" />
          <TwSmall text="Filter View By" />
        </div>
        <ToggleGroup
          type="single"
          value={filterBy}
          onValueChange={onFilterByChange}
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
          onSelect={onCellSelection}
          onSelectAll={onSelectAllCells}
          onClear={onClearAllCells}
          searchValue={cellSearch}
          onSearchChange={onCellSearchChange}
          placeholder={`Search ${filterLabel.toLowerCase()}...`}
          filterBy={filterBy}
        />
      )}

      {filterBy === "sector" && (
        <EnhancedFilterWithSearch
          title="Select Sector"
          items={filteredSectors}
          selectedItems={selectedSectors}
          onSelect={onSectorSelection}
          onSelectAll={onSelectAllSectors}
          onClear={onClearAllSectors}
          searchValue={sectorSearch}
          onSearchChange={onSectorSearchChange}
          placeholder="Search sectors..."
          filterBy={filterBy}
        />
      )}

      {filterBy === "band" && (
        <EnhancedFilterWithSearch
          title="Select Band"
          items={filteredBands}
          selectedItems={selectedBands}
          onSelect={onBandSelection}
          onSelectAll={onSelectAllBands}
          onClear={onClearAllBands}
          searchValue={bandSearch}
          onSearchChange={onBandSearchChange}
          placeholder="Search bands..."
          filterBy={filterBy}
        />
      )}

      {/* Export Button in Sidebar */}
      {/* <div className="mt-4 border-t pt-4">{fnExportDataToExcel(onExportData)}</div> */}
    </>
  );

  // Desktop sidebar
  return (
    <>
      <div className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-20 space-y-4">
          <SummaryDashboard
            allCells={allCells}
            filterBy={filterBy}
            selectedCells={selectedCells}
            selectedSectors={selectedSectors}
            selectedBands={selectedBands}
          />

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <FilterPanelContent />
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && onMobileFilterClose && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={onMobileFilterClose}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onMobileFilterClose();
              }
            }}
            aria-label="Close filters"
          />
          <div className="absolute top-0 right-0 h-full w-80 overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button type="button" onClick={onMobileFilterClose} className="rounded-full p-1 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filter Content */}
            <div className="space-y-4">
              <SummaryDashboard
                allCells={allCells}
                filterBy={filterBy}
                selectedCells={selectedCells}
                selectedSectors={selectedSectors}
                selectedBands={selectedBands}
              />

              <div>
                <TwSmall text="Filter View By" />
                <ToggleGroup
                  type="single"
                  value={filterBy}
                  onValueChange={onFilterByChange}
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
                  onSelect={onCellSelection}
                  onSelectAll={onSelectAllCells}
                  onClear={onClearAllCells}
                  searchValue={cellSearch}
                  onSearchChange={onCellSearchChange}
                  filterBy={filterBy}
                />
              )}

              {filterBy === "sector" && (
                <EnhancedFilterWithSearch
                  title="Select Sector"
                  items={filteredSectors}
                  selectedItems={selectedSectors}
                  onSelect={onSectorSelection}
                  onSelectAll={onSelectAllSectors}
                  onClear={onClearAllSectors}
                  searchValue={sectorSearch}
                  onSearchChange={onSectorSearchChange}
                  filterBy={filterBy}
                />
              )}

              {filterBy === "band" && (
                <EnhancedFilterWithSearch
                  title="Select Band"
                  items={filteredBands}
                  selectedItems={selectedBands}
                  onSelect={onBandSelection}
                  onSelectAll={onSelectAllBands}
                  onClear={onClearAllBands}
                  searchValue={bandSearch}
                  onSearchChange={onBandSearchChange}
                  filterBy={filterBy}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Default export for convenience
export default FilterSidebar4G;
