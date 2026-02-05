import { addCategory, getAllCategory } from "@/services/categoryService";
import { Category, InputCategory } from "@/types/category";
import { useCallback, useState } from "react";

export function useCategory() {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategory();
      setCategory(data);
      return data;
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

  const addNewCategory = async (payload: InputCategory) => {
    try {
      const newCategory = await addCategory(payload);

      setCategory((prev) => [newCategory, ...prev]);
      return newCategory;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unexpected error");
      }
    }
  };

  return { category, loading, error, fetchCategory, addNewCategory };
}
