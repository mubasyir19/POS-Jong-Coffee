"use client";

import { formatPrice } from "@/helpers/formatPrice";
import { PenLine, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { ProductVariant } from "@/types/product";

interface ProductManagementCardProps {
  imageLink?: string;
  name: string;
  variants?: ProductVariant[];
  onEditClick?: () => void;
}

export default function ProductManagementCard({
  imageLink,
  name,
  variants,
  onEditClick,
}: ProductManagementCardProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <div className="border-dark-line rounded-lg border">
      <div className="p-6">
        <Image
          src={imageLink || "/images/menu1.png"}
          width={127}
          height={127}
          alt="image menu"
          className="mx-auto mb-4 h-28 w-28 rounded-full object-cover"
        />
        <div className="mx-auto">
          <p className="text-center text-base font-medium text-white">{name}</p>
          <div className="mt-4">
            <table className="min-w-full overflow-hidden rounded-lg">
              <thead className="">
                <tr>
                  <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                    Variant
                  </th>
                  <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                    Offline
                  </th>
                  <th className="text-primary px-3 py-1.5 text-left text-sm font-semibold">
                    Online
                  </th>
                </tr>
              </thead>
              <tbody>
                {variants?.map((variant, i) => (
                  <tr key={i}>
                    <td className="px-3 py-1.5">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">
                          {variant.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {formatPrice(variant.priceOffline)}
                    </td>
                    <td className="px-3 py-1.5 text-sm text-white">
                      {formatPrice(variant.priceOnline)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-stretch">
        <button
          onClick={onEditClick}
          className="bg-primary flex w-full cursor-pointer items-center justify-center gap-2 rounded-bl-lg py-4 focus:outline-none"
        >
          <PenLine className="size-3.5 text-white" />
          <p className="text-sm font-semibold text-white">Edit Menu</p>
        </button>
        <button
          // onClick={onEditClick}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-br-lg bg-gray-700 py-4 focus:outline-none"
        >
          <Trash className="size-3.5 text-red-500" />
          <p className="text-sm font-semibold text-red-500">Remove Menu</p>
        </button>
      </div>
    </div>
  );
}
