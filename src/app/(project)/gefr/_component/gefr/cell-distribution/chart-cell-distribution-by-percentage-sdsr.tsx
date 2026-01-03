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
  "<98%": string;
  ">98%": string;
  total_records: string;
  formattedDate?: string;
}

interface CellDistributionChartProps {
  title: string;
  data: DistributionData[];
}

const CellDistributionChartByPercentageSdsr: React.FC<CellDistributionChartProps> = ({ data, title }) => {
  // Calculate percentage data for the chart
  const percentageData = data.map((item) => {
    const total = parseInt(item["total_records"]);
    return {
      "<98%": (parseInt(item["<98%"]) / total) * 100,
      ">98%": (parseInt(item[">98%"]) / total) * 100,
    };
  });

  const cellCountData = data.map((item) => ({
    ">98%": parseInt(item[">98%"]),
    "<98%": parseInt(item["<98%"]),
  }));

  const calculateYAxisMin = () => {
    if (data.length === 0) return 95;

    const minPercentage = Math.min(...percentageData.map((item) => item["<98%"] + item[">98%"]));

    // console.log(minPercentage)

    // Start from 95% or the minimum percentage in your data, whichever is lower
    return Math.min(90, Math.floor(minPercentage));
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

            const actualCount = parseInt(item[context.dataset.label === "<98%" ? "<98%" : ">98%"]);

            return `${label}: ${value}% (${actualCount} cells)`;
          },
          afterBody: (context: TooltipItem<"bar">[]) => {
            if (context.length === 0) return [];

            const dataIndex = context[0].dataIndex;
            const item = data[dataIndex];

            return [
              "",
              `Total Records: ${item["total_records"]}`,
              `<98%: ${item["<98%"]} (${((parseInt(item["<98%"]) / parseInt(item["total_records"])) * 100).toFixed(1)}%)`,
              `>98%: ${item[">98%"]} (${((parseInt(item[">98%"]) / parseInt(item["total_records"])) * 100).toFixed(1)}%)`,
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
        formatter: (value: number, context: any) => {
          const dataIndex = context.dataIndex;
          const datasetIndex = context.datasetIndex;

          // Get the actual cell count for this segment
          let cellCount = 0;
          if (datasetIndex === 1) {
            cellCount = cellCountData[dataIndex]["<98%"];
          } else if (datasetIndex === 0) {
            cellCount = cellCountData[dataIndex][">98%"];
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
        label: ">98%",
        data: percentageData.map((item) => item[">98%"]),
        backgroundColor: "rgba(21,96,130, 0.8)",
        borderColor: "rgba(21,96,130, 1)",
        borderWidth: 1,
      },
      {
        label: "<98%",
        data: percentageData.map((item) => item["<98%"]),
        backgroundColor: "rgba(178,23,0, 0.8)",
        borderColor: "rgba(178,23,0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CellDistributionChartByPercentageSdsr;
