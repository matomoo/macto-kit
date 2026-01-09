"use client";

import { FilterBy_Date_SiteId } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-siteid";
import PageAggCustom4GDaily from "@/app/(project)/gefr/_component/gefr/ui-v3/agg-custom-4g-daily-v5";
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
      <TwH3 text="Monitoring 4G Site Level Daily" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_SiteId />
      </div>
      <PageAggCustom4GDaily apiPath={"meas-dy-site-4g"} aggregateBy="CELL_NAME" filterLabel="Cell Name" />
    </div>
  );
}
