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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DistributionData {
  "Begin Time": string;
  "<2%": string;
  "2-5%": string;
  ">5%": string;
  total_records: string;
  formattedDate?: string;
}

interface CellDistributionChartProps {
  data: DistributionData[];
}

const CellDistributionChart: React.FC<CellDistributionChartProps> = ({ data }) => {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Cell Distribution by TCH Block Percentage",
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const label = context.dataset.label || "";
            const value = context.formattedValue;
            return `${label}: ${value} cells`;
          },
          afterBody: (context: TooltipItem<"bar">[]) => {
            if (context.length === 0) return [];

            const dataIndex = context[0].dataIndex;
            const item = data[dataIndex];

            return [
              "",
              `Total Records: ${item["total_records"]}`,
              `<2%: ${item["<2%"]} (${((parseInt(item["<2%"]) / parseInt(item["total_records"])) * 100).toFixed(1)}%)`,
              `2-5%: ${item["2-5%"]} (${((parseInt(item["2-5%"]) / parseInt(item["total_records"])) * 100).toFixed(1)}%)`,
              `>5%: ${item[">5%"]} (${((parseInt(item[">5%"]) / parseInt(item["total_records"])) * 100).toFixed(1)}%)`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        // title: {
        //   display: true,
        //   text: 'Date (Asia/Makassar Time)'
        // }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Number of Cells",
        },
        // beginAtZero: true
      },
    },
  };

  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.formattedDate || item["Begin Time"]),
    datasets: [
      {
        label: "<2%",
        data: data.map((item) => parseInt(item["<2%"])),
        backgroundColor: "rgba(21,96,130, 0.8)",
        borderColor: "rgba(21,96,130, 1)",
        borderWidth: 1,
      },
      {
        label: "2-5%",
        data: data.map((item) => parseInt(item["2-5%"])),
        backgroundColor: "rgba(242,170,132, 0.8)",
        borderColor: "rgba(242,170,132, 1)",
        borderWidth: 1,
      },
      {
        label: ">5%",
        data: data.map((item) => parseInt(item[">5%"])),
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

export default CellDistributionChart;
