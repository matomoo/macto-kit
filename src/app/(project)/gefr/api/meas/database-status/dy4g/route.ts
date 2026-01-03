// biome-ignore assist/source/organizeImports: <will fix later>
import { db_gefrdb_suldbv1 } from "@/app/(project)/gefr/_drizzle/db_gefr_suldb";
import type { Agg2gModel } from "@/types/schema";
import { sql } from "drizzle-orm";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await db_gefrdb_suldbv1.execute<Agg2gModel>(sql`
          SELECT
            t1."Begin Time",
            'dy4G' AS "Table Name",
            COUNT(*) FILTER (WHERE t2."AREA" = 'SULAWESI') AS "Count SUL",
            COUNT(*) FILTER (WHERE t2."AREA" = 'KALIMANTAN') AS "Count KAL",
            COUNT(*) FILTER (WHERE t2."AREA" = 'PUMA') AS "Count PUM",
            COUNT("Begin Time") AS "Total Count"
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
          GROUP BY
            "Begin Time"
          ORDER BY
            "Begin Time" DESC
            LIMIT 5;
        `);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
