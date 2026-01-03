"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format, subDays, parseISO, isValid } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilterStore } from "@/stores/filterStore";
import { Input } from "@/components/ui/input";

// Parse the date range parameter into a DateRange object
const parseDateRange = (rangeString: string | null): DateRange | undefined => {
  if (!rangeString) return undefined;

  const [fromStr, toStr] = rangeString.split("|");
  if (!fromStr || !toStr) return undefined;

  try {
    const fromDate = parseISO(fromStr);
    const toDate = parseISO(toStr);

    if (!isValid(fromDate) || !isValid(toDate)) {
      console.error("Invalid date parsed:", fromStr, toStr);
      return undefined;
    }

    return {
      from: fromDate,
      to: toDate,
    };
  } catch (e) {
    console.error("Error parsing date range:", e);
    return undefined;
  }
};

export function FilterBy_Date_SiteId() {
  // Default date range values
  const defaultFrom = subDays(new Date(), 7);
  const defaultTo = subDays(new Date(), 1);
  const defaultRangeString = `${format(defaultFrom, "yyyy-MM-dd")}|${format(defaultTo, "yyyy-MM-dd")}`;

  // Use Zustand store
  const { dateRange2, siteId, setDateRange2, setSiteId } = useFilterStore();

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

  // Ensure Zustand store is updated with default date range on first load
  useEffect(() => {
    if (isFirstLoad) {
      // If dateRange2 is not set in store, set it with default value
      if (!dateRange2) {
        setDateRange2(defaultRangeString);
        console.log("Setting default date range in store:", defaultRangeString);
      }

      setIsFirstLoad(false);
    }
  }, [isFirstLoad, dateRange2, setDateRange2, defaultRangeString]);

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

  // Handler for NOP change - update Zustand store only
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
    } else {
      setDateRange(undefined);
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
      </div>
    </div>
  );
}
