// app/browse/page.tsx (structure outline)
import Header from "@/shared/components/Header";
import { supabase } from "@/shared/lib/supabase";
import ItemListings from "./components/ItemListings"; // New client component
import { Item } from "@/types"; // Keep Item type if needed for casting

export default async function ItemsPage() {
  const { data, error } = await supabase.from("listings").select("*");

  if (error) {
    console.error("Error fetching items:", error);
    // Optionally render an error message to the user
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Error loading items. Please try again later.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <ItemListings initialItems={(data as Item[]) || []} />
    </>
  );
}
