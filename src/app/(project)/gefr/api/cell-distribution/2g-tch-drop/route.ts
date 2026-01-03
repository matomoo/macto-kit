// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg4gModel } from "@/types/schema";
import { subDays } from "date-fns";
import { sql } from "drizzle-orm";

import { NextResponse } from "next/server";
import { db_gefrdb_suldbv1 } from "../../../_drizzle/db_gefr_suldb";

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
    if (isNaN(dateTgl1.getTime()) || isNaN(dateTgl2.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    // Calculate all dates
    const baseTanggal = subDays(dateTgl2, 0);
    const formattedTglAfter1 = subDays(baseTanggal, 2);
    const formattedTglAfter2 = subDays(baseTanggal, 0);
    const formattedTglBefore1 = subDays(formattedTglAfter1, 7);
    const formattedTglBefore2 = subDays(formattedTglAfter2, 7);
    const formattedTglBefore14D = subDays(formattedTglAfter2, 14);

    // console.log(formattedTglAfter1, formattedTglAfter2);

    const queryNOP = `%${nop.toUpperCase()}%`;
    const queryKabupaten = `${kabupaten.toUpperCase()}`;
    const queryBatch = `%${batch}%`;

    const batchCondition = batch !== "All" ? sql`AND t2."Batch" LIKE ${queryBatch}` : sql``;

    const result = await db_gefrdb_suldbv1.execute<Agg4gModel>(sql`
      SELECT
        t1."Begin Time",
        COUNT(CASE 
                WHEN (t1."TCH_Drop_num_ono" = 0 AND t1."TCH_Drop_denum_ono" = 0) THEN 1
                WHEN (t1."TCH_Drop_num_ono" :: DECIMAL / NULLIF (t1."TCH_Drop_denum_ono", 0) * 100) <= 2 THEN 1 
              END) AS "<2%",
        COUNT(CASE WHEN (t1."TCH_Drop_num_ono" :: DECIMAL / NULLIF (t1."TCH_Drop_denum_ono", 0) * 100) BETWEEN 2 AND 5 THEN 1 END) AS "2-5%",
        COUNT(CASE WHEN (t1."TCH_Drop_num_ono" :: DECIMAL / NULLIF (t1."TCH_Drop_denum_ono", 0) * 100) > 5 THEN 1 END) AS ">5%",
        COUNT(*) AS total_records
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
        (t1."Begin Time" >= '9/1/2025' AND t1."Begin Time" <= ${formattedTglAfter2.toISOString()})
        AND (t2."NOP" LIKE ${queryNOP} OR t2."KABUPATEN" = ${queryKabupaten})
        ${batchCondition}
      GROUP BY
        t1."Begin Time"
      ORDER BY
        t1."Begin Time";
    `);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
