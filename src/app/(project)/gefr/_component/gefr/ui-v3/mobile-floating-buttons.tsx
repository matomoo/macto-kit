// components/mobile-floating-buttons.tsx
"use client";

import { Download, Filter } from "lucide-react";

interface MobileFloatingButtonsProps {
  onExportData: () => void;
  onToggleMobileFilters: () => void;
}

export function MobileFloatingButtons({ onExportData, onToggleMobileFilters }: MobileFloatingButtonsProps) {
  return (
    <div className="fixed right-4 bottom-4 z-20 lg:hidden">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={onExportData}
          className="flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
          title="Export all data"
        >
          <Download size={20} />
        </button>
        <button
          type="button"
          onClick={onToggleMobileFilters}
          className="flex items-center justify-center rounded-full bg-white p-4 text-gray-700 shadow-lg hover:bg-gray-50"
          title="Toggle filters"
        >
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
}
