"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";
import { Types } from "mongoose";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface CustomTableProps<T extends { _id: Types.ObjectId }> {
  columns: Column<T>[];
  data: T[];
  onDelete?: (item: T) => void;
  deletingId?: string | null;
}

export function CustomTable<T extends { _id: Types.ObjectId }>({
  columns,
  data,
  onDelete,
  deletingId,
}: CustomTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.key)}>{col.label}</TableHead>
          ))}
          {onDelete && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => (
          <TableRow key={item._id?.toString()}>
            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                {col.render ? col.render(item) : String(item[col.key])}
              </TableCell>
            ))}

            {onDelete && (
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(item)}
                  disabled={deletingId === item._id?.toString()}
                >
                  {deletingId === item._id?.toString() ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
