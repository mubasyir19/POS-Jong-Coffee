import { formatPrice } from "@/helpers/formatPrice";
import { API_IMG_URL } from "@/utils/config";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CartItemProps {
  productId: string;
  imageProduct: string | null;
  productVariantId: string;
  quantity: number;
  price: number;
  nameVariant: string;
  productName: string;
  onRemove: () => void;
  addQty: () => void;
  minQty: () => void;
  note: string;
  onNoteChange: (note: string) => void;
}

export default function CartItem({
  imageProduct,
  quantity,
  price,
  nameVariant,
  productName,
  addQty,
  minQty,
  onRemove,
  note,
  onNoteChange,
}: CartItemProps) {
  const subtotal = (price || 0) * (quantity || 0);

  const resolvedImage =
    typeof imageProduct === "string" && imageProduct
      ? imageProduct.startsWith("http")
        ? imageProduct
        : `${API_IMG_URL}${imageProduct}`
      : "/images/placeholder.png";

  return (
    <div id="cart-item">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={resolvedImage}
            alt="menu1"
            width={48}
            height={48}
            className="size-12 rounded-full"
          />
          <div className="flex flex-col">
            <span className="flex max-w-40 flex-wrap text-sm font-medium text-gray-200">
              {productName} - {nameVariant}
            </span>
            <span className="text-xs text-gray-400">{formatPrice(price)}</span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <button onClick={minQty} className="text-primary text-xl">
              -
            </button>
            <p className="font-medium text-white">{quantity}</p>
            <button onClick={addQty} className="text-primary text-xl">
              +
            </button>
          </div>
          <div className="font-medium text-gray-200">
            {formatPrice(subtotal)}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Order Note..."
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="w-full rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
          />
        </div>
        <div className="">
          <button
            onClick={onRemove}
            className="rounded-md border border-red-400 p-2 transition hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
