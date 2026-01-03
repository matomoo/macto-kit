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
    const formattedTglBefore1 = subDays(formattedTglAfter1, 7);
    const formattedTglBefore2 = subDays(formattedTglAfter2, 7);
    const formattedTglBefore14D = subDays(formattedTglAfter2, 14);

    const queryNOP = `${nop.toUpperCase()}`;
    const queryKabupaten = `${kabupaten.toUpperCase()}`;
    const queryBatch = `%${batch}%`;

    const batchCondition = batch !== "All" ? sql`AND t2."Batch" LIKE ${queryBatch}` : sql``;

    const result = await db_gefrdb_suldbv1.execute<Agg4gModel>(sql`
      WITH RankedCells AS (
        SELECT
          t2."NOP",
          t2."KABUPATEN",
          t2."Site ID",
          concat (
          CASE
            WHEN SUBSTRING(t1."BTS Name" :: TEXT, 2, 1) IN ('_', '-') THEN
              SUBSTRING(t1."BTS Name" :: TEXT, 3, 6)
            ELSE
              SUBSTRING(t1."BTS Name" :: TEXT, 1, 6)
          END
          ,'_',
          RIGHT (t1."BTS Name", 4)
        ) AS cellname,
          SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END) AS traffic_before,
          SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END) AS traffic_after,
          (
            SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END) - SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END)
          ) AS traffic_delta,
          (
            SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END) - SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END)
          ) / NULLIF(SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END), 0) * 100 AS traffic_growth,
          CASE
            WHEN SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."Num TCH Availability_Ono" ELSE 0 END) > 0 THEN
              100
            ELSE
              0
          END AS availability_before,
          CASE
            WHEN SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."Num TCH Availability_Ono" ELSE 0 END) > 0 THEN
              100
            ELSE
              0
          END AS availability_after,
          (
            CASE
              WHEN SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."Num TCH Availability_Ono" ELSE 0 END) > 0 THEN
                100
              ELSE
                0
            END -
            CASE
              WHEN SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."Num TCH Availability_Ono" ELSE 0 END) > 0 THEN
                100
              ELSE
                0
            END
          ) AS availability_growth,
          ROW_NUMBER() OVER (PARTITION BY t2."KABUPATEN" ORDER BY 
            (SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END) - SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END))
            / NULLIF(SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END), 0) * 100 ASC) as row_num
        FROM
          "dy2G" t1
          INNER JOIN data_sid_nop_kabupaten t2 ON t2."Site ID" =
          CASE
            WHEN SUBSTRING(t1."BTS Name" :: TEXT, 2, 1) IN ('_', '-') THEN
              SUBSTRING(t1."BTS Name" :: TEXT, 3, 6)
            ELSE
              SUBSTRING(t1."BTS Name" :: TEXT, 1, 6)
          END
        WHERE
          (t2."NOP" = ${queryNOP} OR t2."KABUPATEN" = ${queryKabupaten})
          AND ((t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()}) OR (t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()}))
                  ${batchCondition}

        GROUP BY
          t2."NOP",
          t2."KABUPATEN",
          t2."Site ID",
          cellname
        HAVING
          (
            (
            SUM(CASE WHEN t1."Begin Time" >= ${formattedTglAfter1.toISOString()} AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END) - SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END)
          ) / NULLIF(SUM(CASE WHEN t1."Begin Time" >= ${formattedTglBefore1.toISOString()} AND t1."Begin Time" <= ${formattedTglBefore2.toISOString()} THEN t1."TCH Traffic (Erl)_ono" ELSE 0 END),0) * 100
          ) = -100
      )
      SELECT
        "NOP",
        "KABUPATEN",
        "Site ID",
        cellname,
        traffic_before,
        traffic_after,
        traffic_delta,
        traffic_growth,
        availability_before,
        availability_after,
        availability_growth,
        (
          SELECT MIN(t3."Begin Time")
          FROM "dy2G" t3
          WHERE concat (
          CASE
            WHEN SUBSTRING(t3."BTS Name" :: TEXT, 2, 1) IN ('_', '-') THEN
              SUBSTRING(t3."BTS Name" :: TEXT, 3, 6)
            ELSE
              SUBSTRING(t3."BTS Name" :: TEXT, 1, 6)
          END
          ,'_',
          RIGHT (t3."BTS Name", 4)
        ) = RankedCells.cellname
            AND t3."TCH Traffic (Erl)_ono" = 0
            AND t3."Begin Time" >= ${formattedTglBefore14D.toISOString()}
            AND t3."TCH Availability (%)_Ono" > 0
        ) AS zero_traffic_start_time
      FROM RankedCells
      WHERE row_num <= 10
      ORDER BY 
        "NOP",
        "KABUPATEN",
        row_num;
    `);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
