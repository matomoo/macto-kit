import type { Agg4gModel } from "@/types/schema";

// Loading component
export const LoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <div className="h-8 w-8 animate-spin rounded-full border-blue-500 border-b-2" />
    <span className="ml-2">Loading...</span>
  </div>
);

// No data component
export const NoDataState = ({ message }: { message: string }) => (
  <div className="rounded-lg bg-white py-12 text-center shadow-sm">
    <div className="mb-2 text-gray-400">
      <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <title>No Data Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

// Error component
export const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 py-8 text-center">
    <div className="mb-2 text-red-500">
      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <title>Error Icon</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p className="font-medium text-red-700">Error loading data</p>
    <p className="mt-1 text-red-600 text-sm">{message}</p>
  </div>
);

// Function to export data to Excel
export const exportToExcel = (data: Agg4gModel[], filename: string) => {
  // Import the library dynamically to avoid SSR issues
  import("xlsx")
    .then((XLSX) => {
      // Prepare the data for export
      const exportData = data.map((item) => {
        const row: Record<string, unknown> = {};

        // Add all properties from the item
        Object.keys(item).forEach((key) => {
          const value = item[key as keyof Agg4gModel];
          // Format the key for better readability
          const formattedKey = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");

          row[formattedKey] = value;
        });

        return row;
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    })
    .catch((error) => {
      console.error("Error exporting to Excel:", error);
      alert("Error exporting to Excel. Please try again.");
    });
};

export function fnExportDataToExcel(handleExportAllData: () => void) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-semibold">Export Data</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleExportAllData}
          // disabled={!data?.rows || data.rows.length === 0}
          className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Export Data Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export Data
        </button>
      </div>
    </div>
  );
}

export function fnFilterData(
  filterLabel: string,
  selectAllCells: () => void,
  allCells: string[],
  clearAllCells: () => void,
  selectedCells: string[],
  handleCellSelection: (cellName: string) => void,
) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Filter by {filterLabel}:</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAllCells}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
            disabled={allCells.length === 0}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAllCells}
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-600"
            disabled={allCells.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {allCells.length === 0 ? (
        <NoDataState message={`No ${filterLabel.toLowerCase()}s found`} />
      ) : (
        <>
          <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
            {allCells.map((cellName) => (
              <label key={cellName} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCells.includes(cellName)}
                  onChange={() => handleCellSelection(cellName)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                {cellName}
              </label>
            ))}
          </div>

          {selectedCells.length > 0 && (
            <div className="mt-2 text-gray-600 text-sm">
              Selected: {selectedCells.length} of {allCells.length} {filterLabel.toLowerCase()}s
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function fnFilterBySector(
  filterLabel: string,
  selectAllCells: () => void,
  allCells: string[],
  clearAllCells: () => void,
  selectedCells: string[],
  handleCellSelection: (cellName: string) => void,
) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Filter by {filterLabel}:</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAllCells}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
            disabled={allCells.length === 0}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAllCells}
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-600"
            disabled={allCells.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {allCells.length === 0 ? (
        <NoDataState message={`No ${filterLabel.toLowerCase()}s found`} />
      ) : (
        <>
          <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
            {allCells.map((cellName) => (
              <label key={cellName} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCells.includes(cellName)}
                  onChange={() => handleCellSelection(cellName)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                {cellName}
              </label>
            ))}
          </div>

          {selectedCells.length > 0 && (
            <div className="mt-2 text-gray-600 text-sm">
              Selected: {selectedCells.length} of {allCells.length} {filterLabel.toLowerCase()}s
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function fnFilterByBand(
  filterLabel: string,
  selectAllCells: () => void,
  allCells: string[],
  clearAllCells: () => void,
  selectedCells: string[],
  handleCellSelection: (cellName: string) => void,
) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Filter by {filterLabel}:</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAllCells}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600"
            disabled={allCells.length === 0}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAllCells}
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-600"
            disabled={allCells.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>

      {allCells.length === 0 ? (
        <NoDataState message={`No ${filterLabel.toLowerCase()}s found`} />
      ) : (
        <>
          <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto md:grid-cols-3 lg:grid-cols-4">
            {allCells.map((cellName) => (
              <label key={cellName} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCells.includes(cellName)}
                  onChange={() => handleCellSelection(cellName)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                {cellName}
              </label>
            ))}
          </div>

          {selectedCells.length > 0 && (
            <div className="mt-2 text-gray-600 text-sm">
              Selected: {selectedCells.length} of {allCells.length} {filterLabel.toLowerCase()}s
            </div>
          )}
        </>
      )}
    </div>
  );
}
