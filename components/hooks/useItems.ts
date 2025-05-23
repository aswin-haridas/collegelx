import { supabase } from "@/shared/lib/supabase";
import {promote}
import { useState } from "react";


const useItems = () => {
    const [featuredItems, setFeaturedItems] = useState<Item[]>([]);

    const fetchFeaturedItems = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "available")
        .limit(4)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeaturedItems(data || []);
    };
};

export default useItems;
