import { Item } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  items: Item[];
  filters: {
    search: string;
    condition: string;
    category: string;
    sortPrice: string;
  };
  setFilters: Dispatch<
    SetStateAction<{
      search: string;
      condition: string;
      category: string;
      sortPrice: string;
    }>
  >;
}

export default function Sidebar({ items, filters, setFilters }: SidebarProps) {
  const categories = ["Notes", "Uniform", "Stationary", "Others", "All"];
  const conditions = ["new", "like_new", "good", "fair", "poor", "All"];
  const clearFilters = () => {
    setFilters({
      search: "",
      condition: "All",
      category: "All",
      sortPrice: "asc",
    });
  };

  return (
    <div className="w-70 bg-white border-r border-gray-200">
      <div className="h-full overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>

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
              {categories.map((type) => (
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
