"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns/format";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { TwSmall } from "../../typography/typography";

export default function DatabaseStatus({ tbName, title }: { tbName: string; title: string }) {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["DatabaseStatus", tbName],
    queryFn: async () => {
      const response = await fetch(`/api/gefr/sul/database-status/${tbName}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  if (isPending) return "Loading...";
  if (error) return `An error has occurred: ${error.message}`;

  return (
    <div className="grid h-fit grid-cols-1 gap-4 rounded-2xl bg-slate-200 p-4">
      <TwSmall text={title} />
      {isFetching ? (
        <div>Searching data...</div>
      ) : (
        <div className="grid min-h-0 grid-cols-1 gap-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Begin Time</TableHead>
                  <TableHead className="text-right">Count of SUL</TableHead>
                  <TableHead className="text-right">Count of KAL</TableHead>
                  <TableHead className="text-right">Count of PUM</TableHead>
                  <TableHead className="text-right">Count of Cell</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {title.includes("Hourly")
                        ? format(new Date(row["Begin Time"]), "M/d/yyyy HH:mm")
                        : format(new Date(row["Begin Time"]), "M/d/yyyy")}
                    </TableCell>
                    <TableCell className="text-right">{parseInt(row["Count SUL"], 10).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{parseInt(row["Count KAL"], 10).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{parseInt(row["Count PUM"], 10).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{parseInt(row["Total Count"], 10).toLocaleString()}</TableCell>
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
