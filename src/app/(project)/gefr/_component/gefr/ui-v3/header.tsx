// components/header.tsx
"use client";

import { Download, Filter } from "lucide-react";

interface HeaderProps {
  onExportData: () => void;
  onToggleMobileFilters: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ onExportData, onToggleMobileFilters, title, subtitle }: HeaderProps) {
  return (
    <div className="sticky top-0 z-30 border-b bg-white px-4 py-3 shadow-sm lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900 text-xl">{title || "2G Network Performance"}</h1>
          <p className="text-gray-600 text-sm">{subtitle || "Real-time metrics and analysis dashboard"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportData}
            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 lg:flex"
          >
            <Download size={16} />
            Export Data
          </button>
          <button
            type="button"
            onClick={onToggleMobileFilters}
            className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 lg:hidden"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
