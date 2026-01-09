// biome-ignore assist/source/organizeImports: <will fix later>
import type { InferModel } from "drizzle-orm";
import type * as pumaSchema from "@/schema/drizzle/schema/schema-puma-v1";
import type * as sulwSchema from "@/schema/drizzle/schema/schema-sulw-v1";
import type * as gefr_pum_Schema from "@/schema/drizzle/schema/schema-gefrdb-pumdb-v1";
import type * as gefr_sul_Schema from "@/schema/drizzle/schema/schema-gefrdb-suldb-v1";

// Infer the types from your schema
export type PumaModelMeasKpiDy2G2 = InferModel<typeof PumaSchema.measKpiDy2G2, "insert">;
export type SulwModelMeasKpiDy2G2 = InferModel<typeof sulwSchema.measDy2G2, "insert">;

export type SulwModel_vwCustom2G = InferModel<typeof sulwSchema.vwMondy2G, "select">;

export type SulwModel_vwCustom2G_2 = InferModel<typeof sulwSchema.vw_mondy2g, "select">;

export type SulwModel_MeasKpi4G = InferModel<typeof sulwSchema.measDy4G, "select">;

export type SulwModel_vwCustom4G = InferModel<typeof sulwSchema.vwMondy4G, "select">;

export type SulwModel_vwCustom4G_2 = InferModel<typeof sulwSchema.vw_mondy4G, "select">;

// PUMA
export type PumaModel_vwCustom2G = InferModel<typeof pumaSchema.vwMondy2G, "select">;

// GEFR SULDB
export type Gefr_Sul_Dy2G2_Model = InferModel<typeof gefr_sul_Schema.dy2G2, "select">;

export type Gefr_Sul_Dy4G2_Model = InferModel<typeof gefr_sul_Schema.dy4G2, "select">;

// GEFR PUMDB
export type Gefr_Pum_Dy2G2_Model = InferModel<typeof gefr_pum_Schema.dy2G2, "select">;

export type Gefr_Pum_Dy4G2_Model = InferModel<typeof gefr_pum_Schema.dy4G2, "select">;

// GEFR KALDB
export type Gefr_Kal_Dy2G2_Model = InferModel<typeof gefr_kal_Schema.dy2G2, "select">;

export type Gefr_Kal_Dy4G2_Model = InferModel<typeof gefr_kal_Schema.dy4G2, "select">;

export interface Agg4gModel {
  BEGIN_TIME: string;
  NOP: string;
  KABUPATEN: string;
  BAND: string;
  CELL_NAME: string;
  REMARK_POWER: string;
  TOTAL_PAYLOAD_GB: number;
  TOTAL_PAYLOAD_TB: number;
  AVG_MAX_NUMBER_RRC_CONNECTION_USER: number;
  MAX_MAX_NUMBER_RRC_CONNECTION_USER: number;
  SUM_MAX_NUMBER_RRC_CONNECTION_USER: number;
  CELL_DL_THP_NUM: number;
  CELL_DL_THP_DENUM: number;
  CELL_UL_THP_NUM: number;
  CELL_UL_THP_DENUM: number;
  AVAILABILITY_NUM: number;
  AVAILABILITY_DENUM: number;
  DL_PRB_UTILIZATION_NUM: number;
  DL_PRB_UTILIZATION_DENUM: number;
  UL_PRB_UTILIZATION_NUM: number;
  UL_PRB_UTILIZATION_DENUM: number;
  CQI_NUM: number;
  CQI_DENUM: number;
  AVG_CQI: number;
  SE_NUM: number;
  SE_DENUM: number;
  CELL_COUNT: number;
  TRAFFIC_VOLTE_ERL: number;
  TRAFFIC_VOLTE_KERL: number;
  VOLTE_CSSR_NUM: number;
  VOLTE_CSSR_DENUM: number;
  VOLTE_ERAB_SR_NUM: number;
  VOLTE_ERAB_SR_DENUM: number;
  VOLTE_CALL_DROP_NUM: number;
  VOLTE_CALL_DROP_DENUM: number;
  SRVCC_E2W_SR_NUM: number;
  SRVCC_E2W_SR_DENUM: number;
  SRVCC_E2G_SR_NUM: number;
  SRVCC_E2G_SR_DENUM: number;
  USER_DL_THP_NUM: number;
  USER_DL_THP_DENUM: number;
  USER_UL_THP_NUM: number;
  USER_UL_THP_DENUM: number;
  PAGING_CONGESTION_SR: number;
  S1_CONN_SR_NUM: number;
  S1_CONN_SR_DENUM: number;
  IFHO_SR_NUM: number;
  IFHO_SR_DENUM: number;
  INTER_FHO_SR_NUM: number;
  INTER_FHO_SR_DENUM: number;
  UL_RB_AVAILABLE: number;
  DL_RB_AVAILABLE: number;
  ACTIVE_USER: number;
  SERVICE_DROP_RATE_NUM: number;
  SERVICE_DROP_RATE_DENUM: number;
  DENUMBY1: number;
  [key: string]: unknown;
}

