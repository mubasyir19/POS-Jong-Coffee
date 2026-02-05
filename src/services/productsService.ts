import { InputVariant } from "@/types/product";
import { API_URL } from "@/utils/config";

export const getAllProductsByCategory = async (categoryId: string) => {
  try {
    const res = await fetch(`${API_URL}/product/${categoryId}`, {
      credentials: "include",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/product/detail/${id}`, {
      credentials: "include",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const addProduct = async (formData: FormData) => {
  try {
    const res = await fetch(`${API_URL}/product/add`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add data");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const updateProduct = async (formData: FormData, id: string) => {
  try {
    const res = await fetch(`${API_URL}/product/edit/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/product/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Network error");
  }
};

export const getVariantBydProduct = async (productId: string) => {
  try {
    const res = await fetch(`${API_URL}/product/variant/${productId}`, {
      credentials: "include",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const getDetailVariant = async (productId: string) => {
  try {
    const res = await fetch(`${API_URL}/product/variant/detail/${productId}`, {
      credentials: "include",
    });
    const data = await res.json();

    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const addVariantProduct = async (input: InputVariant) => {
  try {
    const res = await fetch(`${API_URL}/product/variant/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error((error as Error).message || "Something went wrong");
  }
};

export const deleteVariant = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/product/variant/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete");
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    throw new Error((error as Error).message || "Network error");
  }
};
