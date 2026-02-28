import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";

export default function DiscountForm() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <button className="bg-primary hover:bg-primary/80 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200">
          <Plus className="size-5 text-white" />
          <span className="text-sm font-semibold text-white">
            Tambah Discount
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Tambah Discount
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-3">
          <div className="space-y-1">
            <Label className="text-white">Discount Info</Label>
            <input
              type="text"
              name="name"
              placeholder="Masukkan nama diskon"
              className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Discount Code</Label>
            <input
              type="text"
              name="code"
              placeholder="XXXX"
              className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Discount Value</Label>
            <input
              type="number"
              name="value"
              placeholder=""
              className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
          </div>
          <div className="">
            <button className="bg-primary hover:bg-primary/80 rounded-md px-3 py-2 text-sm font-semibold text-white">
              Tambah Discount
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
