// biome-ignore assist/source/organizeImports: <will fix later>
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
import type { Agg2gModel } from "@/types/schema";
import { extractCellName } from "../../../_function/helper";
import { chartJsColors, chartJsV1Settings } from "../../contexts/chartjs/chartjs-settings";

Chart.register(Filler, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

interface LineChartProps {
  data: Agg2gModel[];
  metric_num: string;
  metric_denum?: string;
  aggregation?: "sum" | "avg";
  aggregation_by?: keyof Agg2gModel;
  title?: string;
  showPayload?: boolean;
  isExtractCellName?: boolean;
  isSR100?: boolean;
}

const LineChart2GAggDailyV8: React.FC<LineChartProps> = ({
  data,
  metric_num,
  metric_denum,
  aggregation = "sum",
  aggregation_by = "NOP",
  title = "%",
  showPayload = false,
  isExtractCellName = false,
  isSR100 = false,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const isDropRatePercentage = !!isSR100;

  const isTrafficChart = useMemo(() => {
    return title.toLowerCase().includes("traffic") || title.toLowerCase().includes("payload");
  }, [title]);

  // Export function with format options
  const exportChartAsImage = (format: "png" | "jpeg" = "png", quality = 1.0) => {
    if (!chartInstance.current) return;

    // Create a temporary canvas for high-resolution export
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // High resolution settings (3x for better quality)
    const scaleFactor = 3;
    const paddingNum = 5;
    const padding = paddingNum * scaleFactor;
    const originalCanvas = chartInstance.current.canvas;

    // Set export canvas dimensions (higher resolution)
    exportCanvas.width = originalCanvas.width * scaleFactor + padding * 2;
    exportCanvas.height = originalCanvas.height * scaleFactor + padding * 2;

    // Fill with white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(paddingNum, paddingNum, exportCanvas.width, exportCanvas.height);

    // Scale the context for high resolution and draw the chart
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(originalCanvas, paddingNum, paddingNum);

    // Convert to data URL with specified format
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const imageDataUrl = exportCanvas.toDataURL(mimeType, quality);

    // Create download link
    const link = document.createElement("a");
    const fileExtension = format === "jpeg" ? "jpg" : "png";
    const fileName = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "chart"}_${new Date().toISOString().split("T")[0]}.${fileExtension}`;

    link.download = fileName;
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsPNG = () => exportChartAsImage("png", 1.0);

  const chartData = useMemo(() => {
    if (!data?.length) return { labels: [], datasets: [] };

    const isPercentage = title.includes("%");
    const isAverage = aggregation === "avg" || title.includes("AVG");
    const isDenumBy1 = metric_denum === "DENUMBY1";

    const groups: Record<string, Record<string, { num: number; denum: number; count: number; payload: number }>> = {};
    const dates = new Set<string>();

    data.forEach((item) => {
      const date = new Date(item.BEGIN_TIME).toLocaleDateString();
      const groupKey = isExtractCellName
        ? extractCellName(String(item[aggregation_by] || "Unknown"))
        : String(item[aggregation_by] || "Unknown");

      dates.add(date);

      if (!groups[groupKey]) groups[groupKey] = {};
      if (!groups[groupKey][date]) {
        groups[groupKey][date] = { num: 0, denum: 0, count: 0, payload: 0 };
      }

      const actualNumValue = (item as Record<string, unknown>)[metric_num];
      const actualDenumValue = isDenumBy1
        ? 1
        : metric_denum
          ? (item as Record<string, unknown>)[metric_denum]
          : undefined;

      const numValue = Number(actualNumValue) || 0;
      const denumValue = isDenumBy1 ? 1 : Number(actualDenumValue) || 0;
      const payloadValue = Number((item as Record<string, unknown>).TOTAL_PAYLOAD_GB) || 0;

      groups[groupKey][date].num += numValue;
      groups[groupKey][date].denum += denumValue;
      groups[groupKey][date].count += 1;
      groups[groupKey][date].payload += payloadValue;
    });

    const sortedDates = Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const sortedGroups = Object.keys(groups).sort();

    const metricDatasets = sortedGroups.map((groupKey, index) => {
      const values = sortedDates.map((date) => {
        const groupData = groups[groupKey][date];
        if (!groupData) return 0;

        const num = groupData.num;
        const denum = isDenumBy1 ? 1 : groupData.denum;

        if (denum === 0) return 0;

        let value = isDenumBy1 ? num : isDropRatePercentage ? 100 - num / denum : num / denum < 0 ? 0 : num / denum;
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
        fill: isTrafficChart,
        stack: isTrafficChart ? "stack" : undefined,
        yAxisID: "y",
      };
    });

    const payloadDataset = showPayload
      ? {
          label: "Total Payload (GB)",
          data: sortedDates.map((date) => {
            const totalPayload = sortedGroups.reduce(
              (sum, groupKey) => sum + (groups[groupKey][date]?.payload || 0),
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
      labels: sortedDates,
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
    isTrafficChart,
  ]);

  // Initialize chart with white background
  useEffect(() => {
    if (!chartRef.current || !chartData.labels.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

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
        // Add white background to chart area
        backgroundColor: "#FFFFFF",
        plugins: {
          datalabels: {
            display: false,
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
            mode: isTrafficChart ? "nearest" : "index",
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
            beginAtZero: isTrafficChart,
            stacked: isTrafficChart,
            title: {
              text: String(aggregation_by),
              font: {
                size: chartJsV1Settings.yAxisTitleFontSize,
                family: chartJsV1Settings.legendFonstFamily,
                weight: chartJsV1Settings.yAxisTitleFontWeight,
              },
            },
            grid: {
              display: false,
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
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: chartJsV1Settings.yAxisTickFontSize,
              },
            },
            position: "right",
            display: "auto",
          },
          x: {
            ticks: {
              // maxTicksLimit: 10,
              font: {
                size: chartJsV1Settings.xAxisTickFontSize,
              },
              maxRotation: 90,
              minRotation: 90,
              padding: 2,
              autoSkip: true,
              autoSkipPadding: 10,
              // Format the labels as dd-mmm
              callback: function (value, _index, _values) {
                const label = this.getLabelForValue(value as number);
                try {
                  // Parse the date and format as dd-mmm
                  const date = new Date(label);
                  if (!Number.isNaN(date.getTime())) {
                    const day = date.getDate().toString().padStart(2, "0");
                    const month = date.toLocaleString("en", { month: "short" });
                    return `${day}-${month}`;
                  }
                } catch (_) {
                  // If date parsing fails, return original label
                }
                return label;
              },
            },
            grid: {
              display: false,
            },
            stacked: isTrafficChart,
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
  }, [chartData, title, aggregation_by, showPayload, isDropRatePercentage, isTrafficChart]);

  if (!data?.length) {
    return <div className="flex items-center justify-center p-10 text-gray-500 text-lg">No data available</div>;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative h-80 rounded-lg bg-white p-2 shadow-sm">
        {" "}
        {/* Add relative positioning */}
        <button
          type="button"
          onClick={exportAsPNG}
          className="absolute top-2 left-2 z-10 flex items-center gap-2 px-2 py-1 font-medium text-gray-100 text-sm transition-colors duration-200 hover:text-gray-400"
          title="Download image"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>Download image</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
        <div className="h-full bg-white">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default LineChart2GAggDailyV8;
