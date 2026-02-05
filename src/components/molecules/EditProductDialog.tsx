import { useCategory } from "@/hooks/useCategory";
import {
  useAddVariant,
  useDeleteVariant,
  useEditProduct,
  useVariantsByProductId,
} from "@/hooks/useProduct";
import { useFetchUnit } from "@/hooks/useUnit";
import { ProductCoffee, ProductVariant } from "@/types/product";
import { API_IMG_URL } from "@/utils/config";
import { Package, Tag, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditProductDialogProps {
  product: ProductCoffee;
  onProductChange?: (product: ProductCoffee) => void;
  onClose?: () => void;
}

export default function EditProductDialog({
  product,
  onProductChange,
  onClose,
}: EditProductDialogProps) {
  const { category, fetchCategory } = useCategory();
  const { dataUnit } = useFetchUnit();
  const { handleSaveEditProduct, editLoading } = useEditProduct();
  const { handleDeleteVariant } = useDeleteVariant();
  const { fetchVariant, loading, error } = useVariantsByProductId(product.id);
  const { handleAddVariant } = useAddVariant();

  const [currentProduct, setCurrentProduct] = useState<ProductCoffee>(product);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant>({
    name: "",
    unitId: "",
    productId: product.id,
    priceOffline: 0,
    priceOnline: 0,
    stock: 0,
    sku: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    typeof product.imageUrl === "string" ? product.imageUrl : null,
  );

  useEffect(() => {
    fetchCategory();
    // if (product.id) {
    //   dataVariants(product.id);
    // }
  }, [fetchCategory]);

  const handleProductChange = (updates: Partial<ProductCoffee>) => {
    const updated = { ...currentProduct, ...updates };
    setCurrentProduct(updated);
    onProductChange?.(updated);
  };

  const handleVariantChange = (updates: Partial<ProductVariant>) => {
    setCurrentVariant((prev) => ({ ...prev, ...updates }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        handleProductChange({ imageUrl: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentVariant.name.trim()) {
      toast.error("Nama variant harus diisi");
      return;
    }

    if (!currentVariant.unitId) {
      toast.error("Unit/satuan harus dipilih");
      return;
    }

    if (currentVariant.priceOffline <= 0) {
      toast.error("Harga offline harus lebih besar dari 0");
      return;
    }

    if (currentVariant.priceOnline <= 0) {
      toast.error("Harga online harus lebih besar dari 0");
      return;
    }

    if (!currentVariant.sku?.trim()) {
      toast.error("SKU harus diisi");
      return;
    }

    try {
      const res = await handleAddVariant(currentVariant);
      console.log("ini hasil tambah variant = ", res);

      const updatedVariants = await fetchVariant();

      setCurrentProduct((prev) => ({
        ...prev,
        productVariants: updatedVariants || [], // Pastikan ini array
      }));

      setCurrentVariant({
        name: "",
        unitId: "",
        productId: "",
        priceOffline: 0,
        priceOnline: 0,
        stock: 0,
        sku: "",
      });

      toast.success("Variant berhasil ditambahkan");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Gagal tambah: ${(error as Error).message}`);
    }
  };

  const removeVariant = async (id: string) => {
    try {
      await handleDeleteVariant(id);

      const updatedVariants = await fetchVariant();

      setCurrentProduct((prev) => ({
        ...prev,
        productVariants: updatedVariants || [], // Pastikan ini array
      }));

      toast.success("Variant dihapus");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Gagal hapus: ${(error as Error).message}`);
    }
  };

  const saveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi data
    if (!currentProduct.name.trim()) {
      toast.error("Nama produk tidak boleh kosong");
      return;
    }

    if (!currentProduct.categoryId) {
      toast.error("Kategori harus dipilih");
      return;
    }

    if (currentProduct.productVariants.length === 0) {
      toast.error("Minimal harus ada 1 variant produk");
      return;
    }

    // Validasi setiap variant
    const invalidVariant = currentProduct.productVariants.find(
      (v) => !v.name || !v.unitId || v.priceOffline <= 0 || v.priceOnline <= 0,
    );

    if (invalidVariant) {
      toast.error(
        "Mohon lengkapi semua data variant (nama, unit, harga offline > 0, harga online > 0)",
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", currentProduct.name);
      formData.append("categoryId", currentProduct.categoryId);

      // Append image hanya jika ada file baru
      if (currentProduct.imageUrl instanceof File) {
        formData.append("imageUrl", currentProduct.imageUrl);
      }

      // Append variants
      formData.append(
        "productVariants",
        JSON.stringify(
          currentProduct.productVariants.map((v) => ({
            id: v.id, // Include id jika ada untuk update variant
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
        variants: currentProduct.productVariants,
        imageUrl:
          currentProduct.imageUrl instanceof File ? "File baru" : "Gambar lama",
        variantsCount: currentProduct.productVariants.length,
      });

      await handleSaveEditProduct(currentProduct.id, formData);
      toast.success("Produk berhasil diperbarui");

      // Callback ke parent component jika ada
      onProductChange?.(currentProduct);

      // Tutup dialog setelah berhasil
      onClose?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Gagal menyimpan: ${(error as Error).message}`);
    }
  };

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Package className="size-6 text-white" />
        <h3 className="text-lg font-semibold text-white">Informasi Produk</h3>
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
                  handleProductChange({
                    name: e.target.value,
                  })
                }
                placeholder="Masukkan nomor referensi"
                className="border-primary bg-background mt-1.5 w-full rounded-md border px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
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
                  handleProductChange({
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
            <label className="block text-sm text-white">Gambar Produk</label>
            <div className="mt-2 flex-1 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition">
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
                    src={`${API_IMG_URL}${imagePreview}`}
                    width={150}
                    height={120}
                    alt="Preview"
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-2 text-gray-400">📷</div>
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
            <h3 className="text-lg font-semibold text-white">Variant Produk</h3>
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
                  handleVariantChange({
                    name: e.target.value,
                  })
                }
                required
                placeholder="Small / Hot / Iced"
                className="focus:border-primary bg-background mt-1.5 w-full rounded-md border border-gray-600 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:outline-none"
              />
            </div>
            <div className="">
              <label className="text-sm text-white">Pilih Unit/Satuan:</label>
              <select
                name="unitId"
                value={currentVariant.unitId}
                onChange={(e) =>
                  handleVariantChange({
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
                  handleVariantChange({
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
                  handleVariantChange({
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
                  handleVariantChange({
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
                  handleVariantChange({
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
          {currentProduct.productVariants.length > 0 && (
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
                {currentProduct.productVariants.map((variant, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">
                          {variant.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {variant.unit?.name || "-"}
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {variant.priceOffline}
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {variant.priceOnline}
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {variant.stock}
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {variant.sku}
                    </td>
                    <td>
                      <button
                        onClick={() => removeVariant(variant.id as string)}
                      >
                        <X className="size-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="">
          <button
            onClick={saveEditProduct}
            disabled={editLoading}
            className="bg-primary hover:bg-primary/80 rounded-md px-3 py-2 text-sm font-semibold text-white"
          >
            {editLoading ? "Loading..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
