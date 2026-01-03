import { NextResponse } from "next/server";

import { sql } from "drizzle-orm";

import type { Agg2gModel } from "@/types/schema";

import { db_gefrdb_suldbv1 } from "../../../_drizzle/db_gefr_suldb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId") || "---";
  const tgl_1 = searchParams.get("tgl_1");
  const tgl_2 = searchParams.get("tgl_2");

  if (!tgl_1 || !tgl_2) {
    return NextResponse.json({ error: "Both tgl_1 and tgl_2 parameters are required" }, { status: 400 });
  }

  let formattedTgl1: string;
  let formattedTgl2: string;
  const querySiteId = `%${siteId}%`;

  try {
    formattedTgl1 = new Date(tgl_1).toISOString();
    formattedTgl2 = new Date(tgl_2).toISOString();

    const result = await db_gefrdb_suldbv1.execute<Agg2gModel>(sql`
          SELECT
            t1."Begin Time" AS "BEGIN_TIME",
            'GEFR' AS "AREA",
            t1."BTS Name" AS "BTS_NAME",
            SUM(t1."SDCCH Traffic (Erl)_ono") AS "SDCCH_TRAFFIC_ERL",
            SUM(t1."TCH Traffic (Erl)_ono") AS "TCH_TRAFFIC_ERL",
            SUM(t1."EDGE Payload (Mbyte)_ono") AS "EDGE_PAYLOAD_MB",
            SUM(t1."GPRS Payload (Mbyte)_ono") AS "GPRS_PAYLOAD_MB",
            SUM(t1."EDGE Payload (Mbyte)_ono") + SUM(t1."GPRS Payload (Mbyte)_ono") AS "TOTAL_PAYLOAD_MB",
            SUM(t1."Num TCH Availability_Ono") AS "NUM_TCH_AVAIL",
            SUM(t1."Denum TCH Availability_ono") AS "DENUM_TCH_AVAIL",
            SUM(t1."SDCCH_Block_num_ono") AS "NUM_SD_BLOCK",
            SUM(t1."SDCCH_Block_denum_ono") AS "DENUM_SD_BLOCK",
            SUM(t1."TCH_Block_num_ono") AS "NUM_TCH_BLOCK",
            SUM(t1."TCH_Block_denum_ono") AS "DENUM_TCH_BLOCK",
            SUM(t1."SDSR_num_ono") AS "NUM_SDSR",
            SUM(t1."SDSR_denum_ono") AS "DENUM_SDSR",
            SUM(t1."TBF_DL_Est_Num_ono") AS "NUM_TBF_DL_EST",
            SUM(t1."TBF_DL_Est_denum_ono") AS "DENUM_TBF_DL_EST",
            SUM(t1."TCH_Drop_num_ono") AS "NUM_TCH_DROP",
            SUM(t1."TCH_Drop_denum_ono") AS "DENUM_TCH_DROP",
            SUM(t1."PDTCH Congestion Rate (%)_num") AS "NUM_PDTCH_CONGESTION",
            SUM(t1."PDTCH Congestion Rate (%)_denum") AS "DENUM_PDTCH_CONGESTION",
            SUM(t1."TBF_UL_Est_num_ono") AS "NUM_TBF_UL_EST",
            SUM(t1."TBF_UL_Est_denum_ono") AS "DENUM_TBF_UL_EST",
            SUM(t1."HOSR_num_ono") AS "NUM_HOSR",
            SUM(t1."HOSR_denum_ono") AS "DENUM_HOSR",
            SUM(t1."Num DL Qual 0-5_ono") AS "NUM_DL_QUAL_05",
            SUM(t1."Denum DL Qual 0-5_Ono") AS "DENUM_DL_QUAL_05",
            SUM(t1."Num UL Qual 0-5_Ono") AS "NUM_UL_QUAL_05",
            SUM(t1."Denum UL Qual 0-5_Ono") AS "DENUM_UL_QUAL_05",
            SUM(t1."TBF_Comp_num_ono") AS "NUM_TBF_COMP",
            SUM(t1."TBF_Comp_denum_ono") AS "DENUM_TBF_COMP",
            SUM(t1."Num ICM INTERFERENCE_Ono") AS "NUM_ICM_INTERFERENCE",
            SUM(t1."Denum ICM INTERFERENCE_ono") AS "DENUM_ICM_INTERFERENCE",
            SUM(t1."DL_EMI_Num_Ono") AS "NUM_DL_EMI",
            SUM(t1."DL_EMI_Denum_Ono") AS "DENUM_DL_EMI",
            SUM(t1."UL_EMI_Num_Ono") AS "NUM_UL_EMI",
            SUM(t1."UL_EMI_Denum_Ono") AS "DENUM_UL_EMI",
            AVG(t1."SD to TCH Success Rate (%)") AS "SD_TO_TCH_SR",
            SUM(t1."EDGE DL_Throughput (kbps)_ono") AS "EDGE_THP_KB",
            SUM(t1."GPRS DL_Throughput (kbps)_ono") AS "GPRS_THP_KB",
            SUM(t1."Number of fastreturn to LTE") AS "NUMBER_FR_LTE",
            SUM(t1."Number of SDCCH") / 8 AS "NUMBER_SDCCH",
            SUM(t1."Number of TCH") AS "NUMBER_TCH",
            SUM(t1."Number of Static PDTCH") AS "NUMBER_STATIC_PDTCH",
            SUM(t1."Number of dynamic PDTCH") AS "NUMBER_DYNAMIC_PDTCH",
            SUM(t1."Number of TRX") AS "NUMBER_TRX",
            SUM(t1."TCH HR Traffic (Erl)_ono") AS "TCH_HR_TRAFFIC",
            SUM(t1."TCH FR Traffic (Erl)_ono") AS "TCH_FR_TRAFFIC",
            SUM(t1."SDCCH_Availability_num") AS "NUM_SDCCH_AVAIL",
            SUM(t1."SDCCH_Availability_denum") AS "DENUM_SDCCH_AVAIL",
            SUM(t1."SDCCH_Drop_Rate_num") AS "NUM_SDCCH_DROP",
            SUM(t1."SDCCH_Drop_Rate_denum") AS "DENUM_SDCCH_DROP",
            SUM(t1."NF_ICM Band 1-3_num") AS "NUM_IB_BAND_1_3",
            SUM(t1."NF_ICM Band 1-3_denum") AS "DENUM_IB_BAND_1_3",
            SUM(t1."NF_ICM Band 4-5_num") AS "NUM_IB_BAND_4_5",
            SUM(t1."NF_ICM Band 4-5_denum") AS "DENUM_IB_BAND_4_5",
            '1' AS DENUMBY1
          FROM
            "hy2G" t1
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
            t1."Begin Time" >= ${formattedTgl1} :: TIMESTAMP
            AND t1."Begin Time" <= ${formattedTgl2} :: TIMESTAMP
            AND t1."BTS Name" like ${querySiteId}
          GROUP BY
            t1."Begin Time",
            t1."BTS Name"
          ORDER BY
            t1."Begin Time",
            t1."BTS Name"
        `);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
