"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useFilterStore } from "@/stores/filterStore";

import { TwSmall } from "../../typography/typography";

export default function WpcZeroTraffic2g({ title, level }: { title: string; level: string }) {
  const { dateRange2, filter, siteId, nop, kabupaten, batch } = useFilterStore();

  const { isPending, error, data, isFetching, refetch } = useQuery({
    queryKey: ["2g-zero-traffic", dateRange2, filter, siteId, nop, kabupaten, batch],
    queryFn: async () => {
      const response = await fetch(
        `/api/gefr/wpc/2g-zero-traffic/?batch=${batch}&nop=${level === "NOP" ? nop : kabupaten}&kabupaten=${level === "NOP" ? nop : kabupaten}&tgl_1=${dateRange2?.split("|")[0]}&tgl_2=${dateRange2?.split("|")[1]}`,
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) return "Loading wpc zero traffic...";
  if (error) return "An error has occurred: " + error.message;

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
                  <TableHead className="w-25">Kota</TableHead>
                  <TableHead className="w-25">Cell Name</TableHead>
                  <TableHead className="text-right">Traffic Before</TableHead>
                  <TableHead className="text-right">Traffic After</TableHead>
                  <TableHead className="text-right">Delta</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                  <TableHead className="text-right">Availability Before</TableHead>
                  <TableHead className="text-right">Availability After</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.NOP}</TableCell>
                    <TableCell className="font-medium">{row["KABUPATEN"]}</TableCell>
                    <TableCell className="font-medium">{row["cellname"]}</TableCell>
                    <TableCell className="text-right">{row["traffic_before"].toFixed(4)}</TableCell>
                    <TableCell className="text-right">{row["traffic_after"].toFixed(4)}</TableCell>
                    <TableCell className="text-right">{row["traffic_delta"].toFixed(4)}</TableCell>
                    <TableCell className="text-right">{row["traffic_growth"]}</TableCell>
                    <TableCell className="text-right">{row["availability_before"].toFixed(4)}</TableCell>
                    <TableCell className="text-right">{row["availability_after"].toFixed(4)}</TableCell>
                    <TableCell className="text-right">{row["availability_growth"]}</TableCell>
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
