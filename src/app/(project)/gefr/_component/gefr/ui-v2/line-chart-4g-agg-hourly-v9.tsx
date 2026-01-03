// biome-ignore assist/source/organizeImports: <explanation>
import type React from "react";
import { useRef, useEffect, useMemo } from "react";
import {
  Chart,
  Filler,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";
import type { Agg4gHyModel } from "@/types/schema";
import { extractCellName } from "../../../_function/helper";
import { chartJsColors, chartJsV1Settings } from "../../contexts/chartjs/chartjs-settings";

Chart.register(Filler, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

interface LineChartProps {
  data: Agg4gHyModel[];
  metric_num: string;
  metric_denum?: string;
  aggregation?: "sum" | "avg";
  aggregation_by?: keyof Agg4gHyModel;
  title?: string;
  showPayload?: boolean;
  isExtractCellName?: boolean;
}

const LineChart4GAggHourlyV9: React.FC<LineChartProps> = ({
  data,
  metric_num,
  metric_denum,
  aggregation = "sum",
  aggregation_by = "NOP",
  title = "%",
  showPayload = false,
  isExtractCellName = false,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const isDropRatePercentage = title.toUpperCase().includes("DROP RATE");

  const chartData = useMemo(() => {
    if (!data?.length) return { labels: [], datasets: [] };

    const isPercentage = title.includes("%");
    const isAverage = aggregation === "avg" || title.includes("AVG");
    const isDenumBy1 = metric_denum === "DENUMBY1";

    const groups: Record<string, Record<string, { num: number; denum: number; count: number; payload: number }>> = {};
    const timeSlots = new Set<string>();

    data.forEach((item) => {
      // Format BEGIN_TIME to show hourly data
      const beginTime = new Date(item.BEGIN_TIME);
      const timeSlot = beginTime.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const groupKey = isExtractCellName
        ? extractCellName(String(item[aggregation_by] || "Unknown"))
        : String(item[aggregation_by] || "Unknown");

      timeSlots.add(timeSlot);

      if (!groups[groupKey]) groups[groupKey] = {};
      if (!groups[groupKey][timeSlot]) {
        groups[groupKey][timeSlot] = { num: 0, denum: 0, count: 0, payload: 0 };
      }

      const actualNumValue = (item as any)[metric_num];
      const actualDenumValue = isDenumBy1 ? 1 : (item as any)[metric_denum!];

      const numValue = Number(actualNumValue) || 0;
      const denumValue = isDenumBy1 ? 1 : Number(actualDenumValue) || 0;
      const payloadValue = Number((item as any).TOTAL_PAYLOAD_GB) || 0;

      groups[groupKey][timeSlot].num += numValue;
      groups[groupKey][timeSlot].denum += denumValue;
      groups[groupKey][timeSlot].count += 1;
      groups[groupKey][timeSlot].payload += payloadValue;
    });

    // Sort time slots chronologically
    const sortedTimeSlots = Array.from(timeSlots).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const sortedGroups = Object.keys(groups).sort();

    const metricDatasets = sortedGroups.map((groupKey, index) => {
      const values = sortedTimeSlots.map((timeSlot) => {
        const groupData = groups[groupKey][timeSlot];
        if (!groupData) return 0;

        const num = groupData.num;
        const denum = isDenumBy1 ? 1 : groupData.denum;

        if (denum === 0) return 0;

        let value = isDenumBy1 ? num : isDropRatePercentage ? 100 - num / denum : num / denum;
        if (isPercentage && !isDropRatePercentage) value *= 100;
        if (isAverage && groupData.count > 0) value /= groupData.count;

        const result = Number(value.toFixed(4));
        return result;
      });

      return {
        label: groupKey,
        data: values,
        borderColor: chartJsColors[index % chartJsColors.length],
        backgroundColor: chartJsColors[index % chartJsColors.length],
        tension: 0.3,
        pointRadius: 0,
        fill: false,
        yAxisID: "y",
      };
    });

    // Add payload dataset if enabled
    const payloadDataset = showPayload
      ? {
          label: "Total Payload (GB)",
          data: sortedTimeSlots.map((timeSlot) => {
            const totalPayload = sortedGroups.reduce(
              (sum, groupKey) => sum + (groups[groupKey][timeSlot]?.payload || 0),
              0,
            );
            return Number(totalPayload.toFixed(2));
          }),
          borderColor: "#ff6384",
          backgroundColor: "rgba(255, 99, 132, 0.4)",
          tension: 0.3,
          pointRadius: 3,
          fill: { target: "start", above: "rgba(255, 99, 132, 0.3)" } as const,
          yAxisID: "y1",
        }
      : null;

    return {
      labels: sortedTimeSlots,
      datasets: payloadDataset ? [...metricDatasets, payloadDataset] : metricDatasets,
    };
  }, [
    data,
    metric_num,
    metric_denum,
    aggregation,
    aggregation_by,
    title,
    showPayload,
    isDropRatePercentage,
    isExtractCellName,
  ]);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current || !chartData.labels.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const isPercentage = title.includes("%");

    const config: ChartConfiguration<"line"> = {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: false, // Completely disable data labels
          },
          legend: {
            position: "top" as const,
            labels: {
              usePointStyle: true,
              font: {
                size: chartJsV1Settings.legendFontSize,
                family: chartJsV1Settings.legendFonstFamily,
                weight: chartJsV1Settings.legendFontWeight,
              },
            },
          },
          title: {
            display: true,
            text: title,
            font: {
              size: chartJsV1Settings.titleFontSize,
              family: chartJsV1Settings.titleFonstFamily,
              weight: chartJsV1Settings.titleFontWeight,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: chartJsV1Settings.tooltipBackgroundColor,
            titleFont: {
              size: chartJsV1Settings.tooltipTitleFontSize,
            },
            bodyFont: {
              size: chartJsV1Settings.tooltipBodyFontSize,
            },
            padding: 12,
            callbacks: {
              label: (context) => {
                const datasetLabel = context.dataset.label || "";
                const value = context.parsed.y || 0;

                if (datasetLabel.includes("Payload")) {
                  return `${datasetLabel}: ${value.toFixed(2)} GB`;
                }
                return `${datasetLabel}: ${value.toFixed(isPercentage ? 2 : 4)}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              // display: true,
              text: String(aggregation_by),
              font: {
                size: chartJsV1Settings.yAxisTitleFontSize,
                family: chartJsV1Settings.legendFonstFamily,
                weight: chartJsV1Settings.yAxisTitleFontWeight,
              },
            },
            ticks: {
              font: {
                size: chartJsV1Settings.yAxisTickFontSize,
              },
              callback: (value) => {
                if (typeof value === "number") {
                  if (isPercentage && !isDropRatePercentage) {
                    return `${value.toFixed(2)}%`;
                  }
                  if (isDropRatePercentage) {
                    return `${value.toFixed(4)}%`;
                  }
                  return value.toFixed(0);
                }
                return value;
              },
            },
            grid: {
              display: false,
            },
            position: "left",
          },
          y1: {
            beginAtZero: false,
            title: {
              display: showPayload,
              text: "Total Payload (GB)",
              font: {
                size: chartJsV1Settings.yAxisTitleFontSize,
                family: chartJsV1Settings.legendFonstFamily,
                weight: chartJsV1Settings.yAxisTitleFontWeight,
              },
            },
            ticks: {
              font: {
                size: chartJsV1Settings.yAxisTickFontSize,
              },
            },
            position: "right",
            grid: {
              drawOnChartArea: false,
            },
            display: showPayload,
          },
          x: {
            ticks: {
              maxTicksLimit: 10,
              font: {
                size: chartJsV1Settings.xAxisTickFontSize,
              },
              callback: function (_value, index) {
                // Show formatted time labels
                const label = this.getLabelForValue(index);
                return label;
              },
            },
            grid: {
              display: false,
            },
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartData, title, aggregation_by, showPayload, isDropRatePercentage]);

  if (!data?.length) {
    return <div className="flex items-center justify-center p-10 text-gray-500 text-lg">No data available</div>;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-80 rounded-lg bg-white p-4 shadow-sm">
        <div className="h-full">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default LineChart4GAggHourlyV9;
