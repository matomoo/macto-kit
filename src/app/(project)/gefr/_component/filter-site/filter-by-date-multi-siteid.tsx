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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilterStore } from "@/stores/filterStore";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Make sure to import shadcn Badge
import { X } from "lucide-react"; // Import X icon for badge removal
import { parseDateRange } from "../../_function/helper";

export function FilterBy_Date_Multi_SiteId() {
  // Default date range values
  const defaultFrom = subDays(new Date(), 7);
  const defaultTo = subDays(new Date(), 1);
  const defaultRangeString = `${format(defaultFrom, "yyyy-MM-dd")}|${format(defaultTo, "yyyy-MM-dd")}`;

  // Use Zustand store
  const { dateRange2, siteId, setDateRange2, setSiteId } = useFilterStore();

  // State for badge items and input
  const [siteIdInput, setSiteIdInput] = useState("");
  const [siteIdBadges, setSiteIdBadges] = useState<string[]>([]);

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

  // Initialize siteIdBadges from store on first load
  useEffect(() => {
    if (siteId) {
      // Parse existing siteId from store (could be comma-separated)
      const existingSiteIds = siteId
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      setSiteIdBadges(existingSiteIds);
    }
  }, [siteId]);

  // Update store when siteIdBadges changes
  useEffect(() => {
    if (siteIdBadges.length > 0) {
      const siteIdString = siteIdBadges.join(",");
      setSiteId(siteIdString);
    } else {
      setSiteId(null);
    }
  }, [siteIdBadges, setSiteId]);

  // Function to handle input changes and process pasted content
  const handleSiteIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSiteIdInput(value);

    // If there are line breaks or tabs (typical from Excel), process them
    if (value.includes("\n") || value.includes("\t") || value.includes(",")) {
      processSiteIds(value);
    }
  };

  // Function to process and extract Site IDs from pasted content
  const processSiteIds = (input: string) => {
    // Split by common delimiters: new lines, tabs, commas, spaces
    const siteIds = input
      .split(/[\n\t, ]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0); // Remove empty strings

    if (siteIds.length > 0) {
      setSiteIdBadges((prev) => {
        // Combine existing with new, remove duplicates
        const combined = [...prev, ...siteIds];
        return Array.from(new Set(combined));
      });
      setSiteIdInput(""); // Clear input after processing
    }
  };

  // Function to handle manual addition (Enter key or blur)
  const handleAddSiteId = () => {
    if (siteIdInput.trim()) {
      const newIds = siteIdInput
        .trim()
        .split(/[\n\t, ]+/)
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      if (newIds.length > 0) {
        setSiteIdBadges((prev) => {
          const combined = [...prev, ...newIds];
          return Array.from(new Set(combined));
        });
        setSiteIdInput("");
      }
    }
  };

  // Function to remove a Site ID badge
  const removeSiteId = (siteIdToRemove: string) => {
    setSiteIdBadges((prev) => prev.filter((id) => id !== siteIdToRemove));
  };

  // Function to clear all Site ID badges
  const clearAllSiteIds = () => {
    setSiteIdBadges([]);
    setSiteIdInput("");
  };

  // Handle Enter key press in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSiteId();
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    handleAddSiteId();
  };

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
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm">Site IDs</div>
            {siteIdBadges.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSiteIds}
                className="h-6 px-2 text-muted-foreground text-xs hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {/* Badges Display */}
            {siteIdBadges.length > 0 && (
              <div className="flex min-h-10 max-w-70 flex-wrap gap-1 rounded-md border bg-gray-50 p-2">
                {siteIdBadges.map((siteIdItem) => (
                  <Badge
                    key={siteIdItem}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 pr-1 pl-2 text-xs"
                  >
                    {siteIdItem}
                    <button
                      type="button"
                      onClick={() => removeSiteId(siteIdItem)}
                      className="ml-0.5 rounded-full p-0.5 hover:text-destructive focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Input */}
            <Input
              type="search"
              placeholder="Paste Site IDs from Excel"
              value={siteIdInput}
              onChange={handleSiteIdInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              className="w-70"
            />
          </div>

          <p className="max-w-70 text-muted-foreground text-xs">
            Paste multiple Site IDs separated by tabs, new lines, or commas
          </p>
        </div>
      </div>
    </div>
  );
}
