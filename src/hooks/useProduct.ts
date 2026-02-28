import {
  addProduct,
  addVariantProduct,
  deleteProduct,
  deleteVariant,
  getAllProductsByCategory,
  getDetailVariant,
  getProductById,
  getVariantBydProduct,
  updateProduct,
} from "@/services/productsService";
import {
  AddProduct,
  InputVariant,
  ProductCoffee,
  ProductVariant,
} from "@/types/product";
import { useCallback, useEffect, useState } from "react";

export function useFetchProductByCategory(categoryId: string) {
  const [products, setProducts] = useState<ProductCoffee[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    async function fetchByCategory() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllProductsByCategory(categoryId);
        // console.log("(hooks) data product = ", data);

        setProducts(data.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchByCategory();
  }, [categoryId]);

  return { products, loading, error };
}

export function useProductById(id: string) {
  const [product, setProduct] = useState<ProductCoffee | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id);

        if (res.code !== "SUCCESS") throw new Error("Failed to fetch product");

        setProduct(res.data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

export function useProducts() {
  const [products, setProducts] = useState<ProductCoffee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllProductsByCategory(categoryId);

      setProducts(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts };
}

export function useSaveProduct() {
  const [data, setData] = useState<AddProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProduct = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addProduct(formData);
      setData(res);
      return res;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { handleSaveProduct, data, loading, error };
}

export function useEditProduct() {
  const [data, setData] = useState<ProductCoffee | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<string | null>(null);

  const handleSaveEditProduct = async (id: string, formData: FormData) => {
    setEditLoading(true);
    setErrorEdit(null);
    try {
      const res = await updateProduct(formData, id);
      setData(res);
      return res;
    } catch (error) {
      setErrorEdit((error as Error).message);
    } finally {
      setEditLoading(false);
    }
  };

  return { handleSaveEditProduct, data, editLoading, errorEdit };
}

export function useDeleteProduct() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await deleteProduct(id);
      return res;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteProduct, loading, error };
}

export function useVariantsByProductId(productId: string) {
  const [dataVariants, setDataVariants] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVariant = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVariantBydProduct(productId);

      if (res.code !== "SUCCESS") throw new Error("Failed to fetch product");

      setDataVariants(res.data);
      return res.data;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!productId) return;

    fetchVariant(productId);
    // console.log("(hooks) hasil fetch variant - ", fetchVariant);
  }, [productId, fetchVariant]);

  return { dataVariants, fetchVariant, loading, error };
}

export function useVariantDetail(productId: string) {
  const [dataVariant, setDataVariants] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetailVariant = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDetailVariant(productId);

      if (res.code !== "SUCCESS") throw new Error("Failed to fetch product");

      setDataVariants(res.data);
      return res.data;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!productId) return;

    fetchDetailVariant(productId);
    // console.log("(hooks) hasil fetch variant - ", fetchVariant);
  }, [productId, fetchDetailVariant]);

  return { dataVariant, fetchDetailVariant, loading, error };
}

export function useAddVariant() {
  const [variant, setVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddVariant = async (input: InputVariant) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addVariantProduct(input);
      setVariant(res);
      return res;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddVariant, variant, loading, error };
}

export function useDeleteVariant() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteVariant = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await deleteVariant(id);
      return res;
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteVariant, loading, error };
}
