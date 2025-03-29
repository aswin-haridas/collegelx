"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { styles } from "@/lib/styles";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface Item {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category?: string;
  year?: number;
  department?: string;
}

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
  "Other",
];

const category = ["Notes", "Uniform", "Stationary", "Others", "All"];
const years = [1, 2, 3, 4, "All"];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | number>("All");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedcategory, setSelectedcategory] = useState("All");
  const [sortByPrice, setSortByPrice] = useState("asc");

  useEffect(() => {
    async function fetchItems() {
      try {
        let query = supabase
          .from("items")
          .select("*")
          .eq("status", "available");

        if (selectedYear !== "All") query = query.eq("year", selectedYear);
        if (selectedDepartment !== "All")
          query = query.eq("department", selectedDepartment);
        if (selectedcategory !== "All")
          query = query.eq("category", selectedcategory);
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
  }, [selectedYear, selectedDepartment, selectedcategory, sortByPrice]);

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
        <Sidebar />
        <div className="p-4 ml-64">
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
                  placeholder="Search by title..."
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
              </div>

              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value === "All" ? "All" : Number(e.target.value)
                    )
                  }
                  className="p-2 border rounded-lg border-yellow-600"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year === "All" ? "All Years" : `Year ${year}`}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="p-2 border rounded-lg border-yellow-600"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "All" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedcategory}
                  onChange={(e) => setSelectedcategory(e.target.value)}
                  className="p-2 border rounded-lg border-yellow-600"
                >
                  {category.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Product Types" : type}
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
                            alt={item.title}
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
                          {item.title}
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
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {item.category}
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
