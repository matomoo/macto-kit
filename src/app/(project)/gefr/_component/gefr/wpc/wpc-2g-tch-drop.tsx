/** biome-ignore-all lint/suspicious/noExplicitAny: <will fix later> */
"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFilterStore } from "@/stores/filterStore";
import { TwSmall } from "../../typography/typography";

export default function Wpc2gTchDrop({ title, level }: { title: string; level: string }) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["2g-tch-drop", dateRange2, filter, siteId, nop, kabupaten, batch],
    queryFn: async () => {
      const response = await fetch(
        `/api/gefr/wpc/2g-tch-drop/?batch=${batch}&nop=${level === "NOP" ? nop : kabupaten}&kabupaten=${level === "NOP" ? nop : kabupaten}&tgl_1=${dateRange2?.split("|")[0]}&tgl_2=${dateRange2?.split("|")[1]}`,
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) return "Loading wpc ...";
  if (error) return `An error has occurred: ${error.message}`;

  // console.log(data)

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      <TwSmall text={title} />
      {isFetching ? (
        <div>Searching data...</div>
      ) : (
        <div className="grid min-h-0 grid-cols-1 gap-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">NOP</TableHead>
                  <TableHead className="text-left">Kabupaten</TableHead>
                  <TableHead className="text-left">BTS Name</TableHead>
                  <TableHead className="text-left">TCH Drop Fail Number</TableHead>
                  <TableHead className="text-left">TCH Drop Rate (%)</TableHead>
                  <TableHead className="text-left">HOSR (%)</TableHead>
                  <TableHead className="text-left">Availability (%)</TableHead>
                  <TableHead className="text-left">IDX</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row: any, _index: any) => (
                  <TableRow key={row.NOP}>
                    <TableCell className="font-medium">{row.NOP}</TableCell>
                    <TableCell className="font-medium">{row.KABUPATEN}</TableCell>
                    <TableCell className="font-medium">{row["BTS Name"]}</TableCell>
                    <TableCell className="">{row.TCH_DROP_FAIL_NUM}</TableCell>
                    <TableCell className="">{row.TCH_DROP_RATE?.toFixed(2) ?? 0}</TableCell>
                    <TableCell className="">{row.HO_SR?.toFixed(2) ?? 0}</TableCell>
                    <TableCell className="">{row.TCH_AVAIL_SR?.toFixed(2) ?? 0}</TableCell>
                    <TableCell className="">{`${row["SubnetWork ID"]}_${row["SITE ID"]}_${row["BTS ID"]}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
