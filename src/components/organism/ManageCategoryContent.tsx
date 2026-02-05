"use client";

import { useCategory } from "@/hooks/useCategory";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { AlertCircle, Settings2 } from "lucide-react";

export default function ManageCategoryContent() {
  const { addNewCategory, loading, error } = useCategory();

  const [formData, setFormData] = useState({
    name: "",
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNewCategory(formData);

      toast.success("Berhasil tambah kategori baru");
      setOpenDialog(false);
    } catch (error) {
      toast.error((error as Error).message || "Gagal simpan data");
    }
  };
  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <button className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-600 px-4 py-3.5">
            <Settings2 className="size-5 text-white" />
            <span className="text-sm font-semibold text-white">
              Manage Categories
            </span>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Tambah Kategori
            </DialogTitle>
            <DialogDescription>Silakan isi form dibawah ini.</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="size-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="">
              <label className="text-sm text-white">Nama Kategori</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nomor referensi"
                className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
              />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <DialogFooter>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                </DialogClose>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/80 rounded-md px-3 py-2 text-sm font-semibold text-white"
                >
                  {loading ? "Loading" : "Simpan"}
                </button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
