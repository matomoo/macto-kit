import { isValid, parseISO } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import type { DateRange } from "react-day-picker";

export const extractCellName = (fullCellName: string): string => {
  if (!fullCellName || fullCellName.length < 7) {
    return fullCellName;
  }

  const firstPart = fullCellName.substring(2, 1) === "_" ? fullCellName.substring(2, 8) : fullCellName.substring(0, 6);
  const lastPart = fullCellName.substring(fullCellName.length - 4);
  return firstPart + lastPart;
};

export const calculateSuccessRate100 = (before: number, after: number): number => {
  if (Number(after.toFixed(2)) === Number(before.toFixed(2))) {
    return 0;
  }

  if (Number(after.toFixed(2)) > Number(before.toFixed(2))) {
    return ((Number(after.toFixed(2)) - Number(before.toFixed(2))) / (100 - Number(before.toFixed(2)))) * 100;
  }

  const delta = Number(after.toFixed(2)) - Number(before.toFixed(2));

  if (delta > -5) {
    return (delta / Number(before.toFixed(2))) * 100;
  }

  return (delta / Number(before.toFixed(2))) * 100;
};

export const calculateSuccessRate100_V2 = (before: number, after: number): number => {
  if (Number(after.toFixed(2)) === Number(before.toFixed(2))) {
    return 0;
  }

  const delta = Number(after.toFixed(2)) - Number(before.toFixed(2));

  return (delta / Number(before.toFixed(2))) * 100;
};

export const calculateSuccessRate0 = (before: number, after: number): number => {
  if (Number(Number(after.toFixed(2))) === Number(before.toFixed(2))) {
    return 0;
  }

  if (100 - Number(after.toFixed(2)) > 100 - Number(before.toFixed(2))) {
    return (
      ((100 - Number(after.toFixed(2)) - (100 - Number(before.toFixed(2)))) /
        (100 - (100 - Number(before.toFixed(2))))) *
      100
    );
  }

  const delta = 100 - Number(after.toFixed(2)) - (100 - Number(before.toFixed(2)));

  if (delta > -5) {
    return (delta / (100 - Number(before.toFixed(2)))) * 100;
  }

  return (delta / (100 - Number(before.toFixed(2)))) * 100;
};

export const calculateSuccessRate0_V2 = (before: number, after: number): number => {
  if (Number(Number(after.toFixed(2))) === Number(before.toFixed(2))) {
    return 0;
  }

  const delta = -(Number(after.toFixed(2)) - Number(before.toFixed(2)));

  return (delta / Number(before.toFixed(2))) * 100;
};

// prepare delete below
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "symbol",
  }).format(amount);
};

export const formatRupiahModel2 = (amount: number) => {
  return amount
    .toFixed(2) // Format to 2 decimal places
    .replace(/\d(?=(\d{3})+\.)/g, "$&.") // Add thousands separator (dot)
    .replace(/\.00$/, ""); // Remove .00 if there are no cents
};

export const formatDateForDisplay = (dateString: string) => {
  const timezone = "Asia/Makassar"; // Central Indonesia Time

  if (!dateString) return "";
  const date = toZonedTime(new Date(dateString), timezone);
  return format(date, "yyyy-MM-dd");
};

export const parseDateRange = (rangeString: string | null): DateRange | undefined => {
  if (!rangeString) return undefined;

  const [fromStr, toStr] = rangeString.split("|");
  if (!fromStr || !toStr) return undefined;

  try {
    const fromDate = parseISO(fromStr);
    const toDate = parseISO(toStr);

    if (!isValid(fromDate) || !isValid(toDate)) {
      console.error("Invalid date parsed:", fromStr, toStr);
      return undefined;
    }

    return {
      from: fromDate,
      to: toDate,
    };
  } catch (e) {
    console.error("Error parsing date range:", e);
    return undefined;
  }
};

export const extractBandFromCellName = (cellName: string): string => {
  if (!cellName || cellName.length < 4) return "XXX";

  // Extract MD from left(right(cellname,4),2)
  const lastFourChars = cellName.slice(-4);
  const bandCode = lastFourChars.slice(0, 2);
  // Map band codes to actual band names
  switch (bandCode) {
    case "MD":
      return "DCS";
    case "MG":
      return "GSM";
    default:
      return "XXX";
  }
};

export const extractBandFromCellName4G = (cellName: string): string => {
  if (!cellName || cellName.length < 4) return "XXX";

  // Extract MD from left(right(cellname,4),2)
  const lastFourChars = cellName.slice(-4);
  const bandCode = lastFourChars.slice(0, 2);
  // Map band codes to actual band names
  switch (bandCode) {
    case "ML":
      return "L1800";
    case "MT":
      return "L900";
    case "MR":
      return "L2100";
    case "ME":
      return "L2300";
    case "TE":
      return "L2300";
    case "MF":
      return "L2300";
    case "TF":
      return "L2300";
    default:
      return "XXX";
  }
};

// Band Indicator Component
export const BandIndicator = ({ band }: { band: string }) => {
  const getBandColor = (band: string) => {
    switch (band) {
      case "DCS":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "GSM":
        return "bg-green-100 text-green-800 border-green-200";
      case "XXX":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`ml-auto inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-xs ${getBandColor(band)}`}
    >
      {band}
    </span>
  );
};