export interface Agg4gHyModel {
  BEGIN_TIME: string;
  NOP: string;
  KABUPATEN: string;
  BAND: string;
  CELL_NAME: string;
  REMARK_POWER: string;
  TOTAL_PAYLOAD_GB: number;
  TOTAL_PAYLOAD_TB: number;
  LTE_MEAN_USER_DL_THR_BEYOND_NUM: number;
  LTE_MEAN_USER_DL_THR_BEYOND_DENUM: number;
  CELL_COUNT: number;
  VOLTE_TRAFFIC_ERL: number;
  AVG_MAX_RRC_CONNECTION_USER: number;
  LTE_PRB_DL_BEYOND_NUM: number;
  LTE_PRB_DL_BEYOND_DEN: number;
  LTE_PRB_UL_BEYOND_NUM: number;
  LTE_PRB_UL_BEYOND_DEN: number;
  AVG_PRB_NUMBER_AVAILABLE_DL: number;
  LTE_MEAN_USER_DL_THR_BEYOND_NUM: number;
  LTE_MEAN_USER_DL_THR_BEYOND_DENUM: number;
  LTE_MEAN_USER_UL_THR_BEYOND_NUM: number;
  LTE_MEAN_USER_UL_THR_BEYOND_DENUM: number;
  CQI_NUM: number;
  CQI_DENUM: number;
  CELL_AVAILABILITY_NUM: number;
  CELL_AVAILABILITY_DENUM: number;
  CSFB_PREPARATION_NUM: number;
  CSFB_PREPARATION_DENUM: number;
  INTER_FREQ_LTE_HO_NUM: number;
  INTER_FREQ_LTE_HO_DENUM: number;
  SRVCC_SR_INTER_RAT_E2G_NUM: number;
  SRVCC_SR_INTER_RAT_E2G_DENUM: number;
  AVERAGE_NI_OF_CARRIER_DBM: number;
  RRC_SETUP_SR_NUM: number;
  RRC_SETUP_SR_DENUM: number;
  ERAB_SETUP_SR_NUM: number;
  ERAB_SETUP_SR_DENUM: number;
  INTRA_FHO_SR_NUM: number;
  INTRA_FHO_SR_DENUM: number;
  SE_NUM: number;
  SE_DENUM: number;
  VOLTE_CSSR_NUM: number;
  VOLTE_CSSR_DENUM: number;
  VOLTE_CALL_DROP_NUM: number;
  VOLTE_CALL_DROP_DENUM: number;
  DENUMBY1: number;
  [key: string]: unknown;
}

export interface Agg2gModel {
  BEGIN_TIME: string;
  NOP: string;
  KABUPATEN: string;
  BTS_NAME: string;
  BAND: string;
  SDCCH_TRAFFIC_ERL: number;
  TCH_TRAFFIC_ERL: number;
  EDGE_PAYLOAD_MB: number;
  GPRS_PAYLOAD_MB: number;
  TOTAL_PAYLOAD_MB: number;
  NUM_TCH_AVAIL: number;
  DENUM_TCH_AVAIL: number;
  NUM_SD_BLOCK: number;
  DENUM_SD_BLOCK: number;
  NUM_TCH_BLOCK: number;
  DENUM_TCH_BLOCK: number;
  NUM_SDSR: number;
  DENUM_SDSR: number;
  NUM_TBF_DL_EST: number;
  DENUM_TBF_DL_EST: number;
  NUM_TCH_DROP: number;
  DENUM_TCH_DROP: number;
  NUM_PDTCH_CONGESTION: number;
  DENUM_PDTCH_CONGESTION: number;
  NUM_TBF_UL_EST: number;
  DENUM_TBF_UL_EST: number;
  NUM_HOSR: number;
  DENUM_HOSR: number;
  NUM_DL_QUAL_05: number;
  DENUM_DL_QUAL_05: number;
  NUM_UL_QUAL_05: number;
  DENUM_UL_QUAL_05: number;
  NUM_TBF_COMP: number;
  DENUM_TBF_COMP: number;
  NUM_ICM_INTERFERENCE: number;
  DENUM_ICM_INTERFERENCE: number;
  NUM_DL_EMI: number;
  DENUM_DL_EMI: number;
  NUM_UL_EMI: number;
  DENUM_UL_EMI: number;
  SD_TO_TCH_SR: number;
  EDGE_THP_KB: number;
  GPRS_THP_KB: number;
  NUMBER_FR_LTE: number;
  NUM_SDCCH_DROP: number;
  DENUM_SDCCH_DROP: number;
  NUM_SDCCH_AVAIL: number;
  DENUM_SDCCH_AVAIL: number;
  NUM_IB_BAND_1_3: number;
  DENUM_IB_BAND_1_3: number;
  NUM_IB_BAND_4_5: number;
  DENUM_IB_BAND_4_5: number;
  [key: string]: unknown;
}

