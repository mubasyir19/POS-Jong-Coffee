import React from "react";
import CardMenu from "./CardMenu";
import { useOrderStore } from "@/store/orderStore";
import { useFetchProductByCategory } from "@/hooks/useProduct";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ListMenuProps {
  category: string;
}

export default function ListMenu({ category }: ListMenuProps) {
  const { products } = useFetchProductByCategory(category);
  const addItem = useOrderStore((state) => state.addItem);

  return (
    <div className="no-scrollbar mt-4 grid grid-cols-1 gap-6 overflow-x-hidden overflow-y-auto py-4 md:grid-cols-2 lg:grid-cols-3">
      {/* <Dialog>
        <DialogTrigger asChild> */}
      {products?.map((menu, i) => {
        const variantLength = menu.productVariants.length;
        return (
          <CardMenu
            key={i}
            imageLink={menu.imageUrl as string}
            name={menu.name}
            // price={menu.price}
            product={menu}
            totalVariants={variantLength}
            // onAdd={() => {
            //   addItem({
            //     productId: menu.id,
            //     quantity: 1,
            //     note: "",
            //   });
            // }}
          />
        );
      })}
      {/* </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Variant</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
