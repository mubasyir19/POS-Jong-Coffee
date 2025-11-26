import {
  getCategoryDataStats,
  getDashboardDataStats,
} from "@/services/dashboardService";
import { CategoryStats, DashboardStats } from "@/types/dashboard";
import { useEffect, useState } from "react";

export function useDashboardStats() {
  const [dataStats, setDataStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getDashboardDataStats();

        if (res.code !== "SUCCESS")
          throw new Error("Failed to fetch data stats");

        setDataStats(res.data);

        return res.data;
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { dataStats, loading, error };
}

export function useCategoryStats() {
  const [dataStats, setDataStats] = useState<CategoryStats[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCategoryDataStats();

        if (res.code !== "SUCCESS")
          throw new Error("Failed to fetch data stats");

        setDataStats(res.data);

        return res.data;
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { dataStats, loading, error };
}
