import { API_URL } from "@/utils/config";

export const getAllUnits = async () => {
  try {
    const res = await fetch(`${API_URL}/unit/all`, {
      credentials: "include",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const getDetailUnit = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/unit/detail/${id}`, {
      credentials: "include",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};
