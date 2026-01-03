"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilterStore } from "@/stores/filterStore";
import { parseDateRange } from "../../_function/helper";

export function FilterSite() {
  // Default date range values
  const defaultFrom = subDays(new Date(), 7);
  const defaultTo = subDays(new Date(), 1);
  const defaultRangeString = `${format(defaultFrom, "yyyy-MM-dd")}|${format(defaultTo, "yyyy-MM-dd")}`;
  const router = useRouter();

  // Use Zustand store instead of Nuqs
  const { dateRange2, filter, siteId, setDateRange2, setFilter, setSiteId } = useFilterStore();

  // Parse the date range parameter into a DateRange object

  // Initialize dateRange state from Zustand store or defaults
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (dateRange2) {
      const parsed = parseDateRange(dateRange2);
      if (parsed) return parsed;
    }
    return {
      from: defaultFrom,
      to: defaultTo,
    };
  });

  // Track if we're in the process of selecting a range
  const [isSelecting, setIsSelecting] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Ensure URL is updated on first load with all parameters
  useEffect(() => {
    if (isFirstLoad && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      // Create URL with all default parameters if they're missing
      let shouldUpdateUrl = false;
      const newParams = new URLSearchParams(urlParams);

      if (!urlParams.has("range")) {
        newParams.set("range", defaultRangeString);
        shouldUpdateUrl = true;
      }

      if (!urlParams.has("filter")) {
        newParams.set("filter", "all");
        shouldUpdateUrl = true;
      }

      if (!urlParams.has("siteId")) {
        newParams.set("siteId", "");
        shouldUpdateUrl = true;
      }

      if (shouldUpdateUrl) {
        const newUrl = `${window.location.pathname}?${newParams.toString()}`;
        console.log(newUrl);
        console.log("First load, updating URL to:", newUrl);
        router.replace(newUrl);
      }

      setIsFirstLoad(false);
    }
  }, [isFirstLoad, defaultRangeString, router]);

  // Handler to update dateRange state and Zustand store
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      setDateRange(undefined);
      setIsSelecting(false);
      setDateRange2(null);
      return;
    }

    // If both dates are selected
    if (range.from && range.to) {
      setDateRange(range);
      const rangeString = `${format(range.from, "yyyy-MM-dd")}|${format(range.to, "yyyy-MM-dd")}`;
      setDateRange2(rangeString);
      setIsSelecting(false);
    }
    // If only from date is selected
    else if (range.from && !range.to) {
      setDateRange({ from: range.from, to: undefined });
      setIsSelecting(true);
    }
  };

  // Handler for filter change - update Zustand store
  const handleFilterChange = (value: string) => {
    setFilter(value || null);
  };

  // Handler for Site ID change - update Zustand store
  const handleSiteIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSiteId(value || null);
  };

  // Update dateRange if Zustand store changes externally
  useEffect(() => {
    if (dateRange2) {
      const parsedRange = parseDateRange(dateRange2);
      if (parsedRange) {
        setDateRange(parsedRange);
      }
    }
  }, [dateRange2]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">Date Range</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-70 justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                defaultMonth={dateRange?.from || new Date()}
                numberOfMonths={2}
              />
              {isSelecting && (
                <div className="border-t p-2 text-center text-muted-foreground text-xs">
                  Select end date to complete range selection
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">Site ID</div>
          <Input
            type="search"
            placeholder="Enter Site ID"
            value={siteId || ""}
            onChange={handleSiteIdChange}
            className="w-45"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">Filter By Band</div>
          <Select value={filter ?? undefined} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Band</SelectItem>
              <SelectItem value="dcs">DCS</SelectItem>
              <SelectItem value="gsm">GSM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* <div className="p-4 bg-slate-100 rounded-lg">
        <h3 className="font-semibold mb-2">Current State:</h3>
        <div className="text-sm space-y-1">
          <p><strong>Date Range:</strong> {dateRange2 || "None"}</p>
          <p><strong>Filter:</strong> {siteId || "None"}</p>
          <p><strong>Site ID:</strong> {filter || "None"}</p>
        </div>
      </div> */}
    </div>
  );
}
