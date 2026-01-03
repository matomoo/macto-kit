"use client";

import { FilterBy_Date_SiteId } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-siteid";
import PageAggCustom4GHourly from "@/app/(project)/gefr/_component/gefr/ui-v2/agg-custom-4g-hourly-v3";
import { TwH3 } from "@/app/(project)/gefr/_component/typography/typography";

export default function DashboardNopPage() {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-4">
      <TwH3 text="Monitoring 4G Site Level Hourly" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_SiteId />
      </div>
      <PageAggCustom4GHourly area={"sul"} apiPath={"meas-hy-site-4g"} aggregateBy="CELL_NAME" filterLabel="Cell Name" />
    </div>
  );
}
