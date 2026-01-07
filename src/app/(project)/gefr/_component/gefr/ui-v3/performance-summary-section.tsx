"use client";

// biome-ignore assist/source/organizeImports: <will fix later>
import { ChevronDown, ChevronUp } from "lucide-react";
import TableComparison2GDaily from "./table-comparison-2g-daily-v3";
import type { Agg2gModel } from "@/types/schema";

interface PerformanceSummarySectionProps {
  metrics: {
    productivity: { value: number; percentage: string };
    tchTraffic: { value: number; percentage: string };
    totalPayload: { value: number; percentage: string };
  };
  filteredData: Agg2gModel[];
  filterBy: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function PerformanceSummaryToggle({ isExpanded, onToggle }: { isExpanded: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
    >
      {isExpanded ? (
        <>
          <ChevronUp size={16} />
          <span>Collapse Summary</span>
        </>
      ) : (
        <>
          <ChevronDown size={16} />
          <span>Expand Summary</span>
        </>
      )}
    </button>
  );
}

export function SummaryCard({
  title,
  value,
  data,
  description,
  color = "blue",
}: {
  title: string;
  value: string;
  data?: Agg2gModel[];
  description: string;
  color?: "blue" | "green" | "purple";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  const label = {
    blue: "Prod",
    green: "Traffic",
    purple: "Payload",
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-500 text-sm">{title}</div>
          <div className="mt-1 font-bold text-2xl text-gray-900">{value}</div>
        </div>
        <div className={`rounded-full p-2 ${colorClasses[color]}`}>
          <div className="font-semibold text-sm">{label[color]}</div>
        </div>
      </div>
      <div className="mt-2 text-gray-500 text-xs">{description}</div>
    </div>
  );
}

export function PerformanceSummarySection({
  metrics,
  filteredData,
  filterBy,
  isExpanded,
  onToggle,
}: PerformanceSummarySectionProps) {
  const getFilterLabel = () => {
    switch (filterBy) {
      case "cell":
        return "cells";
      case "sector":
        return "sectors";
      case "band":
        return "bands";
      default:
        return "items";
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900 text-lg">Performance Summary</h2>
          <PerformanceSummaryToggle isExpanded={isExpanded} onToggle={onToggle} />
        </div>
        <div className="text-gray-500 text-sm">
          {isExpanded ? `Showing ${filteredData.length} records` : "Summary view"}
        </div>
      </div>

      {isExpanded ? (
        // Expanded view - show full table
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <TableComparison2GDaily data={filteredData} />
        </div>
      ) : (
        // Collapsed view - show summary cards
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            title="Productivity"
            value={metrics.productivity.percentage}
            data={filteredData}
            description={`Based on selected ${getFilterLabel()}`}
            color="blue"
          />
          <SummaryCard
            title="TCH Traffic (Erl)"
            value={metrics.tchTraffic.percentage}
            description="Average TCH traffic across all selected items"
            color="green"
          />
          <SummaryCard
            title="Total Payload (MB)"
            value={metrics.totalPayload.percentage}
            description="Average data payload across all selected items"
            color="purple"
          />
        </div>
      )}
    </div>
  );
}

// Optional: Default export if you prefer
export default PerformanceSummarySection;
