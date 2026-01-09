"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { FilterBy_Date_Multi_SiteId } from "@/app/(project)/gefr/_component/filter-site/filter-by-date-multi-siteid";
import PageAggCustom2GDaily from "@/app/(project)/gefr/_component/gefr/ui-v3/agg-custom-2g-daily-v6";
import { TwH3 } from "@/app/(project)/gefr/_component/typography/typography";
import { useRequireAuth } from "@/hooks/use-require-auth";

export default function DashboardPage() {
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
      <TwH3 text="Monitoring 2G Cell Level Daily" />
      <div className="grid grid-cols-2 justify-between md:grid-cols-1">
        <FilterBy_Date_Multi_SiteId />
      </div>
      <PageAggCustom2GDaily
        area={"sul"}
        apiPath={"meas-dy-site-2g"}
        aggregateBy="BTS_NAME"
        filterLabel="BTS Name"
        columnNumber={2}
      />
    </div>
  );
}
