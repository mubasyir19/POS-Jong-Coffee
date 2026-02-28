import { DataTableDiscount } from "@/components/molecules/DiscountDataTable";
import { Badge } from "@/components/ui/badge";
import { Discount } from "@/types/discount";
import { listDiscount } from "@/utils/data";
import { ColumnDef } from "@tanstack/react-table";
import { Pen, Trash } from "lucide-react";
import React from "react";
import DiscountForm from "../DiscountForm";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const columns: ColumnDef<Discount>[] = [
  {
    accessorKey: "name",
    header: "Discount info",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.original.code;
      return <Badge variant={"default"}>{code}</Badge>;
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => {
      const value = row.original.value;
      return <span>{value} %</span>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <DialogTrigger asChild>
            <Pen className="size-4 cursor-pointer text-blue-500" />
          </DialogTrigger>
          <Link href={`#`}>
            <Trash className="size-4 cursor-pointer text-red-500" />
          </Link>
        </div>
      );
    },
  },
];

export default function DiscountManage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold text-white">
          Discounts Management
        </h2>
        <DiscountForm />
      </div>
      <div className="p-6">
        <Dialog>
          <DataTableDiscount columns={columns} data={listDiscount} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="">
              <p className="text-white">Ini adalah Edit Discount</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
