import { API_URL } from "@/utils/config";

export const getDashboardDataStats = async () => {
  try {
    const res = await fetch(`${API_URL}/dashboard/stats`, {
      credentials: "include",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const getCategoryDataStats = async () => {
  try {
    const res = await fetch(`${API_URL}/dashboard/category/stats`, {
      credentials: "include",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};
