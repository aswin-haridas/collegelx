import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Item } from "@/lib/types";

export function useItem(id: string, approvedOnly: boolean = false) {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // const fetchItem = async () => {
    //   let query = supabase.from("items").select("*").eq("id", id);

    //   if (approvedOnly) {
    //     query = query.eq("approved", true);
    //   }

    //   const { data, error } = await supabase
    //   .from("items")
    //   .select("*")
    //   .eq("id", id)
    //   .single(); // Ensure only one result is returned
    
    // console.log("Supabase Response:", { data, error });
    
    // if (error) {
    //   console.error("Supabase Error:", error);
    // }
    
    //   if (error) {
    //     setError(error);
    //     setItem(null);
    //   } else {
    //     setItem(data);
    //   }
    //   setLoading(false);
    // };

    const fetchItem = async () => {
      let query = supabase.from("items").select("*").eq("id", id);
    
      if (approvedOnly) {
        query = query.eq("availability", true);
      }
    
      const { data, error } = await query.single();
    
      console.log("Supabase Response:", { data, error });
    
      if (error) {
        console.error("Supabase Error:", error);
        setError(error);
        setItem(null);
      } else {
        setItem(data);
      }
    
      setLoading(false);
    };
    
    fetchItem();
  }, [id, approvedOnly]);

  return { item, loading, error };
}
