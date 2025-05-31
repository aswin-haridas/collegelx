import { supabase } from "@/shared/lib/supabase";
import { useEffect, useState } from "react";

interface UseSupabaseResult<T> {
  data: T[] | null;
  error: string | null;
  loading: boolean;
}

// ...existing code...
export default function useSupabase<T = any>(
  tableName: string,
  columns: string[] = ["*"],
  equalColumn: string | null = null,
  equalValue: string | null = null,
): UseSupabaseResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      setError(null);

      if (!tableName) {
        setError("Table name is required.");
        setLoading(false);
        return;
      }

      try {
        let query = supabase.from(tableName).select(columns.join(","));

        // Conditionally chain .eq() if both column and value are provided
        if (equalColumn && equalValue !== null) {
          query = query.eq(equalColumn, equalValue);
        }

        const { data: resultData, error: queryError } = await query;

        if (queryError) {
          setError(queryError.message);
        } else {
          setData((resultData as T[]) || []);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

  }, [tableName, columns.join(","), equalColumn, equalValue]);

  return { data, error, loading };
}
