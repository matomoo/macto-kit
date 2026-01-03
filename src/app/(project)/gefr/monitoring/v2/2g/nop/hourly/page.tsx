"use client";

import { FilterBy_Date_Batch } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-batch";
import PageAggCustom2GHourlyV3 from "@/app/(project)/gefr/_component/gefr/ui-v2/agg-custom-2g-hourly-v3";
import { TwH3 } from "@/app/(project)/gefr/_component/typography/typography";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function DashboardNopPage() {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 p-4">
      <TwH3 text="Monitoring 2G NOP Level Hourly" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_Batch />
      </div>
      <PageAggCustom2GHourlyV3 area={"sul"} apiPath={"meas-hy-nop-2g"} aggregateBy="NOP" filterLabel="NOP" />
    </div>
  );
}
