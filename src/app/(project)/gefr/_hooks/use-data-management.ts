// hooks/use-data-management.ts
// biome-ignore assist/source/organizeImports: <will fix later>
import { useState, useMemo, useEffect } from "react";
import type { Agg2gModel } from "@/types/schema";
import { extractBandFromCellName, extractCellName } from "../_function/helper";

interface UseDataManagementProps {
  data: { rows: Agg2gModel[] } | undefined;
  aggregateBy: string;
}

export function useDataManagement({ data, aggregateBy }: UseDataManagementProps) {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [allCells, setAllCells] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [allSectors, setAllSectors] = useState<string[]>([]);
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [allBands, setAllBands] = useState<string[]>([]);

  // Search states
  const [cellSearch, setCellSearch] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [bandSearch, setBandSearch] = useState("");

  useEffect(() => {
    if (data?.rows && data.rows.length > 0) {
      const uniqueCells: string[] = Array.from(
        new Set(
          data.rows.map((item: Agg2gModel) =>
            aggregateBy.includes("BTS")
              ? extractCellName(String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"))
              : String(item[aggregateBy as keyof Agg2gModel] ?? "Unknown"),
          ),
        ),
      ).sort() as string[];

      setAllCells(uniqueCells);
      setSelectedCells(uniqueCells);

      const uniqueSectors: string[] = Array.from(
        new Set(uniqueCells.map((cellName) => cellName.slice(-1))),
      ).sort() as string[];

      setAllSectors(uniqueSectors);
      setSelectedSectors(uniqueSectors);

      const uniqueBands: string[] = Array.from(
        new Set(uniqueCells.map((cellName) => extractBandFromCellName(cellName))),
      ).sort() as string[];

      setAllBands(uniqueBands);
      setSelectedBands(uniqueBands);
    } else {
      setAllCells([]);
      setSelectedCells([]);
      setAllSectors([]);
      setSelectedSectors([]);
      setAllBands([]);
      setSelectedBands([]);
    }
  }, [data, aggregateBy]);

  const filteredCells = useMemo(
    () => allCells.filter((cell) => cell.toLowerCase().includes(cellSearch.toLowerCase())),
    [allCells, cellSearch],
  );

  const filteredSectors = useMemo(
    () => allSectors.filter((sector) => sector.toLowerCase().includes(sectorSearch.toLowerCase())),
    [allSectors, sectorSearch],
  );

  const filteredBands = useMemo(
    () => allBands.filter((band) => band.toLowerCase().includes(bandSearch.toLowerCase())),
    [allBands, bandSearch],
  );

  const handleCellSelection = (cellName: string) => {
    setSelectedCells((prev) => {
      if (prev.includes(cellName)) {
        return prev.filter((cell) => cell !== cellName);
      }
      return [...prev, cellName];
    });
  };

  const handleSectorSelection = (sector: string) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sector)) {
        return prev.filter((s) => s !== sector);
      }
      return [...prev, sector];
    });
  };

  const handleBandsSelection = (band: string) => {
    setSelectedBands((prev) => {
      if (prev.includes(band)) {
        return prev.filter((s) => s !== band);
      }
      return [...prev, band];
    });
  };

  const selectAllCells = () => {
    setSelectedCells([...allCells]);
  };

  const clearAllCells = () => {
    setSelectedCells([]);
  };

  const selectAllSectors = () => {
    setSelectedSectors([...allSectors]);
  };

  const clearAllSectors = () => {
    setSelectedSectors([]);
  };

  const selectAllBands = () => {
    setSelectedBands([...allBands]);
  };

  const clearAllBands = () => {
    setSelectedBands([]);
  };

  return {
    // State
    selectedCells,
    allCells,
    selectedSectors,
    allSectors,
    selectedBands,
    allBands,
    cellSearch,
    sectorSearch,
    bandSearch,
    filteredCells,
    filteredSectors,
    filteredBands,

    // Setters
    setCellSearch,
    setSectorSearch,
    setBandSearch,

    // Handlers
    handleCellSelection,
    handleSectorSelection,
    handleBandsSelection,
    selectAllCells,
    clearAllCells,
    selectAllSectors,
    clearAllSectors,
    selectAllBands,
    clearAllBands,
  };
}
