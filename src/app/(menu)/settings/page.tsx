"use client";

import CategoryTabs from "@/components/molecules/CategoryTabs";
import AboutUs from "@/components/organism/Tab/AboutUs";
import ApperanceTab from "@/components/organism/Tab/ApperanceTab";
import DiscountManage from "@/components/organism/Tab/DiscountManage";
import ManagementProduct from "@/components/organism/Tab/ManagementProduct";
import NotificationTab from "@/components/organism/Tab/NotificationTab";
import SecurityTab from "@/components/organism/Tab/SecurityTab";
import StoreTab from "@/components/organism/Tab/StoreTab";
import {
  BadgePercent,
  Barcode,
  Bell,
  CircleAlert,
  Heart,
  LockKeyholeOpen,
  Store,
} from "lucide-react";
import React, { useState } from "react";

const tabs = [
  {
    name: "apperance",
    label: "Apperance",
    desc: "Dark and light mode, font size",
    icon: Heart,
  },
  {
    name: "store",
    label: "Your Store",
    desc: "",
    icon: Store,
  },
  {
    name: "management",
    label: "Product management",
    desc: "Manage your product, pricing, etc",
    icon: Barcode,
  },
  {
    name: "discount",
    label: "Discount management",
    desc: "Manage discount store",
    icon: BadgePercent,
  },
  {
    name: "notification",
    label: "Notification",
    desc: "Customize your notifications",
    icon: Bell,
  },
  {
    name: "security",
    label: "Security",
    desc: "Configure passsword, PIN, etc",
    icon: LockKeyholeOpen,
  },
  {
    name: "about",
    label: "About us",
    desc: "Find out more about POS",
    icon: CircleAlert,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("management");

  const handleClikTab = (name: string) => {
    setActiveTab(name);
  };

  const renderContentTab = () => {
    switch (activeTab) {
      case "apperance":
        return <ApperanceTab />;
      case "store":
        return <StoreTab />;
      case "management":
        return <ManagementProduct />;
      case "discount":
        return <DiscountManage />;
      case "notification":
        return <NotificationTab />;
      case "security":
        return <SecurityTab />;
      case "about":
        return <AboutUs />;
      default:
        return <ManagementProduct />;
    }
  };

  return (
    <div className="flex h-screen flex-col p-6">
      <h1 className="font-semibold text-white lg:text-2xl xl:text-3xl">
        Settings
      </h1>
      <div className="mt-6 flex h-full flex-row gap-6">
        <div className="bg-background rounded-lg">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isFirst = i === 0;
            const isLast = i === tabs.length - 1;

            return (
              <div
                key={i}
                id="menu-setting"
                onClick={() => handleClikTab(tab.name)}
                className={`group flex cursor-pointer items-start gap-2 p-6 transition-all duration-300 ${activeTab === tab.name ? "bg-primary/30" : "hover:bg-primary/30"} ${isFirst ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`}
              >
                <Icon
                  className={`mt-1 size-4 ${activeTab === tab.name ? "text-primary" : "text-text-secondary group-hover:text-primary"}`}
                />
                <div className="">
                  <p
                    className={`text-base font-medium ${activeTab === tab.name ? "text-primary" : "group-hover:text-primary text-white"}`}
                  >
                    {tab.label}
                  </p>
                  <p className="text-text-secondary mt-1 text-sm">{tab.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-background flex-1 overflow-hidden rounded-lg">
          {renderContentTab()}
        </div>
      </div>
    </div>
  );
}
