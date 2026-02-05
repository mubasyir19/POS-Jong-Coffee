import {
  useProductById,
  useVariantDetail,
  useVariantsByProductId,
} from "@/hooks/useProduct";
import { OrderItem } from "@/types";
import React from "react";
import CartItem from "./CartItem";
import { useOrderStore } from "@/store/orderStore";

interface CartItemWrapperProps {
  item: OrderItem;
}

export default function CartItemWrapper({ item }: CartItemWrapperProps) {
  const { product, loading } = useProductById(item.productId);
  const { increaseQty, decreaseQty, removeItem, updateNote } = useOrderStore();
  const { dataVariant } = useVariantDetail(product?.id as string);

  if (loading)
    return (
      <div className="text-text-light flex justify-center text-sm">
        Loading...
      </div>
    );

  return (
    <CartItem
      key={item.productVariantId}
      {...item}
      price={(dataVariant?.priceOffline as number) || 0 * item.quantity}
      nameVariant={dataVariant?.name as string}
      productName={dataVariant?.product?.name as string}
      quantity={item.quantity}
      addQty={() => increaseQty(item.productVariantId)}
      minQty={() => decreaseQty(item.productVariantId)}
      onRemove={() => removeItem(item.productVariantId)}
      note={item.note as string}
      onNoteChange={(note: string) => updateNote(item.productVariantId, note)}
    />
  );
}
