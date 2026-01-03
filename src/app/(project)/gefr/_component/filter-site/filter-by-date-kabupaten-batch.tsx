"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilterStore } from "@/stores/filterStore";
import { parseDateRange } from "../../_function/helper";

export function FilterBy_Date_Kabupaten_Batch() {
  // Default date range values
  const defaultFrom = subDays(new Date(), 7);
  const defaultTo = subDays(new Date(), 1);
  const defaultRangeString = `${format(defaultFrom, "yyyy-MM-dd")}|${format(defaultTo, "yyyy-MM-dd")}`;

  // Use Zustand store
  const { dateRange2, kabupaten, setDateRange2, setKabupaten, batch, setBatch } = useFilterStore();

  // Initialize dateRange state from Zustand store or defaults
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (dateRange2) {
      const parsed = parseDateRange(dateRange2);
      if (parsed) return parsed;
    }
    return {
      from: defaultFrom,
      to: defaultTo,
    };
  });

  // Track if we're in the process of selecting a range
  const [isSelecting, setIsSelecting] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Ensure Zustand store is updated with default date range on first load
  useEffect(() => {
    if (isFirstLoad) {
      // If dateRange2 is not set in store, set it with default value
      if (!dateRange2) {
        setDateRange2(defaultRangeString);
        console.log("Setting default date range in store:", defaultRangeString);
      }

      setIsFirstLoad(false);
    }
  }, [isFirstLoad, dateRange2, setDateRange2, defaultRangeString]);

  // Handler to update dateRange state and Zustand store
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      setDateRange(undefined);
      setIsSelecting(false);
      setDateRange2(null);
      return;
    }

    // If both dates are selected
    if (range.from && range.to) {
      setDateRange(range);
      const rangeString = `${format(range.from, "yyyy-MM-dd")}|${format(range.to, "yyyy-MM-dd")}`;
      setDateRange2(rangeString);
      setIsSelecting(false);
    }
    // If only from date is selected
    else if (range.from && !range.to) {
      setDateRange({ from: range.from, to: undefined });
      setIsSelecting(true);
    }
  };

  // Handler for NOP change - update Zustand store only
  const handleKabupatenChange = (value: string) => {
    setKabupaten(value || null);
  };

  const handleBatchChange = (value: string) => {
    setBatch(value || null);
  };

  // Update dateRange if Zustand store changes externally
  useEffect(() => {
    if (dateRange2) {
      const parsedRange = parseDateRange(dateRange2);
      if (parsedRange) {
        setDateRange(parsedRange);
      }
    } else {
      setDateRange(undefined);
    }
  }, [dateRange2]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">Date Range</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-70 justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                defaultMonth={dateRange?.from || new Date()}
                numberOfMonths={2}
              />
              {isSelecting && (
                <div className="border-t p-2 text-center text-muted-foreground text-xs">
                  Select end date to complete range selection
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">Filter By Kabupaten</div>
          <Select value={kabupaten ?? undefined} onValueChange={handleKabupatenChange}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ASMAT">ASMAT</SelectItem>
              <SelectItem value="BANGGAI">BANGGAI</SelectItem>
              <SelectItem value="BANGGAI KEPULAUAN">BANGGAI KEPULAUAN</SelectItem>
              <SelectItem value="BANGGAI LAUT">BANGGAI LAUT</SelectItem>
              <SelectItem value="BANTAENG">BANTAENG</SelectItem>
              <SelectItem value="BARRU">BARRU</SelectItem>
              <SelectItem value="BIAK NUMFOR">BIAK NUMFOR</SelectItem>
              <SelectItem value="BOALEMO">BOALEMO</SelectItem>
              <SelectItem value="BOLAANG MONGONDOW">BOLAANG MONGONDOW</SelectItem>
              <SelectItem value="BOLAANG MONGONDOW SELATAN">BOLAANG MONGONDOW SELATAN</SelectItem>
              <SelectItem value="BOLAANG MONGONDOW TIMUR">BOLAANG MONGONDOW TIMUR</SelectItem>
              <SelectItem value="BOLAANG MONGONDOW UTARA">BOLAANG MONGONDOW UTARA</SelectItem>
              <SelectItem value="BOMBANA">BOMBANA</SelectItem>
              <SelectItem value="BONE">BONE</SelectItem>
              <SelectItem value="BONE BOLANGO">BONE BOLANGO</SelectItem>
              <SelectItem value="BOVEN DIGOEL">BOVEN DIGOEL</SelectItem>
              <SelectItem value="BULUKUMBA">BULUKUMBA</SelectItem>
              <SelectItem value="BUOL">BUOL</SelectItem>
              <SelectItem value="BURU">BURU</SelectItem>
              <SelectItem value="BURU SELATAN">BURU SELATAN</SelectItem>
              <SelectItem value="BUTON">BUTON</SelectItem>
              <SelectItem value="BUTON SELATAN">BUTON SELATAN</SelectItem>
              <SelectItem value="BUTON TENGAH">BUTON TENGAH</SelectItem>
              <SelectItem value="BUTON UTARA">BUTON UTARA</SelectItem>
              <SelectItem value="DEIYAI">DEIYAI</SelectItem>
              <SelectItem value="DOGIYAI">DOGIYAI</SelectItem>
              <SelectItem value="DONGGALA">DONGGALA</SelectItem>
              <SelectItem value="ENREKANG">ENREKANG</SelectItem>
              <SelectItem value="FAKFAK">FAKFAK</SelectItem>
              <SelectItem value="GORONTALO">GORONTALO</SelectItem>
              <SelectItem value="GORONTALO UTARA">GORONTALO UTARA</SelectItem>
              <SelectItem value="GOWA">GOWA</SelectItem>
              <SelectItem value="HALMAHERA BARAT">HALMAHERA BARAT</SelectItem>
              <SelectItem value="HALMAHERA SELATAN">HALMAHERA SELATAN</SelectItem>
              <SelectItem value="HALMAHERA TENGAH">HALMAHERA TENGAH</SelectItem>
              <SelectItem value="HALMAHERA TIMUR">HALMAHERA TIMUR</SelectItem>
              <SelectItem value="HALMAHERA UTARA">HALMAHERA UTARA</SelectItem>
              <SelectItem value="INTAN JAYA">INTAN JAYA</SelectItem>
              <SelectItem value="JAYAPURA">JAYAPURA</SelectItem>
              <SelectItem value="JAYAWIJAYA">JAYAWIJAYA</SelectItem>
              <SelectItem value="JENEPONTO">JENEPONTO</SelectItem>
              <SelectItem value="KAIMANA">KAIMANA</SelectItem>
              <SelectItem value="KEEROM">KEEROM</SelectItem>
              <SelectItem value="KEPULAUAN ARU">KEPULAUAN ARU</SelectItem>
              <SelectItem value="KEPULAUAN SANGIHE">KEPULAUAN SANGIHE</SelectItem>
              <SelectItem value="KEPULAUAN SELAYAR">KEPULAUAN SELAYAR</SelectItem>
              <SelectItem value="KEPULAUAN SULA">KEPULAUAN SULA</SelectItem>
              <SelectItem value="KEPULAUAN TALAUD">KEPULAUAN TALAUD</SelectItem>
              <SelectItem value="KEPULAUAN TANIMBAR">KEPULAUAN TANIMBAR</SelectItem>
              <SelectItem value="KEPULAUAN YAPEN">KEPULAUAN YAPEN</SelectItem>
              <SelectItem value="KOLAKA">KOLAKA</SelectItem>
              <SelectItem value="KOLAKA TIMUR">KOLAKA TIMUR</SelectItem>
              <SelectItem value="KOLAKA UTARA">KOLAKA UTARA</SelectItem>
              <SelectItem value="KONAWE">KONAWE</SelectItem>
              <SelectItem value="KONAWE KEPULAUAN">KONAWE KEPULAUAN</SelectItem>
              <SelectItem value="KONAWE SELATAN">KONAWE SELATAN</SelectItem>
              <SelectItem value="KONAWE UTARA">KONAWE UTARA</SelectItem>
              <SelectItem value="KOTA AMBON">KOTA AMBON</SelectItem>
              <SelectItem value="KOTA BAUBAU">KOTA BAUBAU</SelectItem>
              <SelectItem value="KOTA BITUNG">KOTA BITUNG</SelectItem>
              <SelectItem value="KOTA GORONTALO">KOTA GORONTALO</SelectItem>
              <SelectItem value="KOTA JAYAPURA">KOTA JAYAPURA</SelectItem>
              <SelectItem value="KOTA KENDARI">KOTA KENDARI</SelectItem>
              <SelectItem value="KOTA KOTAMOBAGU">KOTA KOTAMOBAGU</SelectItem>
              <SelectItem value="KOTA MAKASSAR">KOTA MAKASSAR</SelectItem>
              <SelectItem value="KOTA MANADO">KOTA MANADO</SelectItem>
              <SelectItem value="KOTA PALOPO">KOTA PALOPO</SelectItem>
              <SelectItem value="KOTA PALU">KOTA PALU</SelectItem>
              <SelectItem value="KOTA PARE-PARE">KOTA PARE-PARE</SelectItem>
              <SelectItem value="KOTA SORONG">KOTA SORONG</SelectItem>
              <SelectItem value="KOTA TERNATE">KOTA TERNATE</SelectItem>
              <SelectItem value="KOTA TIDORE KEPULAUAN">KOTA TIDORE KEPULAUAN</SelectItem>
              <SelectItem value="KOTA TOMOHON">KOTA TOMOHON</SelectItem>
              <SelectItem value="KOTA TUAL">KOTA TUAL</SelectItem>
              <SelectItem value="LANNY JAYA">LANNY JAYA</SelectItem>
              <SelectItem value="LUWU">LUWU</SelectItem>
              <SelectItem value="LUWU TIMUR">LUWU TIMUR</SelectItem>
              <SelectItem value="LUWU UTARA">LUWU UTARA</SelectItem>
              <SelectItem value="MAJENE">MAJENE</SelectItem>
              <SelectItem value="MALUKU BARAT DAYA">MALUKU BARAT DAYA</SelectItem>
              <SelectItem value="MALUKU TENGAH">MALUKU TENGAH</SelectItem>
              <SelectItem value="MALUKU TENGGARA">MALUKU TENGGARA</SelectItem>
              <SelectItem value="MAMASA">MAMASA</SelectItem>
              <SelectItem value="MAMBERAMO RAYA">MAMBERAMO RAYA</SelectItem>
              <SelectItem value="MAMBERAMO TENGAH">MAMBERAMO TENGAH</SelectItem>
              <SelectItem value="MAMUJU">MAMUJU</SelectItem>
              <SelectItem value="MAMUJU TENGAH">MAMUJU TENGAH</SelectItem>
              <SelectItem value="MAMUJU UTARA">MAMUJU UTARA</SelectItem>
              <SelectItem value="MANOKWARI">MANOKWARI</SelectItem>
              <SelectItem value="MANOKWARI SELATAN">MANOKWARI SELATAN</SelectItem>
              <SelectItem value="MAPPI">MAPPI</SelectItem>
              <SelectItem value="MAROS">MAROS</SelectItem>
              <SelectItem value="MAYBRAT">MAYBRAT</SelectItem>
              <SelectItem value="MERAUKE">MERAUKE</SelectItem>
              <SelectItem value="MIMIKA">MIMIKA</SelectItem>
              <SelectItem value="MINAHASA">MINAHASA</SelectItem>
              <SelectItem value="MINAHASA SELATAN">MINAHASA SELATAN</SelectItem>
              <SelectItem value="MINAHASA TENGGARA">MINAHASA TENGGARA</SelectItem>
              <SelectItem value="MINAHASA UTARA">MINAHASA UTARA</SelectItem>
              <SelectItem value="MOROWALI">MOROWALI</SelectItem>
              <SelectItem value="MOROWALI UTARA">MOROWALI UTARA</SelectItem>
              <SelectItem value="MUNA">MUNA</SelectItem>
              <SelectItem value="MUNA BARAT">MUNA BARAT</SelectItem>
              <SelectItem value="NABIRE">NABIRE</SelectItem>
              <SelectItem value="NDUGA">NDUGA</SelectItem>
              <SelectItem value="PANGKAJENE DAN KEPULAUAN">PANGKAJENE DAN KEPULAUAN</SelectItem>
              <SelectItem value="PANIAI">PANIAI</SelectItem>
              <SelectItem value="PARIGI MOUTONG">PARIGI MOUTONG</SelectItem>
              <SelectItem value="PEGUNUNGAN ARFAK">PEGUNUNGAN ARFAK</SelectItem>
              <SelectItem value="PEGUNUNGAN BINTANG">PEGUNUNGAN BINTANG</SelectItem>
              <SelectItem value="PINRANG">PINRANG</SelectItem>
              <SelectItem value="POHUWATO">POHUWATO</SelectItem>
              <SelectItem value="POLEWALI MANDAR">POLEWALI MANDAR</SelectItem>
              <SelectItem value="POSO">POSO</SelectItem>
              <SelectItem value="PULAU MOROTAI">PULAU MOROTAI</SelectItem>
              <SelectItem value="PULAU TALIABU">PULAU TALIABU</SelectItem>
              <SelectItem value="PUNCAK">PUNCAK</SelectItem>
              <SelectItem value="PUNCAK JAYA">PUNCAK JAYA</SelectItem>
              <SelectItem value="RAJA AMPAT">RAJA AMPAT</SelectItem>
              <SelectItem value="SARMI">SARMI</SelectItem>
              <SelectItem value="SERAM BAGIAN BARAT">SERAM BAGIAN BARAT</SelectItem>
              <SelectItem value="SERAM BAGIAN TIMUR">SERAM BAGIAN TIMUR</SelectItem>
              <SelectItem value="SIAU TAGULANDANG BIARO">SIAU TAGULANDANG BIARO</SelectItem>
              <SelectItem value="SIDENRENG RAPPANG">SIDENRENG RAPPANG</SelectItem>
              <SelectItem value="SIGI">SIGI</SelectItem>
              <SelectItem value="SINJAI">SINJAI</SelectItem>
              <SelectItem value="SOPPENG">SOPPENG</SelectItem>
              <SelectItem value="SORONG">SORONG</SelectItem>
              <SelectItem value="SORONG SELATAN">SORONG SELATAN</SelectItem>
              <SelectItem value="SUPIORI">SUPIORI</SelectItem>
              <SelectItem value="TAKALAR">TAKALAR</SelectItem>
              <SelectItem value="TAMBRAUW">TAMBRAUW</SelectItem>
              <SelectItem value="TANA TORAJA">TANA TORAJA</SelectItem>
              <SelectItem value="TELUK BINTUNI">TELUK BINTUNI</SelectItem>
              <SelectItem value="TELUK WONDAMA">TELUK WONDAMA</SelectItem>
              <SelectItem value="TOJO UNA-UNA">TOJO UNA-UNA</SelectItem>
              <SelectItem value="TOLIKARA">TOLIKARA</SelectItem>
              <SelectItem value="TOLI-TOLI">TOLI-TOLI</SelectItem>
              <SelectItem value="TORAJA UTARA">TORAJA UTARA</SelectItem>
              <SelectItem value="WAJO">WAJO</SelectItem>
              <SelectItem value="WAKATOBI">WAKATOBI</SelectItem>
              <SelectItem value="WAROPEN">WAROPEN</SelectItem>
              <SelectItem value="YAHUKIMO">YAHUKIMO</SelectItem>
              <SelectItem value="YALIMO">YALIMO</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">Filter By Batch</div>
          <Select value={batch ?? undefined} onValueChange={handleBatchChange}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Batch2">Batch2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
