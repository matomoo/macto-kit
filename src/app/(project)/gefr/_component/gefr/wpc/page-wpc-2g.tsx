// biome-ignore assist/source/organizeImports: <will fix later>
import WpcZeroTraffic2g from "./wpc-2g-zero-traffic";
import Wpc2gSdBlock from "./wpc-2g-sd-block";
import Wpc2gTchBlock from "./wpc-2g-tch-block";
import Wpc2gPdtchBlock from "./wpc-2g-pdtch-block";
import Wpc2gTchDrop from "./wpc-2g-tch-drop";
import Wpc2gHosr from "./wpc-2g-hosr";
import { subDays } from "date-fns";
import { useFilterStore } from "@/stores/filterStore";
import { formatDateForDisplay } from "../../../_function/helper";

const PageWpc2g = ({ level }: { level: string }) => {
  const { dateRange2, filter, siteId, nop, kabupaten } = useFilterStore();
  const baseTanggal = subDays(new Date(dateRange2?.split("|")[1] ?? new Date()), 0);
  const formattedTglAfter1 = subDays(baseTanggal, 2);
  const formattedTglAfter2 = subDays(baseTanggal, 0);
  const formattedTglBefore1 = subDays(formattedTglAfter1, 7);
  const formattedTglBefore2 = subDays(formattedTglAfter2, 7);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="py-4 text-center">
        <div className="inline-flex items-center rounded-lg border border-orange-200 bg-orange-100 px-4 py-2">
          <svg className="mr-2 h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>wpc</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium text-orange-700">
            WPC Date Range : {formatDateForDisplay(formattedTglBefore1.toLocaleDateString())} -{" "}
            {formatDateForDisplay(formattedTglBefore2.toLocaleDateString())} |{" "}
            {formatDateForDisplay(formattedTglAfter1.toLocaleDateString())} -{" "}
            {formatDateForDisplay(formattedTglAfter2.toLocaleDateString())}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <WpcZeroTraffic2g title={"WPC Zero Traffic"} level={level} />
        <Wpc2gSdBlock title={"WPC SD Blocking"} level={level} />
        <Wpc2gTchBlock title={"WPC TCH Blocking"} level={level} />
        <Wpc2gPdtchBlock title={"WPC PDTCH Blocking"} level={level} />
        <Wpc2gTchDrop title={"WPC TCH Drop"} level={level} />
        <Wpc2gHosr title={"WPC HOSR"} level={level} />
      </div>
    </div>
  );
};

export default PageWpc2g;
