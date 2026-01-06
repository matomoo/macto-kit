// components/column-layout-toggle.tsx
"use client";

// biome-ignore assist/source/organizeImports: <will fix later>
import { Grid, Grid3X3, LayoutGrid } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ColumnLayoutToggleProps {
  chartLayout: number;
  onLayoutChange: (layout: number) => void;
}

export function ColumnLayoutToggle({ chartLayout, onLayoutChange }: ColumnLayoutToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-sm">Layout:</span>
      <ToggleGroup
        type="single"
        value={chartLayout.toString()}
        onValueChange={(value) => value && onLayoutChange(parseInt(value, 10))}
        className="flex items-center rounded-lg border border-gray-200 bg-white p-1"
      >
        <ToggleGroupItem
          value="1"
          className="h-8 w-8 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
          title="1 Column"
        >
          <span className="flex items-center justify-center">
            <LayoutGrid size={16} />
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="2"
          className="h-8 w-8 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
          title="2 Columns"
        >
          <span className="flex items-center justify-center">
            <Grid size={16} />
          </span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="3"
          className="h-8 w-8 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700"
          title="3 Columns"
        >
          <span className="flex items-center justify-center">
            <Grid3X3 size={16} />
          </span>
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="text-gray-500 text-xs">
        {chartLayout} column{chartLayout > 1 ? "s" : ""}
      </div>
    </div>
  );
}
