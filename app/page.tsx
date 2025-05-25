"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Loader2 } from "lucide-react";
import { styles, playfair } from "./lib/styles";
import Link from "next/link";
import Header from "@/app/components/shared/Header";
import Image from "next/image";

type Item = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  year: number;
  department: string;
  images: string[];
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

const departments = [
  "All",
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
  const [filters, setFilters] = useState({
    search: "",
    year: "All",
    department: "All",
    category: "All",
    sortPrice: "asc",
  });

  const name =
    typeof window !== "undefined"
      ? sessionStorage.getItem("name") || "User"
      : "User";

  const clearFilters = () =>
    setFilters({
      search: "",
      year: "All",
      department: "All",
      category: "All",
      sortPrice: "asc",
    });

  useEffect(() => {
    async function fetchItems() {
      try {
        let query = supabase
          .from("products")
          .select("*")
          .eq("status", "available");

        if (filters.year !== "All") query = query.eq("year", filters.year);
        if (filters.department !== "All")
          query = query.eq("department", filters.department);
        if (filters.category !== "All")
          query = query.eq("category", filters.category);

        query = query.order("price", {
          ascending: filters.sortPrice === "asc",
        });
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
  }, [filters.year, filters.department, filters.category, filters.sortPrice]);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(filters.search.toLowerCase())
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
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 italic text-sm">Welcome {name}</p>
          <h1
            className="text-4xl font-semibold mb-6 mt-6"
            style={{ color: styles.primary_dark }}
          >
            Available Items
          </h1>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by title..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="p-2 border rounded-lg border-yellow-600 flex-grow md:flex-grow-0"
              />
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    sortPrice: filters.sortPrice === "asc" ? "desc" : "asc",
                  })
                }
                className="p-2 border border-amber-700 rounded-lg"
              >
                Price:{" "}
                {filters.sortPrice === "asc" ? "Low to High" : "High to Low"}
              </button>
              <button
                onClick={clearFilters}
                className="p-2 border border-amber-700 rounded-lg bg-amber-50 hover:bg-amber-100"
              >
                Clear Filters
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
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
                value={filters.department}
                onChange={(e) =>
                  setFilters({ ...filters, department: e.target.value })
                }
                className="p-2 border rounded-lg border-yellow-600"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "All" ? "All Departments" : dept}
                  </option>
                ))}
              </select>

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
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
                        <Image
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
                        style={{ color: styles.text }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm flex-grow">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className="font-bold"
                          style={{ color: styles.text }}
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
    </>
  );
}
