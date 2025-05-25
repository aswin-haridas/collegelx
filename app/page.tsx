"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Loader2 } from "lucide-react";
import { styles, playfair } from "./lib/styles";
import Link from "next/link";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { playfair } from "@/lib/fonts";
import {
  UserCircle,
  ShoppingBag,
  MessageCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Item } from "@/lib/types";
import ItemCard from "@/components/ItemCard";
import "@/app/styles.css";
=======
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
>>>>>>> feature

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

<<<<<<< HEAD
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-amber-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className} warmPrimaryDark`}
            >
              CollegeLX Marketplace
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Buy and sell college essentials - from textbooks and notes to
              uniforms and stationery. Connect with fellow students and find
              everything you need for your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/products")}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center justify-center"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Products
              </button>
=======
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
>>>>>>> feature
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

<<<<<<< HEAD
      {/* Featured Items Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2
              className={`text-2xl md:text-3xl font-semibold ${playfair.className} warmPrimaryDark`}
            >
              Featured Items
            </h2>
            <Link
              href="/products"
              className="flex items-center text-amber-600 hover:text-amber-700 transition"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
=======
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
>>>>>>> feature

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
<<<<<<< HEAD
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
=======
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
>>>>>>> feature
              ))}
            </div>
          )}
        </div>
<<<<<<< HEAD
      </section>

      {/* Features Highlight Section */}
      <section className="bg-amber-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-semibold text-center mb-12 ${playfair.className} warmPrimaryDark`}
          >
            Why Choose CollegeLX?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Campus-Focused Marketplace
              </h3>
              <p className="text-gray-600">
                Buy and sell items specifically relevant to your college
                experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Direct Communication
              </h3>
              <p className="text-gray-600">
                Message sellers directly to negotiate prices or ask questions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <UserCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Verified College Users
              </h3>
              <p className="text-gray-600">
                A safe community of verified students for secure transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
=======
      </div>
    </>
>>>>>>> feature
  );
}
