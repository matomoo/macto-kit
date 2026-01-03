"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import CellDistributionChartByPercentageSdsr from "./chart-cell-distribution-by-percentage-sdsr";
import { useFilterStore } from "@/stores/filterStore";
import { TwSmall } from "../../typography/typography";

interface DistributionData {
  "Begin Time": string;
  "<2%": string;
  "2-5%": string;
  ">5%": string;
  total_records: string;
}

export default function CellDist2gSdsr({ title, level }: { title: string; level: string }) {
  const { dateRange2, filter, siteId, nop, kabupaten } = useFilterStore();
  const timezone = "Asia/Makassar"; // Central Indonesia Time

  // Helper function to format dates for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      // Parse the date string from API (assuming it's in UTC or local time)
      const date = new Date(dateString);
      // Convert to Makassar timezone
      const zonedDate = toZonedTime(date, timezone);
      // Format for display
      return format(zonedDate, "MMM dd, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Fallback to original string
    }
  };

  // Helper function to process API date range for timezone
  const getTimezoneAdjustedDateRange = () => {
    if (!dateRange2) return { start: null, end: null };

    try {
      const [startStr, endStr] = dateRange2.split("|");
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);

      // Convert to Makassar timezone for consistency
      const zonedStart = toZonedTime(startDate, timezone);
      const zonedEnd = toZonedTime(endDate, timezone);

      return {
        start: format(fromZonedTime(zonedStart, timezone), "yyyy-MM-dd"),
        end: format(fromZonedTime(zonedEnd, timezone), "yyyy-MM-dd"),
      };
    } catch (error) {
      console.error("Error processing date range:", error);
      return { start: null, end: null };
    }
  };

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["cell-distribution-2g-sdsr", dateRange2, filter, siteId, nop, kabupaten],
    queryFn: async () => {
      const dateRange = getTimezoneAdjustedDateRange();

      // Build URLSearchParams safely, filtering out null/undefined values
      const params = new URLSearchParams();

      // Add nop parameter if it exists and is not null/empty
      const nopValue = level === "NOP" ? nop : kabupaten;
      if (nopValue) {
        params.append("nop", nopValue);
      }

      // Add kabupaten parameter if it exists and is not null/empty
      const kabupatenValue = level === "NOP" ? nop : kabupaten;
      if (kabupatenValue) {
        params.append("kabupaten", kabupatenValue);
      }

      // Add date parameters if they exist
      if (dateRange.start) {
        params.append("tgl_1", dateRange.start);
      }
      if (dateRange.end) {
        params.append("tgl_2", dateRange.end);
      }

      const response = await fetch(`/api/gefr/cell-distribution/2g-sdsr/?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Process data for chart with timezone formatting
  const processedData = data?.rows
    ? data.rows.map((item: DistributionData) => ({
        ...item,
        formattedDate: formatDateForDisplay(item["Begin Time"]),
      }))
    : [];

  if (isPending) return "Loading ..";
  if (error) return `An error has occurred: ${error.message}`;

  // console.log('Processed data:', processedData);

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      <TwSmall text={title} />
      {isFetching ? (
        <div>Searching data...</div>
      ) : (
        <div className="grid min-h-0 grid-cols-1 gap-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <CellDistributionChartByPercentageSdsr data={processedData} title={title} />
            {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Total Days</h3>
                  <p className="text-2xl font-bold">{processedData.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">Avg &lt;2%</h3>
                  <p className="text-2xl font-bold">
                    {Math.round(processedData.reduce((acc: number, item: DistributionData) =>
                      acc + parseInt(item["<2%"]), 0) / (processedData.length || 1))}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">Avg 2-5%</h3>
                  <p className="text-2xl font-bold">
                    {Math.round(processedData.reduce((acc: number, item: DistributionData) =>
                      acc + parseInt(item["2-5%"]), 0) / (processedData.length || 1))}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800">Avg &gt;5%</h3>
                  <p className="text-2xl font-bold">
                    {Math.round(processedData.reduce((acc: number, item: DistributionData) =>
                      acc + parseInt(item[">5%"]), 0) / (processedData.length || 1))}
                  </p>
                </div>
              </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
