// biome-ignore assist/source/organizeImports: <explanation>
import type { Agg2gModel } from "@/types/schema";
import React, { useState, useMemo, useCallback } from "react";
import { subDays, formatDate } from "date-fns";
import { calculateSuccessRate100 } from "../../../_function/helper";

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

const TableComparison2GDailyV1: React.FC<{ data: Agg2gModel[] }> = ({ data }) => {
  const [afterRange, setAfterRange] = useState<DateRange>({
    startDate: subDays(new Date(), 4).toISOString(),
    endDate: subDays(new Date(), 1).toISOString(),
  });
  const [beforeRange, setBeforeRange] = useState<DateRange>({
    startDate: subDays(new Date(), 11).toISOString(),
    endDate: subDays(new Date(), 8).toISOString(),
  });

  // Metric configuration - easy to add new metrics
  const metricCalculators = useMemo<MetricCalculator[]>(
    () => [
      {
        name: "TCH Traffic (Erl)",
        calculate: (filteredData) => filteredData.reduce((sum, item) => sum + (item.TCH_TRAFFIC_ERL || 0), 0),
      },
      // {
      //   name: 'Max RRC User',
      //   calculate: (filteredData) =>
      //     filteredData.reduce((sum, item) => sum + (item.AVG_MAX_RRC_CONNECTION_USER || 0), 0) / Math.max(1, filteredData.length)
      // },
      // {
      //   name: 'DL PRB Utilization (%)',
      //   calculate: (filteredData) => {
      //     const totalNum = filteredData.reduce((sum, item) => sum + (item.LTE_PRB_DL_BEYOND_NUM || 0), 0);
      //     const totalDenum = filteredData.reduce((sum, item) => sum + (item.LTE_PRB_DL_BEYOND_DEN || 0), 0);
      //     return totalDenum > 0 ? (totalNum / totalDenum) * 100 : 0;
      //   }
      // },
    ],
    [],
  );

  const filterByDateRange = React.useCallback(
    (startDate: string, endDate: string): Agg2gModel[] => {
      if (!startDate || !endDate) return [];

      const start = new Date(startDate);
      const end = new Date(endDate);

      return data.filter((item) => {
        const itemDate = new Date(item.BEGIN_TIME);
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

    return metricCalculators.map(({ name, calculate }) => {
      const before = calculate(beforeData);
      const after = calculate(afterData);
      const delta = after - before;

      let growth = 0;
      if (
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
      } else {
        growth = calculateGrowth(before, after);
      }

      return { metric: name, before, after, delta, growth };
    });
  }, [beforeRange, afterRange, metricCalculators, filterByDateRange, calculateGrowth]);

  const updateDateRange =
    (setter: React.Dispatch<React.SetStateAction<DateRange>>, field: keyof DateRange) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const DateRangePicker = ({
    title,
    range,
    setRange,
  }: {
    title: string;
    range: DateRange;
    setRange: React.Dispatch<React.SetStateAction<DateRange>>;
  }) => (
    <div className="date-range-group">
      <h3 className="mb-3 font-semibold text-lg">{title}</h3>
      <div className="space-y-2">
        <label className="block">
          <span className="font-medium text-sm">Start Date:</span>
          <input
            type="date"
            value={range.startDate}
            onChange={updateDateRange(setRange, "startDate")}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </label>
        <label className="block">
          <span className="font-medium text-sm">End Date:</span>
          <input
            type="date"
            value={range.endDate}
            onChange={updateDateRange(setRange, "endDate")}
            className="mt-1 w-full rounded border border-gray-300 p-2"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 rounded-lg bg-white p-4 shadow lg:grid-cols-2">
      <div className="space-y-6">
        <DateRangePicker title="Before Period" range={beforeRange} setRange={setBeforeRange} />
        <DateRangePicker title="After Period" range={afterRange} setRange={setAfterRange} />
      </div>

      <div className="comparison-table">
        <h3 className="mb-4 font-semibold text-lg">Comparison Results</h3>
        <div className="mb-4 font-semibold">
          Date Before Range: {formatDate(beforeRange.startDate, "yyyy-MM-dd")} to{" "}
          {formatDate(beforeRange.endDate, "yyyy-MM-dd")}
        </div>
        <div className="mb-4 font-semibold">
          Date After Range: {formatDate(afterRange.startDate, "yyyy-MM-dd")} to{" "}
          {formatDate(afterRange.endDate, "yyyy-MM-dd")}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left font-medium">Metric</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Before</th>
                <th className="border border-gray-200 p-3 text-left font-medium">After</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Delta</th>
                <th className="border border-gray-200 p-3 text-left font-medium">Growth (%)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-3 font-medium">{row.metric}</td>
                  <td className="border border-gray-200 p-3">{row.before.toFixed(2)}</td>
                  <td className="border border-gray-200 p-3">{row.after.toFixed(2)}</td>
                  <td className={`border border-gray-200 p-3 ${row.delta >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {row.delta.toFixed(2)}
                  </td>
                  <td className={`border border-gray-200 p-3 ${row.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {row.growth.toFixed(2)}%
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

export default TableComparison2GDailyV1;
