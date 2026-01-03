import { create } from "zustand";
import { persist } from "zustand/middleware";

interface filterState {
  // State
  dateRange2: string | null;
  filter: string | null;
  siteId: string | null;
  nop: string | null;
  kabupaten: string | null;
  batch: string | null;

  // Actions
  setDateRange2: (range: string | null) => void;
  setFilter: (filter: string | null) => void;
  setSiteId: (siteId: string | null) => void;
  setNop: (nop: string | null) => void;
  setKabupaten: (kabupaten: string | null) => void;
  setBatch: (batch: string | null) => void;

  // Helper to get all params as object
  getParams: () => {
    dateRange2: string | null;
    filter: string | null;
    siteId: string | null;
    nop: string | null;
    kabupaten: string | null;
    batch: string | null;
  };
}

export const useFilterStore = create<filterState>()(
  persist(
    (set, get) => ({
      // Initial state
      dateRange2: null,
      filter: null,
      siteId: null,
      nop: null,
      kabupaten: null,
      batch: null,

      // Actions
      setDateRange2: (range) => set({ dateRange2: range }),
      setFilter: (filter) => set({ filter: filter }),
      setSiteId: (siteId) => set({ siteId: siteId }),
      setNop: (nop) => set({ nop: nop }),
      setKabupaten: (kabupaten) => set({ kabupaten: kabupaten }),
      setBatch: (batch) => set({ batch: batch }),

      // Helper function
      getParams: () => {
        const state = get();
        return {
          dateRange2: state.dateRange2,
          filter: state.filter,
          siteId: state.siteId,
          nop: state.nop,
          kabupaten: state.kabupaten,
          batch: state.batch,
        };
      },
    }),
    {
      name: "filter-storage", // LocalStorage key
      // Optional: you can skip persistence or use sessionStorage
      // storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