export interface Data2G4GModel {
  BEGIN_TIME: string;
  NOP: string;
  KABUPATEN: string;
  BTS_NAME: string;
  BAND: string;
  SDCCH_TRAFFIC_ERL: number;
  TCH_TRAFFIC_ERL: number;
  EDGE_PAYLOAD_MB: number;
  GPRS_PAYLOAD_MB: number;
  TOTAL_PAYLOAD_MB: number;
  NUM_TCH_AVAIL: number;
  DENUM_TCH_AVAIL: number;
  NUM_SD_BLOCK: number;
  DENUM_SD_BLOCK: number;
  NUM_TCH_BLOCK: number;
  DENUM_TCH_BLOCK: number;
  NUM_SDSR: number;
  DENUM_SDSR: number;
  NUM_TBF_DL_EST: number;
  DENUM_TBF_DL_EST: number;
  NUM_TCH_DROP: number;
  DENUM_TCH_DROP: number;
  NUM_PDTCH_CONGESTION: number;
  DENUM_PDTCH_CONGESTION: number;
  NUM_TBF_UL_EST: number;
  DENUM_TBF_UL_EST: number;
  NUM_HOSR: number;
  DENUM_HOSR: number;
  NUM_DL_QUAL_05: number;
  DENUM_DL_QUAL_05: number;
  NUM_UL_QUAL_05: number;
  DENUM_UL_QUAL_05: number;
  NUM_TBF_COMP: number;
  DENUM_TBF_COMP: number;
  NUM_ICM_INTERFERENCE: number;
  DENUM_ICM_INTERFERENCE: number;
  NUM_DL_EMI: number;
  DENUM_DL_EMI: number;
  NUM_UL_EMI: number;
  DENUM_UL_EMI: number;
  SD_TO_TCH_SR: number;
  EDGE_THP_KB: number;
  GPRS_THP_KB: number;
  NUMBER_FR_LTE: number;
  NUM_SDCCH_DROP: number;
  DENUM_SDCCH_DROP: number;
  NUM_SDCCH_AVAIL: number;
  DENUM_SDCCH_AVAIL: number;
  NUM_IB_BAND_1_3: number;
  DENUM_IB_BAND_1_3: number;
  NUM_IB_BAND_4_5: number;
  DENUM_IB_BAND_4_5: number;

  CELL_NAME: string;
  REMARK_POWER: string;
  TOTAL_PAYLOAD_GB: number;
  TOTAL_PAYLOAD_TB: number;
  AVG_MAX_NUMBER_RRC_CONNECTION_USER: number;
  MAX_MAX_NUMBER_RRC_CONNECTION_USER: number;
  SUM_MAX_NUMBER_RRC_CONNECTION_USER: number;
  CELL_DL_THP_NUM: number;
  CELL_DL_THP_DENUM: number;
  CELL_UL_THP_NUM: number;
  CELL_UL_THP_DENUM: number;
  AVAILABILITY_NUM: number;
  AVAILABILITY_DENUM: number;
  DL_PRB_UTILIZATION_NUM: number;
  DL_PRB_UTILIZATION_DENUM: number;
  UL_PRB_UTILIZATION_NUM: number;
  UL_PRB_UTILIZATION_DENUM: number;
  CQI_NUM: number;
  CQI_DENUM: number;
  AVG_CQI: number;
  SE_NUM: number;
  SE_DENUM: number;
  CELL_COUNT: number;
  TRAFFIC_VOLTE_ERL: number;
  TRAFFIC_VOLTE_KERL: number;
  VOLTE_CSSR_NUM: number;
  VOLTE_CSSR_DENUM: number;
  VOLTE_ERAB_SR_NUM: number;
  VOLTE_ERAB_SR_DENUM: number;
  VOLTE_CALL_DROP_NUM: number;
  VOLTE_CALL_DROP_DENUM: number;
  SRVCC_E2W_SR_NUM: number;
  SRVCC_E2W_SR_DENUM: number;
  SRVCC_E2G_SR_NUM: number;
  SRVCC_E2G_SR_DENUM: number;
  USER_DL_THP_NUM: number;
  USER_DL_THP_DENUM: number;
  USER_UL_THP_NUM: number;
  USER_UL_THP_DENUM: number;
  PAGING_CONGESTION_SR: number;
  S1_CONN_SR_NUM: number;
  S1_CONN_SR_DENUM: number;
  IFHO_SR_NUM: number;
  IFHO_SR_DENUM: number;
  INTER_FHO_SR_NUM: number;
  INTER_FHO_SR_DENUM: number;
  UL_RB_AVAILABLE: number;
  DL_RB_AVAILABLE: number;
  ACTIVE_USER: number;
  SERVICE_DROP_RATE_NUM: number;
  SERVICE_DROP_RATE_DENUM: number;
  DENUMBY1: number;
  [key: string]: unknown;
}
