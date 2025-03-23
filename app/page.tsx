"use client";

import { useState, useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import { Item } from "@/lib/types";
import { getItems } from "./api/items";
import Link from "next/link";
import { playfair } from "./font/fonts";
import { styles } from "@/lib/styles";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");

  // Define categories and price ranges for filters
  const categories = [
    "all",
    "books",
    "electronics",
    "furniture",
    "clothing",
    "other",
  ];
  const priceRanges = [
    { id: "all", label: "All Prices" },
    { id: "0-50", label: "Under ₹50" },
    { id: "50-100", label: "₹50-100" },
    { id: "100-200", label: "₹100-200" },
    { id: "200-plus", label: "₹200+" },
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const itemsData = await getItems();
        setItems(itemsData);
        setFilteredItems(itemsData);
      } catch (e: any) {
        setError(e.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items whenever filter criteria change
  useEffect(() => {
    let result = [...items];

    // Filter by category
    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Filter by price range
    if (priceFilter !== "all") {
      const [min, max] = priceFilter.split("-").map(Number);
      if (max) {
        result = result.filter(
          (item) => item.price >= min && item.price <= max
        );
      } else {
        result = result.filter((item) => item.price >= min);
      }
    }

    setFilteredItems(result);
  }, [items, categoryFilter, priceFilter]);

  return (
    <div
      className="py-10 px-4 max-w-6xl mx-auto"
      style={{ backgroundColor: styles.warmBg }}
    >
      <div className="text-center mb-10">
        <h1
          className={`text-3xl font-bold mb-4 ${playfair.className}`}
          style={{ color: styles.warmText }}
        >
          Welcome to AISAT Marketplace
        </h1>
        <p style={{ color: styles.warmText }}>
          Buy and sell college essentials with ease.
        </p>
      </div>

      {/* Filter options */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium mb-1"
              style={{ color: styles.warmText }}
            >
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-4 py-2 rounded-md shadow-sm"
              style={{ borderColor: styles.warmBorder, color: styles.warmText }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="price-filter"
              className="block text-sm font-medium mb-1"
              style={{ color: styles.warmText }}
            >
              Price Range
            </label>
            <select
              id="price-filter"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="block w-full px-4 py-2 rounded-md shadow-sm"
              style={{ borderColor: styles.warmBorder, color: styles.warmText }}
            >
              {priceRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10" style={{ color: styles.warmText }}>
          Loading items...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10" style={{ color: styles.warmText }}>
          No items available matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Link href={`/buy/${item.id}`} key={item.id}>
              <ItemCard item={item} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
