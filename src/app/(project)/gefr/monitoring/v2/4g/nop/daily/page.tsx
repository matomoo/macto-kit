"use client";

import { FilterBy_Date_Batch } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-batch";
import PageAggCustom4GDaily from "@/app/(project)/gefr/_component/gefr/ui-v2/agg-custom-4g-daily-v4";
import { TwH3 } from "@/app/(project)/gefr/_component/typography/typography";

export default function DashboardNopPage() {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-4">
      <TwH3 text="Monitoring 4G All NOP Level Daily" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_Batch />
      </div>
      <PageAggCustom4GDaily apiPath={"meas-dy-nop-4g"} aggregateBy="NOP" filterLabel="NOP" />
    </div>
  );
}
