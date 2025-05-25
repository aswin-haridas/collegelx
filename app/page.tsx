"use client";

import Header from "@/components/shared/Header";
import { LoadingSpinner } from "@/components/ui/Loading";
import { styles } from "@/lib/styles";
import { supabase } from "@/lib/supabase";
import { Item } from "@/types/item";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const category = ["Notes", "Uniform", "Stationary", "Others", "All"];
const conditions = ["new", "like_new", "good", "fair", "poor", "All"];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    condition: "All",
    sortPrice: "asc",
  });
  const clearFilters = () =>
    setFilters({
      search: "",
      category: "All",
      condition: "All",
      sortPrice: "asc",
    });

  useEffect(() => {
    async function fetchItems() {
      try {
        let query = supabase
          .from("listings")
          .select("*")
          .eq("status", "active");

        if (filters.category !== "All")
          query = query.eq("category", filters.category);
        if (filters.condition !== "All")
          query = query.eq("condition", filters.condition);

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
  }, [filters.category, filters.condition, filters.sortPrice]);
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  function Sidebar() {
    return (
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-full overflow-y-auto p-6">
          {/* Mobile close button */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Desktop name */}
          <h2 className="text-lg font-semibold text-gray-900 mb-6 hidden lg:block">
            Filters
          </h2>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full p-3 border-2 rounded-lg border-yellow-600 focus:border-yellow-700 focus:outline-none"
                type="text"
                placeholder="Search by name..."
                value={filters.search}
              />
            </div>{" "}
            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={filters.condition}
                onChange={(e) =>
                  setFilters({ ...filters, condition: e.target.value })
                }
                className="w-full p-3 border-2 rounded-lg border-yellow-600 focus:border-yellow-700 focus:outline-none"
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition === "All"
                      ? "All Conditions"
                      : condition
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full p-3 border-2 rounded-lg border-yellow-600 focus:border-yellow-700 focus:outline-none"
              >
                {category.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Product Types" : type}
                  </option>
                ))}
              </select>
            </div>
            {/* Sort Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by Price
              </label>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    sortPrice: filters.sortPrice === "asc" ? "desc" : "asc",
                  })
                }
                className="w-full p-3 border-2 border-amber-700 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                Price:{" "}
                {filters.sortPrice === "asc" ? "Low to High" : "High to Low"}
              </button>
            </div>
            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full p-3 border-2 border-amber-700 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-red-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Sidebar backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Mobile filter toggle button */}
          <div className="lg:hidden p-4 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              Filters
            </button>
          </div>

          <div className="p-4">
            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">
                No items available matching the criteria.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Link
                    href={`/buy/${item.id}`}
                    key={item.id}
                    className="block h-full"
                  >
                    <div className="border border-stone-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className="relative h-48 bg-gray-50">
                        {" "}
                        {item.images?.length > 0 ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        {" "}
                        <h3
                          className={`font-medium text-lg mb-2`}
                          style={{ color: styles.accent }}
                        >
                          {item.name}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm flex-grow line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span
                            className="font-bold"
                            style={{ color: styles.primary }}
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
