"use client";

import CategoryTabs from "@/components/molecules/CategoryTabs";
import ListManageProduct from "@/components/molecules/ListManageProduct";
import { Package, Plus, Tag, Upload, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { AddProduct, ProductCoffee, ProductVariant } from "@/types/product";
import { useFetchUnit } from "@/hooks/useUnit";
import { useCategory } from "@/hooks/useCategory";
import { useSaveProduct } from "@/hooks/useProduct";
import EditProductDialog from "@/components/molecules/EditProductDialog";
import ManageCategoryContent from "../ManageCategoryContent";
import { formatPrice } from "@/helpers/formatPrice";

export default function ManagementProduct() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductCoffee | null>(
    null,
  );
  // const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { dataUnit } = useFetchUnit();
  const { category, fetchCategory } = useCategory();

  const { handleSaveProduct, loading: LoadingSaveProduct } = useSaveProduct();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<AddProduct>({
    name: "",
    categoryId: "",
    imageUrl: null,
    variants: [],
  });

  const [currentVariant, setCurrentVariant] = useState<ProductVariant>({
    name: "",
    unitId: "",
    priceOnline: 0,
    priceOffline: 0,
    stock: 0,
    sku: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      // Reset jika tidak ada file
      setCurrentProduct((prev) => ({ ...prev, imageUrl: null }));
      setImagePreview(null);
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      e.target.value = ""; // Reset input
      return;
    }

    // Validasi ukuran file (misal max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 5MB");
      e.target.value = ""; // Reset input
      return;
    }

    console.log("File yang dipilih:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    // Set file ke form data
    setCurrentProduct((prev) => ({ ...prev, imageUrl: file }));

    // Buat preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.onerror = () => {
      console.error("Error reading file");
      toast.error("Gagal membaca file");
    };
    reader.readAsDataURL(file);
  };

  const addVariant = () => {
    if (
      currentVariant.name &&
      currentVariant.unitId &&
      currentVariant.priceOnline > 0 &&
      currentVariant.priceOffline > 0
    ) {
      const unit = dataUnit?.find((u) => u.id === currentVariant.unitId);
      setCurrentProduct({
        ...currentProduct,
        variants: [
          ...currentProduct.variants,
          {
            ...currentVariant,
            unitId: currentVariant.unitId,
            priceOnline: Number(currentVariant.priceOnline),
            priceOffline: Number(currentVariant.priceOffline),
            stock: Number(currentVariant.stock) || 0,
            unit: unit,
          },
        ],
      });
      setCurrentVariant({
        name: "",
        unitId: "",
        priceOnline: 0,
        priceOffline: 0,
        stock: 0,
        sku: "",
      });
    } else {
      toast.error("Mohon lengkapi semua data variant");
    }
  };

  const removeVariant = (name: string) => {
    setCurrentProduct({
      ...currentProduct,
      variants: currentProduct.variants.filter((v) => v.name !== name),
    });
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !currentProduct.name ||
      !currentProduct.categoryId ||
      !currentProduct.imageUrl ||
      currentProduct.variants.length === 0
    ) {
      toast.error(
        "Mohon lengkapi semua data produk dan tambahkan minimal 1 variant",
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("categoryId", currentProduct.categoryId);

    // Append image
    if (currentProduct.imageUrl instanceof File) {
      formData.append("imageUrl", currentProduct.imageUrl);
    }

    formData.append(
      "variants",
      JSON.stringify(
        currentProduct.variants.map((v) => ({
          name: v.name,
          unitId: v.unitId,
          priceOnline: v.priceOnline,
          priceOffline: v.priceOffline,
          stock: v.stock,
          sku: v.sku || null,
        })),
      ),
    );

    console.log("Data yang akan dikirim:", {
      name: currentProduct.name,
      categoryId: currentProduct.categoryId,
      imageUrl: currentProduct.imageUrl instanceof File ? "File" : "No image",
      variantsCount: currentProduct.variants.length,
    });

    try {
      await handleSaveProduct(formData);

      toast.success("Berhasil tambah produk");
      setOpen(false);

      // Reset form
      setCurrentProduct({
        name: "",
        categoryId: "",
        imageUrl: null,
        variants: [],
      });

      setCurrentVariant({
        name: "",
        unitId: "",
        priceOnline: 0,
        priceOffline: 0,
        stock: 0,
        sku: "",
      });

      // Reset image preview
      setImagePreview(null);

      // Refresh data produk
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error(`Gagal: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);
  //     } else if (editingProduct?.imageUrl) {
  //       // Jika tidak ada file baru, tapi ada image existing, append URL-nya
  const handleEditProduct = (product: ProductCoffee) => {
    setEditingProduct(product);
    setOpenEditDialog(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between p-6">
        <h2 className="text-xl font-semibold text-white">
          Products Management
        </h2>
        <ManageCategoryContent />
      </div>
      <div className="mt-4">
        <div className="px-6">
          <CategoryTabs
            selected={selectedCategory}
            onSelect={(category) => {
              setSelectedCategory(category);
              setCurrentProduct((prev) => ({ ...prev, categoryId: category }));
            }}
          />
        </div>
      </div>
      <div className="no-scrollbar grid grid-cols-3 gap-4 overflow-y-auto p-6">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              className="border-primary flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-transparent p-4 transition focus:outline-none"
              aria-label="Tambah produk"
            >
              <Plus className="text-primary text-xl" />
              <span className="text-primary mt-2 text-base font-semibold">
                Tambah Menu Baru
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-3/4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Tambah Menu
              </DialogTitle>
              <DialogDescription>
                Silakan isi form dibawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Package className="size-6 text-white" />
              <h3 className="text-lg font-semibold text-white">
                Informasi Produk
              </h3>
            </div>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-3 items-stretch gap-4 pb-6">
                <div className="col-span-2 space-y-4">
                  <div className="">
                    <label className="text-sm text-white">
                      Nama Menu <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={currentProduct.name}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Masukkan nomor referensi"
                      className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
                    />
                  </div>
                  <div className="">
                    <label className="text-sm text-white">
                      Pilih Kategori: <span className="text-primary">*</span>
                    </label>
                    <select
                      name="categoryId"
                      required
                      value={currentProduct.categoryId}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          categoryId: e.target.value,
                        })
                      }
                      className="bg-background mt-1.5 w-full rounded-md border border-gray-700 px-4 py-2 text-sm text-white outline-none"
                    >
                      <option value="" disabled>
                        Pilih kategori
                      </option>
                      {category?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm text-white">
                    Gambar Produk
                  </label>
                  <div className="mt-2 flex-1 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition hover:border-blue-500">
                    <input
                      type="file"
                      id="imageUrl"
                      name="imageUrl"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label htmlFor="imageUrl" className="cursor-pointer">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          width={150}
                          height={120}
                          alt="Preview"
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload size={32} className="mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Upload gambar</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center gap-2">
                  <Tag className="size-5 text-white" />
                  <h3 className="text-lg font-semibold text-white">
                    Variant Produk
                  </h3>
                </div>
                <div className="my-4 grid grid-cols-6 gap-3">
                  <div>
                    <label className="mb-1 block text-sm text-white">
                      Nama Variant <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentVariant.name}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          name: e.target.value,
                        })
                      }
                      required
                      placeholder="Small / Hot / Iced"
                      className="focus:border-primary bg-background mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:outline-none"
                    />
                  </div>
                  <div className="">
                    <label className="text-sm text-white">
                      Pilih Unit/Satuan:
                    </label>
                    <select
                      name="unitId"
                      value={currentVariant.unitId}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          unitId: e.target.value,
                        })
                      }
                      className="bg-background focus:border-primary mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-white outline-none focus:outline-none"
                    >
                      <option value="" disabled>
                        Pilih Unit
                      </option>
                      {dataUnit?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white">
                      Harga Offline <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      name="priceOffline"
                      value={currentVariant.priceOffline}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          priceOffline: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      placeholder="28000"
                      className="focus:border-primary bg-background mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white">
                      Harga Online <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      name="priceOnline"
                      value={currentVariant.priceOnline}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          priceOnline: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      placeholder="30000"
                      className="focus:border-primary bg-background mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white">
                      Stok <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={currentVariant.stock}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          stock: Number(e.target.value) || 0,
                        })
                      }
                      required
                      placeholder="100"
                      className="focus:border-primary bg-background mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white">
                      SKU <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={currentVariant.sku}
                      onChange={(e) =>
                        setCurrentVariant({
                          ...currentVariant,
                          sku: e.target.value,
                        })
                      }
                      required
                      placeholder="AMRCN-HT"
                      className="focus:border-primary bg-background mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={addVariant}
                  className="bg-primary/80 hover:bg-primary w-full rounded-md px-3 py-2 text-sm font-semibold text-white"
                >
                  Tambah Variant
                </button>
              </div>

              <div className="mt-4">
                {currentProduct.variants.length > 0 && (
                  <table className="min-w-full overflow-hidden">
                    <thead className="">
                      <tr>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                          Variant
                        </th>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                          Unit
                        </th>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                          Harga Offline
                        </th>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                          Harga Online
                        </th>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                          Stock
                        </th>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                          SKU
                        </th>
                        <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProduct.variants.map((variant, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-white">
                                {variant.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5 text-sm text-white">
                            {variant.unit?.name}
                          </td>
                          <td className="px-3 py-1.5 text-sm text-white">
                            {formatPrice(variant.priceOffline)}
                          </td>
                          <td className="px-3 py-1.5 text-sm text-white">
                            {formatPrice(variant.priceOnline)}
                          </td>
                          <td className="px-3 py-1.5 text-sm text-white">
                            {variant.stock}
                          </td>
                          <td className="px-3 py-1.5 text-sm text-white">
                            {variant.sku}
                          </td>
                          <td>
                            <button onClick={() => removeVariant(variant.name)}>
                              <X className="size-4 text-red-500" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    Batal
                  </button>
                </DialogClose>
                <button
                  onClick={saveProduct}
                  disabled={LoadingSaveProduct}
                  className="bg-primary hover:bg-primary/80 rounded-md px-3 py-2 text-sm font-semibold text-white"
                >
                  {LoadingSaveProduct ? "Loading..." : "Simpan"}
                </button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        <ListManageProduct
          key={refreshKey}
          category={selectedCategory}
          onEditProduct={handleEditProduct}
        />
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="sm:max-w-[425px] md:max-w-3/4">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-white">
                Edit Menu
              </DialogTitle>
              <DialogDescription>
                Edit informasi menu. Klik simpan ketika sudah selesai.
              </DialogDescription>
            </DialogHeader>

            {editingProduct && (
              <EditProductDialog
                product={editingProduct}
                onClose={() => setOpenEditDialog(false)}
              />
            )}
            {/* <p>{editingProduct?.name}</p> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
