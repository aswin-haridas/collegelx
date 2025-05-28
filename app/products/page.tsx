"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { styles } from "@/lib/styles";
import Link from "next/link";
import Header from "@/components/shared/Header";
import { Listing } from "@/types/index.ts"; // MODIFIED: Import Listing
// Removed Item import as it's replaced by Listing

// These filter arrays might need to be updated based on available categories from the DB
// const departments = [
//   "All",
//   "Computer Science",
//   "Electronics",
//   "Mechanical",
//   "Civil",
//   "Electrical",
//   "Other",
// ];

// const category = ["Notes", "Uniform", "Stationary", "Others", "All"];
// const years = [1, 2, 3, 4, "All"];

// TODO: Fetch categories from the database to populate filters dynamically
const categories = [ {id: 0, name: "All"}, {id: 1, name: "Textbooks"}, {id: 2, name: "Electronics"}, /* ... other categories */];


export default function ItemsPage() {
  const [items, setItems] = useState<Listing[]>([]); // MODIFIED: Item[] to Listing[]
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedYear, setSelectedYear] = useState<string | number>("All"); // REMOVED: Year filter
  // const [selectedDepartment, setSelectedDepartment] = useState("All"); // REMOVED: Department filter
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // MODIFIED: selectedcategory to selectedCategoryId, default to 0 for "All"
  const [sortByPrice, setSortByPrice] = useState("asc");

  const clearAllFilters = () => {
    setSearchQuery("");
    // setSelectedYear("All"); // REMOVED
    // setSelectedDepartment("All"); // REMOVED
    setSelectedCategoryId(0); // Reset to "All" categories
    setSortByPrice("asc");
  };

  useEffect(() => {
    async function fetchItems() {
      setLoading(true); // Moved setLoading to the beginning of fetch
      try {
        let query = supabase
          .from("listings") // MODIFIED: "items" to "listings"
          // MODIFIED: Select specific columns needed for display
          .select("id, title, description, price, images, category_id, status, condition, created_at") 
          .eq("status", "available");

        // if (selectedYear !== "All") query = query.eq("year", selectedYear); // REMOVED: Year filter
        // if (selectedDepartment !== "All") query = query.eq("department", selectedDepartment); // REMOVED: Department filter
        
        if (selectedCategoryId !== 0) { // 0 represents "All"
          query = query.eq("category_id", selectedCategoryId);
        }
        query = query.order("price", { ascending: sortByPrice === "asc" });

        const { data, error } = await query;

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching items:", error);
        // Optionally set an error state here to display to the user
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [selectedCategoryId, sortByPrice]); // MODIFIED: Dependencies for useEffect

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) // MODIFIED: item.name to item.title
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
      <Header />
      <div className="min-h-screen">
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            <h1
              className="text-4xl font-semibold mb-6 mt-6"
              style={{ color: styles.warmPrimaryDark }}
            >
              Available Items
            </h1>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded-lg border-yellow-600 flex-grow md:flex-grow-0"
                />
                <button
                  onClick={() =>
                    setSortByPrice(sortByPrice === "asc" ? "desc" : "asc")
                  }
                  className="p-2 border border-amber-700 rounded-lg"
                >
                  Sort by Price:{" "}
                  {sortByPrice === "asc" ? "Low to High" : "High to Low"}
                </button>
                <button
                  onClick={clearAllFilters}
                  className="p-2 border border-amber-700 rounded-lg bg-amber-50 hover:bg-amber-100"
                >
                  Clear All Filters
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* REMOVED: Year and Department select dropdowns */}
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                  className="p-2 border rounded-lg border-yellow-600"
                >
                  {/* TODO: Dynamically populate categories from a fetch call */}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <p>No items available matching the criteria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Link
                    href={`/buy/${item.id}`}
                    key={item.id}
                    className="block h-full"
                  >
                    <div className="border border-stone-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className="relative h-44 bg-gray-100">
                        {item.images?.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title} // MODIFIED: item.name to item.title
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3
                          className="font-medium text-lg mb-2"
                          style={{ color: styles.warmText }}
                        >
                          {item.title} {/* MODIFIED: item.name to item.title */}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm flex-grow">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span
                            className="font-bold"
                            style={{ color: styles.warmText }}
                          >
                            ₹{item.price.toFixed(2)}
                          </span>
                          {/* TODO: Display category name by fetching categories or joining */}
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            Cat ID: {item.category_id} 
                          </span>
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
