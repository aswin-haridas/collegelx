// app/browse/components/ItemListings.tsx (structure outline)
"use client";

import { useState, useEffect } from "react"; // useEffect might still be needed for reactions to prop changes or other client-side effects, but not for initial fetch.
import { Listing } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./FilterSidebar"; // Adjusted path
import { LoadingSpinner } from "@/shared/components/ui/Loading"; // Keep if client-side loading state is used
import { styles } from "@/shared/styles/theme";

interface ItemListingsProps {
  initialItems: Listing[];
}

export default function ItemListings({ initialItems }: ItemListingsProps) {
  const [items, setItems] = useState<Listing[]>(initialItems);
  const [loading, setLoading] = useState(false); // For client-side operations, initial load is done by server
  const [filters, setFilters] = useState({
    search: "",
    condition: "All",
    category: "All",
    sortPrice: "asc",
  });

  // If initialItems can change due to parent re-fetching, you might need an effect to update items
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Apply filters to the items (this logic is from the original page)
  const filteredItems = items
    .filter((item) => {
      const searchMatch = item.name
        ? item.name.toLowerCase().includes(filters.search.toLowerCase())
        : false;
      const conditionMatch =
        filters.condition === "All" ||
        (item.condition && item.condition === filters.condition);
      const categoryMatch =
        filters.category === "All" ||
        (item.category && item.category === filters.category);
      return searchMatch && conditionMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (filters.sortPrice === "asc") {
        return (a.price || 0) - (b.price || 0);
      } else {
        return (b.price || 0) - (a.price || 0);
      }
    });

  // The loading state here would be for when filters are applied, if that's a slow operation
  // or if fetching items was a client-side action (which it's not for initial load anymore)
  // For now, the main loading spinner from the original page (for initial fetch) is removed from here.

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} filters={filters} setFilters={setFilters} />
      <div className="flex-1">
        <div className="p-4">
          {loading /* This loading is for client-side changes if any */ && (
            <div className="flex justify-center items-center h-screen">
              <LoadingSpinner />
            </div>
          )}
          {!loading && filteredItems.length === 0 ? (
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
                      {item.images && item.images.length > 0 ? (
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
  );
}
