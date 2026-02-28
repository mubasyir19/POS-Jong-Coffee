import { getAllDiscount, getDetailDiscount } from "@/services/discountService";
import { Discount } from "@/types/discount";
import { useCallback, useEffect, useState } from "react";

export function useGetAllDiscount() {
  const [discount, setDiscount] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllDiscounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllDiscount();
      setDiscount(data);
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

  useEffect(() => {
    fetchAllDiscounts();
  }, [fetchAllDiscounts]);

  return { discount, loading, error, fetchAllDiscounts };
}

export function useDetailDiscount(id: string) {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetailDiscount = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDetailDiscount(id);
      setDiscount(data);
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
  }, [id]);

  return { discount, loading, error, fetchDetailDiscount };
}
