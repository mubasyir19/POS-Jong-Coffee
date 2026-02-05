import Image from "next/image";
import React from "react";
import { API_IMG_URL } from "@/utils/config";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { formatPrice } from "@/helpers/formatPrice";
import { ProductCoffee } from "@/types/product";
import { Plus } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface MenuProps {
  product: ProductCoffee;
  imageLink?: string;
  name: string;
  totalVariants: number;
  // onAdd: () => void;
}

export default function CardMenu({
  imageLink,
  name,
  product,
  totalVariants,
  // onAdd,
}: MenuProps) {
  const addItem = useOrderStore((state) => state.addItem);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          // onClick={onAdd}
          className="bg-background hover:border-primary flex h-fit cursor-pointer flex-col items-center overflow-hidden rounded-2xl border border-transparent text-center transition-transform duration-300"
        >
          <Image
            src={`${API_IMG_URL}${imageLink}`}
            width={132}
            height={132}
            alt="image menu"
            // className="mb-4 h-28 w-28 rounded-full object-cover"
            className="h-32 w-full object-cover"
          />
          <div className="mx-auto w-3/4 p-4 text-center">
            <p className="text-center text-base font-medium text-white">
              {name}
            </p>
            <p className="text-primary mt-2 text-sm">
              {totalVariants} Variants
            </p>
            {/* <p className="mt-2 text-sm text-white">{formatPrice(price)}</p> */}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-1/2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            {name}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="text-white">Pilih Variant :</div>
        {/* <div className="space-y-3">
          {product.productVariants.map((variant) => (
            <div
              key={variant.id}
              onClick={() => {
                if (!variant.id) return;
                addItem({
                  productId: variant.productId,
                  productVariantId: variant.id,
                  quantity: 1,
                  price: variant.priceOffline,
                  note: "",
                });
              }}
              className="border-primary flex items-center justify-between rounded-lg border px-6 py-3"
            >
              <div className="">
                <p className="text-xl font-medium text-white">{variant.name}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white">Offline :</p>
                    <p className="text-primary text-sm font-medium">
                      {formatPrice(variant.priceOffline)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white">Online :</p>
                    <p className="text-primary text-sm font-medium">
                      {formatPrice(variant.priceOnline)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <button className="bg-primary/20 hover:bg-primary/50 flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200">
                  <Plus className="text-primary size-5" />
                </button>
              </div>
            </div>
          ))}
        </div> */}
        <Accordion type="multiple" className="space-y-3">
          {product.productVariants.map((variant) => (
            <AccordionItem key={variant.id} value={variant.id as string}>
              <AccordionTrigger className="border-primary bg-primary/20 rounded-lg border px-3 py-3 text-xl font-medium text-white">
                {variant.name}
              </AccordionTrigger>
              <div className="pl-6">
                <AccordionContent className="border-primary mt-2 flex items-center justify-between rounded-lg border p-3 text-white">
                  <p>
                    Offline :{" "}
                    <span className="text-primary">
                      {formatPrice(variant.priceOffline)}
                    </span>
                  </p>
                  <div className="">
                    <button
                      onClick={() => {
                        if (!variant.id) return;
                        addItem({
                          productId: variant.productId,
                          productVariantId: variant.id,
                          quantity: 1,
                          price: variant.priceOffline,
                          note: "",
                        });
                      }}
                      className="bg-primary/20 hover:bg-primary/50 flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
                    >
                      <Plus className="text-primary size-5" />
                    </button>
                  </div>
                </AccordionContent>
              </div>
              <div className="pl-6">
                <AccordionContent className="border-primary mt-2 flex items-center justify-between rounded-lg border p-3 text-white">
                  <p>
                    Online :{" "}
                    <span className="text-primary">
                      {formatPrice(variant.priceOnline)}
                    </span>
                  </p>
                  <div className="">
                    <button
                      onClick={() => {
                        if (!variant.id) return;
                        addItem({
                          productId: variant.productId,
                          productVariantId: variant.id,
                          quantity: 1,
                          price: variant.priceOnline,
                          note: "",
                        });
                      }}
                      className="bg-primary/20 hover:bg-primary/50 flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-200"
                    >
                      <Plus className="text-primary size-5" />
                    </button>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
