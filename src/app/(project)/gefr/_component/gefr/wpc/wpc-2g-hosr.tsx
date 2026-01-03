"use client";
// biome-ignore assist/source/organizeImports: <will fix later>
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns/format";
import { useFilterStore } from "@/stores/filterStore";
import { TwSmall } from "../../typography/typography";

export default function Wpc2gHosr({ title, level }: { title: string; level: string }) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ["2g-hosr", dateRange2, filter, siteId, nop, kabupaten, batch],
    queryFn: async () => {
      const response = await fetch(
        `/api/gefr/wpc/2g-hosr/?batch=${batch}&nop=${level === "NOP" ? nop : kabupaten}&kabupaten=${level === "NOP" ? nop : kabupaten}&tgl_1=${dateRange2?.split("|")[0]}&tgl_2=${dateRange2?.split("|")[1]}`,
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) return "Loading wpc ...";
  if (error) return `An error has occurred: ${error.message}`;

  // console.log(data)

  return (
    <div className="grid grid-cols-1 rounded-2xl bg-slate-200 p-4 gap-4 h-fit">
      <TwSmall text={title} />
      {isFetching ? (
        <div>Searching data...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-h-0">
          <div className="bg-white rounded-lg border shadow-sm p-4  ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">NOP</TableHead>
                  <TableHead className="text-left">Kabupaten</TableHead>
                  <TableHead className="text-left">BTS Name</TableHead>
                  <TableHead className="text-left">HOSR Fail Number</TableHead>
                  <TableHead className="text-left">HOSR (%)</TableHead>
                  <TableHead className="text-left">Availability (%)</TableHead>
                  <TableHead className="text-left">IDX</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.NOP}</TableCell>
                    <TableCell className="font-medium">{row.KABUPATEN}</TableCell>
                    <TableCell className="font-medium">{row["BTS Name"]}</TableCell>
                    <TableCell className="">{row.HO_NUM_FAIL}</TableCell>
                    <TableCell className="">{row.HO_SR.toFixed(2)}</TableCell>
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
