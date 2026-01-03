/** biome-ignore-all lint/suspicious/noExplicitAny: <will fix later> */
// biome-ignore assist/source/organizeImports: <will fix later>
import type React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Register ChartJS components including the data labels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels, // Register the data labels plugin
);

interface DistributionData {
  "Begin Time": string;
  "<90%": string;
  "90-96%": string;
  ">96%": string;
  total_records: string;
  formattedDate?: string;
}

interface CellDistributionChartProps {
  title: string;
  data: DistributionData[];
}

const CellDistributionChartByPercentageHosr: React.FC<CellDistributionChartProps> = ({ data, title }) => {
  // Calculate percentage data for the chart
  const percentageData = data.map((item) => {
    const total = parseInt(item["total_records"], 10);
    return {
      "<90%": (parseInt(item["<90%"], 10) / total) * 100,
      "90-96%": (parseInt(item["90-96%"], 10) / total) * 100,
      ">96%": (parseInt(item[">96%"], 10) / total) * 100,
    };
  });

  const cellCountData = data.map((item) => ({
    ">96%": parseInt(item[">96%"], 10),
    "90-96%": parseInt(item["90-96%"], 10),
    "<90%": parseInt(item["<90%"], 10),
  }));

  const calculateYAxisMin = () => {
    if (data.length === 0) return 95;

    const minPercentage = Math.min(...percentageData.map((item) => item["<90%"] + item["90-96%"] + item[">96%"]));

    // console.log(minPercentage)

    // Start from 95% or the minimum percentage in your data, whichever is lower
    return Math.min(60, Math.floor(minPercentage));
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Cell Distribution by ${title} Percentage`,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const label = context.dataset.label || "";
            const value = context.formattedValue;
            const dataIndex = context.dataIndex;
            const item = data[dataIndex];

            const actualCount = parseInt(
              item[context.dataset.label === "<90%" ? "<90%" : context.dataset.label === "90-96%" ? "90-96%" : ">96%"],
              10,
            );

            return `${label}: ${value}% (${actualCount} cells)`;
          },
          afterBody: (context: TooltipItem<"bar">[]) => {
            if (context.length === 0) return [];

            const dataIndex = context[0].dataIndex;
            const item = data[dataIndex];

            return [
              "",
              `Total Records: ${item.total_records}`,
              `<90%: ${item["<90%"]} (${((parseInt(item["<90%"], 10) / parseInt(item.total_records, 10)) * 100).toFixed(1)}%)`,
              `90-96%: ${item["90-96%"]} (${((parseInt(item["90-96%"], 10) / parseInt(item.total_records, 10)) * 100).toFixed(1)}%)`,
              `>96%: ${item[">96%"]} (${((parseInt(item[">96%"], 10) / parseInt(item.total_records, 10)) * 100).toFixed(1)}%)`,
            ];
          },
        },
      },
      // Data labels configuration with 90-degree rotation
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold" as const,
          size: 10,
        },
        formatter: (_value: number, context: any) => {
          const dataIndex = context.dataIndex;
          const datasetIndex = context.datasetIndex;

          // Get the actual cell count for this segment
          let cellCount = 0;
          if (datasetIndex === 2) {
            cellCount = cellCountData[dataIndex]["<90%"];
          } else if (datasetIndex === 1) {
            cellCount = cellCountData[dataIndex]["90-96%"];
          } else if (datasetIndex === 0) {
            cellCount = cellCountData[dataIndex][">96%"];
          }

          // Only show label if there are enough cells
          if (cellCount < 5) return ""; // Hide labels for very small counts
          return cellCount.toString(); // Show the actual cell count
        },
        anchor: "center",
        align: "center",
        rotation: -90, // Vertical text
        clip: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        // title: {
        //   display: true,
        //   text: 'Percentage of Cells (%)'
        // },
        min: calculateYAxisMin(),
        max: 100,
        ticks: {
          callback: (value) => value + "%",
        },
      },
    },
  };

  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.formattedDate || item["Begin Time"]),
    datasets: [
      {
        label: ">96%",
        data: percentageData.map((item) => item[">96%"]),
        backgroundColor: "rgba(21,96,130, 0.8)",
        borderColor: "rgba(21,96,130, 1)",
        borderWidth: 1,
      },
      {
        label: "90-96%",
        data: percentageData.map((item) => item["90-96%"]),
        backgroundColor: "rgba(242,170,132, 0.8)",
        borderColor: "rgba(242,170,132, 1)",
        borderWidth: 1,
      },
      {
        label: "<90%",
        data: percentageData.map((item) => item["<90%"]),
        backgroundColor: "rgba(178,23,0, 0.8)",
        borderColor: "rgba(178,23,0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-96 w-full rounded-lg bg-white p-4 shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CellDistributionChartByPercentageHosr;
