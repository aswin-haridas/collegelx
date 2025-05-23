import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export const useProduct = (itemId?: string) => {
  const [product, setProduct] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        throw error;
      }

      setProduct(data);
      return data;
    } catch (err: unknown) {
      console.error("Error fetching product:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchProduct(itemId);
    }
  }, [itemId]);

  return {
    product,
    loading,
    error,
    fetchProduct,
  };
};
