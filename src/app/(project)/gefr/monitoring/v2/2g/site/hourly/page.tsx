"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { FilterBy_Date_SiteId } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-siteid";
import PageAggCustom2GHourlyV3 from "@/app/(project)/gefr/_component/gefr/ui-v2/agg-custom-2g-hourly-v3";
import { TwH3 } from "@/app/(project)/gefr/_component/typography/typography";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-4">
      <TwH3 text="Monitoring 2G Cell Level Hourly" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_SiteId />
      </div>
      <PageAggCustom2GHourlyV3
        area={"sul"}
        apiPath={"meas-hy-site-2g"}
        aggregateBy="BTS_NAME"
        filterLabel="BTS Name"
        columnNumber={3}
      />
    </div>
  );
}
