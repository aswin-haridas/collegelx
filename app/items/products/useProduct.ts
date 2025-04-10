import { useCallback } from "react";
import { supabase } from "@/shared/lib/supabase";
import { Item } from "@/shared/lib/types";
import toast from "react-hot-toast";

export const useProduct = (user_id: String) => {
  const fetchItems = useCallback(async () => {
    let data, error;

    if (user_id) {
      const response = await supabase.from("items").select("*");
      data = response.data;
      error = response.error;
    } else {
      const response = await supabase
        .from("items")
        .select("*")
        .eq("status", "available");
      data = response.data;
      error = response.error;
    }

    if (error) {
      toast.error("Error fetching items: " + error.message);
      return null;
    }

    if (data) {
      toast.success("Items fetched successfully!");
    }
    return data as Item[];
  }, [user_id]);

  return { fetchItems };
};
