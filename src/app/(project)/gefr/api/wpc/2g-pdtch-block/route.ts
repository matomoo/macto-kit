// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg4gModel } from "@/types/schema";
import { db_gefrdb_suldbv1 } from "../../../_drizzle/db_gefr_suldb";
import { subDays } from "date-fns";
import { sql } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nop = searchParams.get("nop") || "---";
  const kabupaten = searchParams.get("kabupaten") || "---";
  const batch = searchParams.get("batch") || "All";

  const tgl_1 = searchParams.get("tgl_1");
  const tgl_2 = searchParams.get("tgl_2");

  if (!tgl_1 || !tgl_2) {
    return NextResponse.json({ error: "Both tgl_1 and tgl_2 parameters are required" }, { status: 400 });
  }

  try {
    // Parse the input dates
    const dateTgl1 = new Date(tgl_1);
    const dateTgl2 = new Date(tgl_2);

    // Validate dates
    if (Number.isNaN(dateTgl1.getTime()) || Number.isNaN(dateTgl2.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Calculate all dates
    const baseTanggal = subDays(dateTgl2, 0);
    const formattedTglAfter1 = subDays(baseTanggal, 2);
    const formattedTglAfter2 = subDays(baseTanggal, 0);
    // const formattedTglBefore1 = subDays(formattedTglAfter1, 7);
    // const formattedTglBefore2 = subDays(formattedTglAfter2, 7);
    // const formattedTglBefore14D = subDays(formattedTglAfter2, 14);

    const queryNOP = `%${nop.toUpperCase()}%`;
    const queryKabupaten = `${kabupaten.toUpperCase()}`;
    const queryBatch = `%${batch}%`;

    const batchCondition = batch !== "All" ? sql`AND t2."Batch" LIKE ${queryBatch}` : sql``;

    const result = await db_gefrdb_suldbv1.execute<Agg4gModel>(sql`
      SELECT
        t2."AREA",
        t2."NOP",
        t2."KABUPATEN",
        CASE
          WHEN "substring" (t1."BTS Name" :: TEXT, 2, 1) = '_' :: TEXT THEN
            "substring" (t1."BTS Name" :: TEXT, 3, 6)
          WHEN "substring" (t1."BTS Name" :: TEXT, 2, 1) = '-' :: TEXT THEN
            "substring" (t1."BTS Name" :: TEXT, 3, 6)
          ELSE
            "substring" (t1."BTS Name" :: TEXT, 1, 6)
        END as "SITEID",
        t1."BTS Name",
        t1."SubnetWork ID",
        t1."SITE ID",
        t1."BTS ID",
        (SUM(t1."PDTCH Congestion Rate (%)_denum") - SUM(t1."PDTCH Congestion Rate (%)_num")) AS "PDTCH_CONGESTION_FAIL_NUM",
        (SUM(t1."PDTCH Congestion Rate (%)_num") / NULLIF(SUM(t1."PDTCH Congestion Rate (%)_denum"),0) * 100 ) AS "PDTCH_CONGESTION_SR",
        (SUM(t1."SDCCH_Block_num_ono") / NULLIF(SUM(t1."SDCCH_Block_denum_ono"),0) * 100 ) AS "SD_BLOCK_SR",
        (SUM(t1."TCH_Block_num_ono") / NULLIF(SUM(t1."TCH_Block_denum_ono"),0) * 100 ) AS "TCH_BLOCK_SR",        
        (SUM(t1."Num TCH Availability_Ono") / NULLIF(SUM(t1."Denum TCH Availability_ono"),0) * 100) AS "TCH_AVAIL_SR",
        (AVG(t1."Number of SDCCH") / 8) as "NUMBER_SDCCH",
        AVG(t1."Number of TCH") as "NUMBER_TCH",
        AVG(t1."Number of Static PDTCH") as "NUMBER_STATIC_PDTCH",
        AVG(t1."Number of dynamic PDTCH") as "NUMBER_DYNAMIC_PDTCH"
      FROM
        "dy2G" t1
        INNER JOIN data_sid_nop_kabupaten t2 ON
        CASE
          WHEN "substring" (t1."BTS Name" :: TEXT, 2, 1) = '_' :: TEXT THEN
            "substring" (t1."BTS Name" :: TEXT, 3, 6)
          WHEN "substring" (t1."BTS Name" :: TEXT, 2, 1) = '-' :: TEXT THEN
            "substring" (t1."BTS Name" :: TEXT, 3, 6)
          ELSE
            "substring" (t1."BTS Name" :: TEXT, 1, 6)
        END = t2."Site ID"
      WHERE
        (t1."Begin Time" >= ${formattedTglAfter1.toISOString()}
        AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()})
        AND 
        (t2."NOP" LIKE ${queryNOP} OR t2."KABUPATEN" = ${queryKabupaten})
        ${batchCondition}
      GROUP BY
        t2."AREA",
        t2."NOP",
        t2."KABUPATEN",
        t1."BTS Name",
        t1."SubnetWork ID",
        t1."SITE ID",
        t1."BTS ID"
      HAVING
        (SUM(t1."PDTCH Congestion Rate (%)_num") / NULLIF(SUM(t1."PDTCH Congestion Rate (%)_denum"),0) * 100 ) > 5
      ORDER BY
        (SUM(t1."PDTCH Congestion Rate (%)_denum") - SUM(t1."PDTCH Congestion Rate (%)_num")) DESC
      LIMIT 20;
    `);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
