"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { Item } from "@/lib/types";

export default function HomePage() {
  // Set requireAuth to false since this is a public page
  const { isAuthenticated, isLoading } = useAuth(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from("items")
          .select(
            `
            *,
            seller:seller_id (
              name,
              profile_image
            )
          `
          )
          .eq("status", "available")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading || isLoading) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.warmPrimary }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activeTextColor={styles.warmPrimary} />
      <div className="p-4 ml-64">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-2xl font-semibold mb-6"
            style={{ color: styles.warmText }}
          >
            Available Items
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No items available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
