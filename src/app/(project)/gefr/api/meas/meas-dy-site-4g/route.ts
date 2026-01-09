// biome-ignore assist/source/organizeImports: <will fix later>
import type { Data2G4GModel } from "@/types/schema";
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

    const result = await db_gefrdb_suldbv1.execute<Data2G4GModel>(sql`
          SELECT
            t1."Begin Time" AS "BEGIN_TIME",
            t1."Cell Name" as "CELL_NAME",
            SUM(t1."Num RRC Setup SR AMQ") AS "RRC_SETUP_SR_NUM",
            SUM("Denum RRC Setup SR AMQ") AS "RRC_SETUP_SR_DENUM",
            SUM("Num E-RAB Setup SR AMQ") AS "ERAB_SETUP_SR_NUM",
            SUM("Denum E-RAB Setup SR AMQ") AS "ERAB_SETUP_SR_DENUM",
            SUM("Num CSSR AMQ") AS "CSSR_NUM",
            SUM("Denum CSSR AMQ") AS "CSSR_DENUM",
            SUM("Num E-RAB Drop AMQ") AS "ERAB_DROP_RATE_NUM",
            SUM("Denum E-RAB Drop AMQ") AS "ERAB_DROP_RATE_DENUM",
            AVG("Average NI of Carrier(dBm)") AS "AVG_NI_CARRIER_DBM",
            SUM("Num CSFB SR AMQ") AS "CSFB_SETUP_SR_NUM",
            SUM("Denum CSFB SR AMQ") AS "CSFB_SETUP_SR_DENUM",
            SUM("CSFB release num") AS "CSFB_RELEASE_SR_NUM",
            SUM("CSFB release denum") AS "CSFB_RELEASE_SR_DENUM",
            SUM("DL Traffic Volume (MByte) AMQ") / 1024 AS "DL_PAYLOAD_GB",
            SUM("UL Traffic Volume (MByte) AMQ") / 1024 AS "UL_PAYLOAD_GB",
            SUM("4G Payload (MByte) AMQ") / 1024 AS "TOTAL_PAYLOAD_GB",
            SUM("4G Payload (MByte) AMQ") / 1024 / 1024 AS "TOTAL_PAYLOAD_TB",
            AVG("Maximum Number of RRC Connection User") AS "AVG_MAX_NUMBER_RRC_CONNECTION_USER",
            MAX("Maximum Number of RRC Connection User") AS "MAX_MAX_NUMBER_RRC_CONNECTION_USER",
            SUM("Maximum Number of RRC Connection User") AS "SUM_MAX_NUMBER_RRC_CONNECTION_USER",
            SUM("Cell DL Throughput Num AMQ") AS "CELL_DL_THP_NUM",
            SUM("Cell DL Throughput Denum AMQ") AS "CELL_DL_THP_DENUM",
            SUM("Cell UL Throughput Num AMQ") AS "CELL_UL_THP_NUM",
            SUM("Cell UL Throughput Denum AMQ") AS "CELL_UL_THP_DENUM",
            SUM("Cell Availability Num 4G AMQ") AS "AVAILABILITY_NUM",
            SUM("Cell Availability Denum 4G AMQ") AS "AVAILABILITY_DENUM",
            SUM("DL PRB Utilization Num AMQ") AS "DL_PRB_UTILIZATION_NUM",
            SUM("DL PRB Utilization Denum AMQ") AS "DL_PRB_UTILIZATION_DENUM",
            SUM("UL PRB Utilization Num AMQ") AS "UL_PRB_UTILIZATION_NUM",
            SUM("UL PRB Utilization Denum AMQ") AS "UL_PRB_UTILIZATION_DENUM",
            SUM("CQI>=7 Num AMQ") AS "CQI_NUM",
            SUM("CQI>=7 Denum AMQ") AS "CQI_DENUM",
            AVG("CQI Average AMQ") AS "AVG_CQI",
            SUM("spectrum efficiency num") AS "SE_NUM",
            SUM("spectrum efficiency denum") AS "SE_DENUM",
            COUNT("Cell Name") AS "CELL_COUNT",
            SUM("Traffic_VoLTE_(erl) AMQ") AS "TRAFFIC_VOLTE_ERL",
            SUM("Traffic_VoLTE_(erl) AMQ") / 1024 AS "TRAFFIC_VOLTE_KERL",
            SUM("Call_Setup_VoLTE_Num AMQ") AS "VOLTE_CSSR_NUM",
            SUM("Call_Setup_VoLTE_Denum AMQ") AS "VOLTE_CSSR_DENUM",
            SUM("E-RAB_Setup_VoLTE_QCI5_Num AMQ") AS "VOLTE_ERAB_SR_NUM",
            SUM("E-RAB_Setup_VoLTE_QCI5_Denum AMQ") AS "VOLTE_ERAB_SR_DENUM",
            SUM("Call_Drop_VoLTE_Num AMQ") AS "VOLTE_CALL_DROP_NUM",
            SUM("Call_Drop_VoLTE_Denum AMQ") AS "VOLTE_CALL_DROP_DENUM",
            SUM("SRVCC_LTE-UMTS_HOSR_VoLTE_Num AMQ") AS "SRVCC_E2W_SR_NUM",
            SUM("SRVCC_LTE-UMTS_HOSR_VoLTE_Denum AMQ") AS "SRVCC_E2W_SR_DENUM",
            SUM("SRVCC_LTE-GSM_HOSR_VoLTE_Num AMQ") AS "SRVCC_E2G_SR_NUM",
            SUM("SRVCC_LTE-GSM_HOSR_VoLTE_Denum AMQ") AS "SRVCC_E2G_SR_DENUM",
            SUM("User DL Throughput Num AMQ") AS "USER_DL_THP_NUM",
            SUM("User DL Throughput Denum AMQ") AS "USER_DL_THP_DENUM",
            SUM("User UL Throughput Num AMQ") AS "USER_UL_THP_NUM",
            SUM("User UL Throughput Denum AMQ") AS "USER_UL_THP_DENUM",
            AVG("Paging Congestion Rate(%)") AS "PAGING_CONGESTION_SR",
            SUM("KPI S1-Signal Connection Est SR Num") AS "S1_CONN_SR_NUM",
            SUM("KPI S1-Signal Connection Est SR Denum") AS "S1_CONN_SR_DENUM",
            SUM("Num IFHO SR AMQ") AS "IFHO_SR_NUM",
            SUM("Denum IFHO SR AMQ") AS "IFHO_SR_DENUM",
            SUM("Inter Freq LTE HO Num AMQ") AS "INTER_FHO_SR_NUM",
            SUM("Inter Freq LTE HO Denum AMQ") AS "INTER_FHO_SR_DENUM",
            AVG("UL RB Available AMQ") AS "UL_RB_AVAILABLE",
            AVG("DL RB Available AMQ") AS "DL_RB_AVAILABLE",
            AVG("New Active Users rnp_Ono") AS "ACTIVE_USER",
            SUM("Num Service Drop Rate AMQ") AS "SERVICE_DROP_RATE_NUM",
            SUM("Denum Service Drop Rate AMQ") AS "SERVICE_DROP_RATE_DENUM",
            '1' AS "DENUMBY1"
          FROM
            "dy4G" t1
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
