import { useEffect, useState } from "react";
import { User } from "../lib/types";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

/// Custom hook to fetch user data from Supabase
export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return { user, loading };
};
