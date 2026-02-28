"use client";

import { useOrderStore } from "@/store/orderStore";
import React, { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/helpers/formatPrice";
import CartItemWrapper from "../molecules/CartItemWrapper";
import { useCheckoutOrder } from "@/hooks/useOrder";
import { useGetProfile } from "@/hooks/useUser";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BadgePercent } from "lucide-react";
import { Discount } from "@/types/discount";
import { useGetAllDiscount } from "@/hooks/useDiscount";

interface FormOrderProps {
  onProceed: (orderId: string) => void;
  resetSignal?: boolean;
  isProcessing?: boolean;
}

export default function FormOrder({
  onProceed,
  resetSignal,
  isProcessing = false,
}: FormOrderProps) {
  const { items, clearOrder } = useOrderStore();
  const { handleNewCheckout } = useCheckoutOrder();
  const { dataUser } = useGetProfile();
  const {
    discount,
    loading: LoadingDiscount,
    error: ErrorDiscount,
  } = useGetAllDiscount();

  const [type, setType] = useState<"DINE_IN" | "TAKE_AWAY" | "DELIVERY">(
    "DINE_IN",
  );
  const [customer, setCustomer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [promo, setPromo] = useState<Discount | null>(null);
  const [openDialogPromo, setOpenDialogPromo] = useState<boolean>(false);

  const isLoading = isProcessing || isSubmitting;

  const choosePromo = (item: Discount) => {
    setPromo(item);
    setOpenDialogPromo(false);
  };

  const totalPrice = items.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);

  const finalPrice = promo
    ? totalPrice - (totalPrice * promo.value) / 100
    : totalPrice;

  const resetForm = useCallback(() => {
    setType("DINE_IN");
    setCustomer("");
    clearOrder();
  }, [clearOrder]);

  useEffect(() => {
    if (resetSignal !== undefined) {
      resetForm();
    }
  }, [resetForm, resetSignal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Please add items to order");
      return;
    }

    if (!customer || customer.trim() === "") {
      toast.error("Nama Customer harus diisi");
      return;
    }

    if (isLoading) return;

    setIsSubmitting(true);

    try {
      const checkoutData = {
        waiterId: dataUser?.id ?? "Admin Kasir",
        customer: customer,
        orderType: type,
        totalPrice: finalPrice,
        items: items,
        discountId: promo?.id ?? null,
      };

      const res = await handleNewCheckout(checkoutData);

      if (res.code === "CREATED") {
        onProceed(res.data.id);
      }
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white">Pesanan</h3>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setType("DINE_IN")}
            disabled={isLoading}
            className={`w-fit cursor-pointer rounded-lg border px-4 py-2 text-xs font-medium transition lg:text-sm ${
              type === "DINE_IN"
                ? "border-primary bg-primary text-white"
                : "border-dark-line text-primary hover:bg-primary hover:text-white"
            }`}
          >
            Dine in
          </button>
          <button
            type="button"
            onClick={() => setType("TAKE_AWAY")}
            disabled={isLoading}
            className={`w-fit cursor-pointer rounded-lg border px-4 py-2 text-xs font-medium transition lg:text-sm ${
              type === "TAKE_AWAY"
                ? "border-primary bg-primary text-white"
                : "border-dark-line text-primary hover:bg-primary hover:text-white"
            }`}
          >
            Take Away
          </button>
          <button
            type="button"
            onClick={() => setType("DELIVERY")}
            disabled={isLoading}
            className={`w-fit cursor-pointer rounded-lg border px-4 py-2 text-xs font-medium transition lg:text-sm ${
              type === "DELIVERY"
                ? "border-primary bg-primary text-white"
                : "border-dark-line text-primary hover:bg-primary hover:text-white"
            }`}
          >
            Delivery
          </button>
        </div>
      </div>
      <div className="mt-2">
        <label className="text-sm text-white">Nama Pelanggan</label>
        <input
          type="text"
          value={customer || ""}
          onChange={(e) => setCustomer(e.target.value)}
          disabled={isLoading}
          placeholder="Masukkan nama pelanggan"
          className="focus:border-primary mt-1.5 w-full rounded-md border border-transparent bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
          required
        />
      </div>
      <div className="mt-6 border-b border-gray-700 pb-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex-1">
            <p className="text-base font-semibold text-white">Item</p>
          </div>
          <div className="flex items-center gap-16">
            <p className="text-base font-semibold text-white">Qty</p>
            <p className="text-base font-semibold text-white">Price</p>
          </div>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="my-8 text-center">
          <p className="text-base font-semibold text-white">
            Belum ada pesanan
          </p>
        </div>
      ) : (
        <div className="no-scrollbar my-4 max-h-72 space-y-5 overflow-x-hidden overflow-y-auto">
          {items.map((item) => {
            return <CartItemWrapper key={item.productVariantId} item={item} />;
          })}
        </div>
      )}
      <div className="mt-3">
        <p className="text-lg font-semibold text-white">Promo</p>
      </div>
      <div className="mt-3">
        <Dialog open={openDialogPromo} onOpenChange={setOpenDialogPromo}>
          <DialogTrigger asChild>
            {promo ? (
              <button className="hover:bg-primary flex w-full cursor-pointer items-center gap-2 rounded-full border-none bg-gray-700 px-4 py-2 transition-all duration-200">
                <BadgePercent className="size-4 text-white" />
                <p className="text-sm font-medium text-white">
                  {promo.name} - Potongan {promo.value}%
                </p>
              </button>
            ) : (
              <button className="w-full rounded-md bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-200">
                Masukkan kode promo
              </button>
            )}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-white">Kode Promo</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {discount.map((item) => (
                <button
                  key={item.id}
                  onClick={() => choosePromo(item)}
                  className="hover:bg-primary flex w-full cursor-pointer items-center gap-2 rounded-full border-none bg-gray-700 px-4 py-2 transition-all duration-200"
                >
                  <BadgePercent className="size-4 text-white" />
                  <p className="text-sm font-medium text-white">
                    {item.name} - Potongan {item.value}%
                  </p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-3 border-b border-gray-700 pb-3">
        <p className="text-lg font-semibold text-white">Detail Pembayaran</p>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-text-light text-sm">Total Item</p>
          <p className="text-base font-medium text-white">
            {items.length} item
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-text-light text-sm">Diskon</p>
          <p className="text-base font-medium text-white">
            {promo ? `${promo.value} %` : `-`}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-text-light text-sm">Subtotal</p>
          <p className="text-base font-medium text-white">
            {formatPrice(totalPrice)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-text-light text-sm">Total</p>
          <p className="text-primary text-base font-medium">
            {formatPrice(finalPrice)}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading || items.length === 0}
          className={`w-full rounded-md py-1.5 text-center font-medium text-white ${
            isLoading || items.length === 0
              ? "bg-text-light cursor-not-allowed"
              : "bg-primary/80 hover:bg-primary"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            "Lanjut ke pembayaran"
          )}
        </button>
      </div>
    </div>
  );
}
