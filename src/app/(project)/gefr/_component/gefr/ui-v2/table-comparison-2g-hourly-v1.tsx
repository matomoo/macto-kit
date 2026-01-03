// biome-ignore assist/source/organizeImports: <explanation>
import type { Agg2gModel } from "@/types/schema";
import React, { useState, useMemo, useCallback } from "react";
import { calculateSuccessRate100 } from "../../../_function/helper";

interface DateRange {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
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

const TableComparison2GHourlyV1: React.FC<{ data: Agg2gModel[] }> = ({ data }) => {
  const [beforeRange, setBeforeRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
    startTime: "00:00",
    endTime: "23:59",
  });
  const [afterRange, setAfterRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
    startTime: "00:00",
    endTime: "23:59",
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
      // Add more metrics here as needed
    ],
    [],
  );

  const filterByDateTimeRange = React.useCallback(
    (startDate: string, endDate: string, startTime: string, endTime: string): Agg2gModel[] => {
      if (!startDate || !endDate) return [];

      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      return data.filter((item) => {
        const itemDateTime = new Date(item.BEGIN_TIME);
        return itemDateTime >= startDateTime && itemDateTime <= endDateTime;
      });
    },
    [data],
  );

  const calculateGrowth = useCallback((before: number, after: number): number => {
    if (before === 0) return 0;
    return ((after - before) / before) * 100;
  }, []);

  const comparisonData = useMemo((): ComparisonResult[] => {
    const beforeData = filterByDateTimeRange(
      beforeRange.startDate,
      beforeRange.endDate,
      beforeRange.startTime,
      beforeRange.endTime,
    );
    const afterData = filterByDateTimeRange(
      afterRange.startDate,
      afterRange.endDate,
      afterRange.startTime,
      afterRange.endTime,
    );

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
  }, [beforeRange, afterRange, metricCalculators, filterByDateTimeRange, calculateGrowth]);

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
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium">Start Date:</span>
            <input
              type="date"
              value={range.startDate}
              onChange={updateDateRange(setRange, "startDate")}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">End Date:</span>
            <input
              type="date"
              value={range.endDate}
              onChange={updateDateRange(setRange, "endDate")}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium">Start Time:</span>
            <input
              type="time"
              value={range.startTime}
              onChange={updateDateRange(setRange, "startTime")}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">End Time:</span>
            <input
              type="time"
              value={range.endTime}
              onChange={updateDateRange(setRange, "endTime")}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </label>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div>Selected time range:</div>
          <div>
            {range.startDate && range.startTime && range.endDate && range.endTime
              ? `${range.startDate} ${range.startTime} to ${range.endDate} ${range.endTime}`
              : "Please select date range"}
          </div>
          {range.startDate && range.endDate && (
            <div className="mt-1">
              Data points:{" "}
              {filterByDateTimeRange(range.startDate, range.endDate, range.startTime, range.endTime).length}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-white rounded-lg shadow">
      <div className="space-y-6">
        <DateRangePicker title="Before Period" range={beforeRange} setRange={setBeforeRange} />
        <DateRangePicker title="After Period" range={afterRange} setRange={setAfterRange} />
      </div>

      <div className="comparison-table">
        <h3 className="text-lg font-semibold mb-4">Comparison Results</h3>
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

export default TableComparison2GHourlyV1;
