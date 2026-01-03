// biome-ignore assist/source/organizeImports: <will fix later>
import type { Agg4gModel } from "@/types/schema";
import { db_gefrdb_suldbv1 } from "../../../_drizzle/db_gefr_suldb";
import { sql } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId") || "---";
  // const nop = searchParams.get("nop") || "---";
  // const kabupaten = searchParams.get("kabupaten") || "---";
  const tgl_1 = searchParams.get("tgl_1");
  const tgl_2 = searchParams.get("tgl_2");

  if (!tgl_1 || !tgl_2) {
    return NextResponse.json({ error: "Both tgl_1 and tgl_2 parameters are required" }, { status: 400 });
  }

  let formattedTgl1: string;
  let formattedTgl2: string;
  // const queryNOP = `%${nop.toUpperCase()}%`;
  const querySiteId = `%${siteId.toUpperCase()}%`;

  try {
    formattedTgl1 = new Date(tgl_1).toISOString();
    formattedTgl2 = new Date(tgl_2).toISOString();

    const result = await db_gefrdb_suldbv1.execute<Agg4gModel>(sql`
          SELECT
            t1."Begin Time" AS "BEGIN_TIME",
            t2."AREA" AS "AREA",
            t1."Cell Name" as "CELL_NAME",
            SUM("DL Traffic Volume (MByte) AMQ") / 1024 AS "DL_PAYLOAD_GB",
            SUM("UL Traffic Volume (MByte) AMQ") / 1024 AS "UL_PAYLOAD_GB",
            SUM("4G Payload (MByte) AMQ") / 1024 AS "TOTAL_PAYLOAD_GB",
            SUM("4G Payload (MByte) AMQ") / 1024 / 1024 AS "TOTAL_PAYLOAD_TB",
            SUM("Cell Availability Num 4G AMQ") AS "AVAILABILITY_NUM",
            SUM("Cell Availability Denum 4G AMQ") AS "AVAILABILITY_DENUM",
            SUM("User DL Throughput Num AMQ") AS "USER_DL_THP_NUM",
            SUM("User DL Throughput Denum AMQ") AS "USER_DL_THP_DENUM",
            SUM("User UL Throughput Num AMQ") AS "USER_UL_THP_NUM",
            SUM("User UL Throughput Denum AMQ") AS "USER_UL_THP_DENUM",
            SUM("Cell DL Throughput Num AMQ") AS "CELL_DL_THP_NUM",
            SUM("Cell DL Throughput Denum AMQ") AS "CELL_DL_THP_DENUM",
            SUM("Cell UL Throughput Num AMQ") AS "CELL_UL_THP_NUM",
            SUM("Cell UL Throughput Denum AMQ") AS "CELL_UL_THP_DENUM",
            SUM("CQI>=7 Num AMQ") AS "CQI_NUM",
            SUM("CQI>=7 Denum AMQ") AS "CQI_DENUM",
            AVG("CQI Average AMQ") AS "AVG_CQI",
            SUM("UL PRB Utilization Num AMQ") AS "UL_PRB_UTILIZATION_NUM",
            SUM("UL PRB Utilization Denum AMQ") AS "UL_PRB_UTILIZATION_DENUM",
            SUM("DL PRB Utilization Num AMQ") AS "DL_PRB_UTILIZATION_NUM",
            SUM("DL PRB Utilization Denum AMQ") AS "DL_PRB_UTILIZATION_DENUM",
            AVG("UL RB Available AMQ") AS "UL_RB_AVAILABLE",
            AVG("DL RB Available AMQ") AS "DL_RB_AVAILABLE",
            MAX("Maximum Number of RRC Connection User") AS "MAX_MAX_NUMBER_RRC_CONNECTION_USER",
            AVG("New Active Users rnp_Ono") AS "ACTIVE_USER",
            SUM("spectrum efficiency num") AS "SE_NUM",
            SUM("spectrum efficiency denum") AS "SE_DENUM",
            COUNT("Cell Name") AS "CELL_COUNT",
            '1' AS "DENUMBY1"
          FROM
            "hy4G" t1
            INNER JOIN data_sid_nop_kabupaten t2 ON
            CASE
              WHEN "substring" (t1."ManagedElement" :: TEXT, 2, 1) = '_' :: TEXT THEN
                "substring" (t1."ManagedElement" :: TEXT, 3, 6)
              WHEN "substring" (t1."ManagedElement" :: TEXT, 2, 1) = '-' :: TEXT THEN
                "substring" (t1."ManagedElement" :: TEXT, 3, 6)
              ELSE
                "substring" (t1."ManagedElement" :: TEXT, 1, 6)
            END = t2."Site ID"
          WHERE
            t1."Begin Time" >= ${formattedTgl1} :: TIMESTAMP
            AND t1."Begin Time" <= ${formattedTgl2} :: TIMESTAMP
            AND t1."Cell Name" like ${querySiteId}
          GROUP BY
            t1."Begin Time",
            t2."AREA",
            t1."Cell Name"
          ORDER BY
            t1."Begin Time",
            t1."Cell Name"
        `);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
