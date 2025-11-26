"use client";

import MostProductCard from "@/components/molecules/MostProductCard";
import TableReport from "@/components/molecules/TableReport";
import ChartOrder from "@/components/organism/ChartOrder";
import { formatPrice } from "@/helpers/formatPrice";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useListOrder, useMostOrderedProducts } from "@/hooks/useOrder";
import Image from "next/image";
import React from "react";

export default function DashboardPage() {
  const { listOrder, loading: loadingListOrder, error } = useListOrder();
  const {
    mostProducts,
    loading: loadingMostProducts,
    error: errorMostProducts,
  } = useMostOrderedProducts();
  const {
    dataStats,
    loading: loadingDataStats,
    error: errorDataStats,
  } = useDashboardStats();

  return (
    <div className="flex h-screen gap-6 p-6">
      <div className="flex w-2/3 flex-col">
        <div className="border-b-2 border-[#393C49] pb-6">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-base text-[#ABBBC2]">Tuesday, 2 Feb 2021</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="bg-background rounded-lg p-4">
            {/* <div className="flex items-center gap-3">
              <div className="bg-surface w-fit rounded-lg p-1.5">
                <Image
                  src={`/icons/ic-coin.svg`}
                  width={24}
                  height={24}
                  alt="icon"
                  className="size-6"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-emerald-300">+32.04%</p>
                <div className="rounded-full bg-emerald-300/20 p-0.5">
                  <ArrowUp className="size-4 text-emerald-300" />
                </div>
              </div>
            </div> */}
            <div className="mt-2">
              <h1 className="text-3xl font-semibold text-white">
                {formatPrice(dataStats?.totalRevenue as number)}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#ABBBC2]">
                Total Revenue
              </p>
            </div>
          </div>
          <div className="bg-background rounded-lg p-4">
            {/* <div className="flex items-center gap-3">
              <div className="bg-surface w-fit rounded-lg p-1.5">
                <Image
                  src={`/icons/ic-order.svg`}
                  width={24}
                  height={24}
                  alt="icon"
                  className="size-6"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-red-300">-12.40%</p>
                <div className="rounded-full bg-red-300/20 p-0.5">
                  <ArrowDown className="size-4 text-red-300" />
                </div>
              </div>
            </div> */}
            <div className="mt-2">
              <h1 className="text-3xl font-semibold text-white">
                {dataStats?.totalDishOrdered}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#ABBBC2]">
                Total Dish Ordered
              </p>
            </div>
          </div>
          <div className="bg-background rounded-lg p-4">
            {/* <div className="flex items-center gap-3">
              <div className="bg-surface w-fit rounded-lg p-1.5">
                <Image
                  src={`/icons/ic-customer.svg`}
                  width={24}
                  height={24}
                  alt="icon"
                  className="size-6"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-emerald-300">+2.40%</p>
                <div className="rounded-full bg-emerald-300/20 p-0.5">
                  <ArrowUp className="size-4 text-emerald-300" />
                </div>
              </div>
            </div> */}
            <div className="mt-2">
              <h1 className="text-3xl font-semibold text-white">
                {dataStats?.totalOrder}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#ABBBC2]">
                Total Order
              </p>
            </div>
          </div>
        </div>
        <div className="bg-background mt-6 flex-1 rounded-lg px-4 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Order Report</h2>
            <button className="flex items-center gap-2.5 rounded-lg border-2 border-[#393C49] px-4 py-3">
              <Image
                src={`/icons/ic-option.svg`}
                width={20}
                height={20}
                alt="icon"
                className="size-5 text-white"
              />
              <span className="text-sm font-medium text-white">
                Filter Order
              </span>
            </button>
          </div>
          {/* Table Order Report */}
          {loadingListOrder ? (
            <p className="text-center text-base text-white">Loading...</p>
          ) : (
            <TableReport
              orderList={listOrder?.data || []}
              meta={
                listOrder?.meta || {
                  currentPage: 1,
                  itemsPerPage: 10,
                  totalItems: 0,
                  totalPages: 0,
                  hasNextPage: false,
                  hasPrevPage: false,
                }
              }
            />
          )}
        </div>
      </div>
      <div className="h-screen w-1/3">
        <div className="bg-background rounded-lg p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Most Ordered</h2>
            {/* <select
              name=""
              id=""
              className="rounded-lg border-2 border-[#393C49] px-4 py-3 text-white"
            >
              <option value="">Today</option>
            </select> */}
          </div>
          <hr className="my-5 border border-[#393C49]" />
          <div className="space-y-4">
            {loadingMostProducts ? (
              <p className="text-center text-base text-white">Loading...</p>
            ) : (
              mostProducts?.map((item, i) => (
                <MostProductCard
                  key={i}
                  productName={item.product.name}
                  imageProduct={item.product.imageUrl}
                  totalOrdered={item.totalOrdered}
                />
              ))
            )}
          </div>
        </div>
        <ChartOrder />
      </div>
    </div>
  );
}
