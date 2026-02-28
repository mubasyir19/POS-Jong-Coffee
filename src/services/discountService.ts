import { Discount } from "@/types/discount";
import { API_URL } from "@/utils/config";

export const getAllDiscount = async () => {
  try {
    const res = await fetch(`${API_URL}/discount/all`);
    const data = await res.json();

    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const getDetailDiscount = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/discount/detail/${id}`, {
      credentials: "include",
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const addDiscount = async (input: Omit<Discount, "id">) => {
  try {
    const res = await fetch(`${API_URL}/discount/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      credentials: "include",
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const editDiscount = async (id: string, input: Omit<Discount, "id">) => {
  try {
    const res = await fetch(`${API_URL}/discount/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      credentials: "include",
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const deleteDiscount = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/discount/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();

    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};
