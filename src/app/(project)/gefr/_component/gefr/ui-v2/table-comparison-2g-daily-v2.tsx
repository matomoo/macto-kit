"use client";

// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg2gModel } from "@/types/schema";
import React, { useState, useMemo, useCallback } from "react";
import { subDays, format, startOfDay, endOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { calculateSuccessRate0, calculateSuccessRate100 } from "../../../_function/helper";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MetricCalculator {
  name: string;
  calculate: (data: Agg2gModel[]) => number;
  format?: (value: number) => string;
}

interface ComparisonResult {
  metric: string;
  before: number;
  after: number;
  delta: number;
  growth: number;
}

const TableComparison2GDailyV2: React.FC<{ data: Agg2gModel[] }> = ({ data }) => {
  const timezone = "Asia/Makassar"; // Central Indonesia Time

  // Helper function to create dates in the correct timezone
  const createDateInTimezone = (date: Date) => {
    const zonedDate = toZonedTime(date, timezone);
    return fromZonedTime(zonedDate, timezone);
  };

  const [afterRange, setAfterRange] = useState<DateRange>({
    startDate: createDateInTimezone(subDays(new Date(), 4)).toISOString(),
    endDate: createDateInTimezone(subDays(new Date(), 1)).toISOString(),
  });

  const [beforeRange, setBeforeRange] = useState<DateRange>({
    startDate: createDateInTimezone(subDays(new Date(), 11)).toISOString(),
    endDate: createDateInTimezone(subDays(new Date(), 8)).toISOString(),
  });

  // Metric configuration - easy to add new metrics
  const metricCalculators = useMemo<MetricCalculator[]>(
    () => [
      {
        name: "SDSR (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDSR || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDSR || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "TCH Block (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_BLOCK || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_BLOCK || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "SDCCH Block (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SD_BLOCK || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SD_BLOCK || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "SDCCH Drop Rate (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDCCH_DROP || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDCCH_DROP || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "TBF DL Establish (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_DL_EST || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_DL_EST || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "TBF UL Establish (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_UL_EST || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_UL_EST || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "TCH Drop (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_DROP || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_DROP || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "TBF Completion SR (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TBF_COMP || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TBF_COMP || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "EDGE DL Throughput (Kbps)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.EDGE_THP_KB || 0), 0),
      },
      {
        name: "GPRS DL Throughput (kbps)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.GPRS_THP_KB || 0), 0),
      },
      {
        name: "HOSR (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_HOSR || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_HOSR || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "TCH Availability (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_TCH_AVAIL || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_TCH_AVAIL || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "SDCCH Availability (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_SDCCH_AVAIL || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_SDCCH_AVAIL || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "SDCCH Traffic (Erl)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.SDCCH_TRAFFIC_ERL || 0), 0),
      },
      {
        name: "TCH Traffic (Erl)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TCH_TRAFFIC_ERL || 0), 0),
      },
      {
        name: "Payload EDGE (MB)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.EDGE_PAYLOAD_MB || 0), 0),
      },
      {
        name: "Payload GPRS (MB)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.GPRS_PAYLOAD_MB || 0), 0),
      },
      {
        name: "Total Payload (MB)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TOTAL_PAYLOAD_MB || 0), 0),
      },
      {
        name: "DL_RX_Qual_0_5",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_DL_QUAL_05 || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_DL_QUAL_05 || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "UL_RX_Qual_0_5",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_UL_QUAL_05 || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_UL_QUAL_05 || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "IB Band 1-3",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_IB_BAND_1_3 || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_IB_BAND_1_3 || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "IB Band 4-5",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_IB_BAND_4_5 || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_IB_BAND_4_5 || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? 100 - Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
      {
        name: "PDTCH Congestion (%)",
        calculate: (filteredData) => {
          const totalNum = filteredData.reduce((sum, item) => sum + (item.NUM_PDTCH_CONGESTION || 0), 0);
          const totalDenum = filteredData.reduce((sum, item) => sum + (item.DENUM_PDTCH_CONGESTION || 0), 0);
          return Number(totalDenum.toFixed(2)) > 0 ? Number(((totalNum / totalDenum) * 100).toFixed(2)) : 0;
        },
      },
    ],
    [],
  );

  const filterByDateRange = React.useCallback(
    (startDate: string, endDate: string): Agg2gModel[] => {
      if (!startDate || !endDate) return [];

      // Convert ISO strings to dates and set to start/end of day in the target timezone
      const start = startOfDay(toZonedTime(new Date(startDate), timezone));
      const end = endOfDay(toZonedTime(new Date(endDate), timezone));

      // console.log('Filtering dates:', {
      //   startDate: start.toISOString(),
      //   endDate: end.toISOString(),
      //   startLocal: start.toString(),
      //   endLocal: end.toString()
      // });

      return data.filter((item) => {
        const itemDate = toZonedTime(new Date(item.BEGIN_TIME), timezone);

        // console.log('Checking item:', {
        //   itemDate: itemDate.toISOString(),
        //   itemDateLocal: itemDate.toString(),
        //   inRange: itemDate >= start && itemDate <= end
        // });

        return itemDate >= start && itemDate <= end;
      });
    },
    [data],
  );

  const calculateGrowth = useCallback((before: number, after: number): number => {
    if (before === 0) return 0;
    return ((after - before) / before) * 100;
  }, []);

  const comparisonData = useMemo((): ComparisonResult[] => {
    const beforeData = filterByDateRange(beforeRange.startDate, beforeRange.endDate);
    const afterData = filterByDateRange(afterRange.startDate, afterRange.endDate);

    // console.log('Data counts:', {
    //   data: data,
    //   beforeData: beforeData.length,
    //   afterData: afterData.length,
    //   beforeRange,
    //   afterRange
    // });

    return metricCalculators.map(({ name, calculate }) => {
      const before = calculate(beforeData);
      const after = calculate(afterData);
      let delta = 0;
      if (
        name === "SD Block (%)" ||
        name === "TCH Block (%)" ||
        name === "PDTCH Congestion (%)" ||
        name === "TCH Drop (%)" ||
        name === "SDCCH Drop Rate (%)"
      ) {
        delta = -(after - before);
      } else {
        delta = after - before;
      }

      let growth = 0;
      if (
        name === "SDSR (%)" ||
        name === "DL PRB Utilization (%)" ||
        name === "UL PRB Utilization (%)" ||
        name === "RRC Setup Success Rate (%)" ||
        name === "E-RAB Setup Success Rate (%)" ||
        name === "CSFB Success Rate (%)" ||
        name === "Intra Freq Success Rate (%)" ||
        name === "Inter Freq Success Rate (%)" ||
        name === "VoLTE CSSR (%)" ||
        name === "VoLTE CALL DROP (%)"
      ) {
        growth = calculateSuccessRate100(before, after);
      } else if (
        name === "SDCCH Block (%)" ||
        name === "TCH Block (%)" ||
        name === "PDTCH Congestion (%)" ||
        name === "TCH Drop (%)" ||
        name === "SDCCH Drop Rate (%)"
      ) {
        growth = calculateSuccessRate0(before, after);
      } else {
        growth = calculateGrowth(before, after);
      }

      return { metric: name, before, after, delta, growth };
    });
  }, [beforeRange, afterRange, metricCalculators, filterByDateRange, calculateGrowth]);

  const DateRangePicker = ({
    title,
    range,
    setRange,
  }: {
    title: string;
    range: DateRange;
    setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  }) => {
    const formatWithTimezone = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const zonedDate = toZonedTime(date, timezone);
      return format(zonedDate, "yyyy-MM-dd");
    };

    const handleDateSelect = (date: Date | undefined, field: "startDate" | "endDate") => {
      if (!date) return;

      // Convert the selected date to the target timezone and store as ISO string
      const zonedDate = toZonedTime(date, timezone);
      setRange((prev) => ({
        ...prev,
        [field]: zonedDate.toISOString(),
      }));
    };

    const getSelectedDate = (dateString: string) => {
      if (!dateString) return undefined;
      return toZonedTime(new Date(dateString), timezone);
    };

    return (
      <div className="date-range-group">
        <h3 className="font-semibold">{title}</h3>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!range.startDate}
                className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                <CalendarIcon />
                {range.startDate ? formatWithTimezone(range.startDate) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={getSelectedDate(range.startDate)}
                onSelect={(date) => handleDateSelect(date, "startDate")}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!range.endDate}
                className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                <CalendarIcon />
                {range.endDate ? formatWithTimezone(range.endDate) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={getSelectedDate(range.endDate)}
                onSelect={(date) => handleDateSelect(date, "endDate")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

  // Helper function to format dates for display in table
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = toZonedTime(new Date(dateString), timezone);
    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className="grid grid-cols-1 gap-6 rounded-lg bg-white p-2 shadow lg:grid-cols-6">
      <div className="col-span-2 space-y-6">
        <div className="grid gap-4 rounded-2xl bg-slate-200 p-4 text-sm">
          <DateRangePicker title="Before Period" range={beforeRange} setRange={setBeforeRange} />
          <DateRangePicker title="After Period" range={afterRange} setRange={setAfterRange} />
        </div>

        <div className="grid gap-2 rounded-2xl bg-slate-100 p-4">
          <h3 className="font-semibold">Productivity</h3>
          {comparisonData
            .filter((row) => row.metric === "TCH Traffic (Erl)" || row.metric === "Total Payload (MB)")
            .map((row, _index) => (
              <div key={row.metric}>
                <div
                  className={`flex justify-between font-semibold text-sm ${row.growth > 5 ? "text-green-600" : row.growth < -5 ? "text-red-600" : "text-yellow-600"}`}
                >
                  <div>{row.metric}</div>
                  <div>{row.growth.toFixed(2)}%</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="comparison-table col-span-4">
        <h3 className="mb-2 font-semibold text-lg">Comparison Results</h3>
        <div className="text-sm">
          Date Before Range: {formatDateForDisplay(beforeRange.startDate)} to{" "}
          {formatDateForDisplay(beforeRange.endDate)}
        </div>
        <div className="mb-2 text-sm">
          Date After Range: {formatDateForDisplay(afterRange.startDate)} to {formatDateForDisplay(afterRange.endDate)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left font-medium">Metric</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Before</th>
                <th className="border border-gray-200 p-3 text-left font-medium">After</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Delta</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Growth (%)</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Remark</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, _index) => (
                <tr key={row.metric} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">{row.metric}</td>
                  <td className="border border-gray-200 p-3 text-right">{row.before.toFixed(2)}</td>
                  <td className="border border-gray-200 p-3 text-right">{row.after.toFixed(2)}</td>
                  <td
                    className={`border border-gray-200 p-3 text-right ${
                      row.growth > 5 ? "text-green-600" : row.growth < -5 ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {row.delta.toFixed(2)}
                  </td>
                  <td
                    className={`border border-gray-200 p-3 text-right ${
                      row.growth > 5 ? "text-green-600" : row.growth < -5 ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {row.growth.toFixed(2)}%
                  </td>
                  <td
                    className={`border border-gray-200 p-3 text-center ${
                      row.growth > 5 ? "text-green-600" : row.growth < -5 ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {row.growth > 5 ? "Improved" : row.growth < -5 ? "Degrade" : "Maintain"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComparison2GDailyV2;
