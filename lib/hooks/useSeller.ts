import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";

export function useSeller(sellerId: string | undefined) {
  const [seller, setSeller] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSeller() {
      if (!sellerId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("userid", sellerId)
          .single();

        if (error) throw error;
        setSeller(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSeller();
  }, [sellerId]);

  return { seller, loading, error };
}
