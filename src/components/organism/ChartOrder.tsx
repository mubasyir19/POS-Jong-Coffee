import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useCategory } from "@/hooks/useCategory";
import { useCategoryStats } from "@/hooks/useDashboard";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartOrder() {
  const { category, fetchCategory } = useCategory();
  const { dataStats } = useCategoryStats();

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  console.log("ini statistik kategori", dataStats);

  const categoryName = category.map((item) => item.name);
  const categoryStats = dataStats?.map((item) => item.totalOrdered);

  const data = {
    // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: categoryName,
    datasets: [
      {
        label: "# of Votes",
        // data: [12, 19, 3, 5, 2, 3],
        data: categoryStats,
        backgroundColor: ["#65B0F6", "#FFB572", "#FF7CA3", "#EA7C69"],
        borderColor: ["#65B0F6", "#FFB572", "#FF7CA3", "#EA7C69"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        // display: false,
        position: "top" as const,
        align: "center" as const,
      },
      title: {
        display: false,
      },
      scales: {
        x: {
          stacked: false,
          barPercentage: 1,
          categoryPercentage: 1,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div className="bg-background mt-6 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Most Type of Order</h2>
      </div>
      <div className="">
        <Doughnut data={data} options={options} />;
      </div>
    </div>
  );
}
