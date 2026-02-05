import React from "react";
import ProductManagementCard from "./ProductManagementCard";
import { useFetchProductByCategory } from "@/hooks/useProduct";
import { API_IMG_URL } from "@/utils/config";
import { ProductCoffee } from "@/types/product";

interface ListManageProductProps {
  category: string;
  onEditProduct?: (product: ProductCoffee) => void;
}

export default function ListManageProduct({
  category,
  onEditProduct,
}: ListManageProductProps) {
  const { products } = useFetchProductByCategory(category);

  return (
    <>
      {/* {selectedCategory?.menu.map((menu, i) => ( */}
      {products?.map((menu, i) => (
        <ProductManagementCard
          key={i}
          // imageLink="/images/menu1.png"
          imageLink={`${API_IMG_URL}${menu.imageUrl}`}
          name={menu.name}
          variants={menu.productVariants}
          // onEditClick={() => onEditProduct()}
          onEditClick={() => {
            if (onEditProduct) {
              onEditProduct({
                id: menu.id,
                name: menu.name,
                imageUrl: menu.imageUrl,
                categoryId: menu.categoryId,
                productVariants: menu.productVariants,
              });
            }
          }}
        />
      ))}
    </>
  );
}
