import { formatPrice } from "@/helpers/formatPrice";
import Image from "next/image";
import React from "react";
import { API_URL } from "@/utils/config";

interface MenuProps {
  imageLink: string;
  name: string;
  price: number;
  onAdd: () => void;
}

export default function CardMenu({ imageLink, name, price, onAdd }: MenuProps) {
  return (
    <div
      onClick={onAdd}
      className="bg-background hover:border-primary flex h-fit cursor-pointer flex-col items-center rounded-2xl border border-transparent p-4 text-center transition-transform duration-300"
    >
      <Image
        src={`${API_URL}${imageLink}`}
        width={132}
        height={132}
        alt="image menu"
        className="mb-4 h-28 w-28 rounded-full object-cover"
      />
      <div className="mx-auto mt-4 w-3/4 text-center">
        <p className="text-center text-base font-medium text-white">{name}</p>
        <p className="mt-2 text-sm text-white">{formatPrice(price)}</p>
      </div>
    </div>
  );
}
