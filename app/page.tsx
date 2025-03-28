    // "use client";

    // import { useEffect, useState } from "react";
    // import { useAuth } from "@/lib/hooks/useAuth";
    // import { styles } from "@/lib/styles";
    // import Header from "@/components/Sidebar";
    // import { supabase } from "@/lib/supabase";
    // import { Loader2 } from "lucide-react";
    // import ItemCard from "@/components/ItemCard";
    // import { Item } from "@/lib/types";

    // interface ItemCardProps {
    //   item: Item;
    // }
    // export default function HomePage() {
    //   // Set requireAuth to false since this is a public page
    //   const { isAuthenticated, isLoading } = useAuth(false);
    //   const [items, setItems] = useState<Item[]>([]);
    //   const [loading, setLoading] = useState(true);

    //   useEffect(() => {
    //     async function fetchItems() {
    //       try {
    //         const { data, error } = await supabase
    //           .from("items")
    //           .select(
    //             `
    //             *,
    //             seller:userId (
    //               name,
    //               profile_image
    //             )
    //           `
    //           )
    //           .eq("status", "available")
    //           .order("created_at", { ascending: false });

    //         if (error) throw error;
    //         setItems(data || []);
    //       } catch (error) {
    //         console.error("Error fetching items:", error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     }

    //     fetchItems();
    //   }, []);

    //   if (loading || isLoading) {
    //     return (
    //       <div className="h-screen">
    //         <Header activeTextColor={styles.warmPrimary} />
    //         <div className="flex justify-center items-center h-full ml-64">
    //           <Loader2
    //             className="h-8 w-8 animate-spin"
    //             style={{ color: styles.warmPrimary }}
    //           />
    //         </div>
    //       </div>
    //     );
    //   }

    //   return (
    //     <div className="min-h-screen">
    //       <Header activeTextColor={styles.warmPrimary} />
    //       <div className="p-4 ml-64">
    //         <div className="max-w-7xl mx-auto">
    //           <h1
    //             className="text-2xl font-semibold mb-6"
    //             style={{ color: styles.warmText }}
    //           >
    //             Available Items
    //           </h1>

    //           {items.length === 0 ? (
    //             <div className="text-center py-12">
    //               <p className="text-gray-500">No items available at the moment.</p>
    //             </div>
    //           ) : (
    //             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //               {items.map((item) => (
    //                 <ItemCard key={item.id} item={item} />
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import Header from "@/components/Sidebar";
import { styles } from "@/lib/styles";
import Link from "next/link";
import ChatPage from "./chat/page";
interface Item {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category?: string;
  year?: number;
  department?: string;
  productType?: string;
}

const departments = ["Computer Science", "AI", "Mech", "EC", "EEE", "Civil", "All"];
const productTypes = ["Notes", "Uniform", "Stationary", "Furniture", "Others", "All"];
const years = [1, 2, 3, 4, "All"];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | number>("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedProductType, setSelectedProductType] = useState("All");
  const [sortByPrice, setSortByPrice] = useState("asc");

  useEffect(() => {
    async function fetchItems() {
      try {
        let query = supabase.from("items").select("*").eq("availability", "true");

        if (selectedYear !== "All") query = query.eq("year", selectedYear);
        if (selectedDepartment !== "All") query = query.eq("department", selectedDepartment);
        if (selectedProductType !== "All") query = query.eq("productType", selectedProductType);
        query = query.order("price", { ascending: sortByPrice === "asc" });

        const { data, error } = await query;

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [selectedYear, selectedDepartment, selectedProductType, sortByPrice]);

  // useEffect(() => {
  //   async function fetchItems() {
  //     try {
  //       const { data, error } = await supabase
  //         .from("items")
  //         .select(
  //           `
  //           *,
  //           seller:seller_id (
  //             name,
  //             profile_image
  //           )
  //         `
  //         )
  //         .eq("status", "available")
  //         .order("created_at", { ascending: false });

  //       if (error) throw error;
  //       setItems(data || []);
  //     } catch (error) {
  //       console.error("Error fetching items:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchItems();
  // }, []);
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="p-4 ml-64">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-semibold mb-6 mt-6" style={{ color: styles.warmPrimaryDark }}>Available Items</h1>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded-lg border-yellow-600"
              />
              {/* <select onChange={(e) => setSelectedYear(e.target.value)} className="p-2 border rounded-lg">
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select onChange={(e) => setSelectedDepartment(e.target.value)} className="p-2 border rounded-lg">
                {departments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
              <select onChange={(e) => setSelectedProductType(e.target.value)} className="p-2 border rounded-lg">
                {productTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select> */}
              <button onClick={() => setSortByPrice(sortByPrice === "asc" ? "desc" : "asc")} className="p-2 border border-amber-700 rounded-lg">
                Sort by Price: {sortByPrice === "asc" ? "Low to High" : "High to Low"}
              </button>
            </div>

            {filteredItems.length === 0 ? (
              <p>No items available matching the criteria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Link href={`/buy/${item.id}`} key={item.id} className="block h-full">
                    <div className="border border-stone-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className="relative h-44 bg-gray-100">
                        {item.images?.length > 0 ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-medium text-lg mb-2" style={{ color: styles.warmText }}>{item.title}</h3>
                        <p className="text-gray-600 mb-2 text-sm flex-grow">{item.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold" style={{ color: styles.warmText }}>₹{item.price.toFixed(2)}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
