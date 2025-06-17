import { type Dispatch, type SetStateAction, useId } from "react";
import type { Listing } from "@/types";
import { colors } from "../ui/colors";

interface SidebarProps {
	items: Listing[];
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

export default function FilterSidebar({ filters, setFilters }: SidebarProps) {
	const categories = ["Notes", "Uniform", "Stationary", "Others", "All"];
	const conditions = ["new", "like_new", "good", "fair", "poor", "All"];

	const searchId = useId();
	const conditionId = useId();
	const categoryId = useId();
	const sortId = useId();

	const clearFilters = () => {
		setFilters({
			search: "",
			condition: "All",
			category: "All",
			sortPrice: "asc",
		});
	};

	return (
		<div
			className={`w-70 ${colors.background.white} border-r ${colors.border.secondary}`}
		>
			<div className="h-full overflow-y-auto p-6">
				<h2 className={`text-lg font-semibold ${colors.text.primary} mb-6`}>
					Filters
				</h2>

				<div className="space-y-6">
					{/* Search */}
					<div>
						<label
							htmlFor={searchId}
							className={`block text-sm font-medium ${colors.text.secondary} mb-2`}
						>
							Search
						</label>
						<input
							id={searchId}
							onChange={(e) =>
								setFilters({ ...filters, search: e.target.value })
							}
							className={`w-full p-3 border-2 rounded-lg ${colors.border.primary} ${colors.focus.border} focus:outline-none`}
							type="text"
							placeholder="Search by name..."
							value={filters.search}
						/>
					</div>

					{/* Condition Filter */}
					<div>
						<label
							htmlFor={conditionId}
							className={`block text-sm font-medium ${colors.text.secondary} mb-2`}
						>
							Condition
						</label>
						<select
							id={conditionId}
							value={filters.condition}
							onChange={(e) =>
								setFilters({ ...filters, condition: e.target.value })
							}
							className={`w-full p-3 border-2 rounded-lg ${colors.border.primary} ${colors.focus.border} focus:outline-none`}
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
						<label
							htmlFor={categoryId}
							className={`block text-sm font-medium ${colors.text.secondary} mb-2`}
						>
							Category
						</label>
						<select
							id={categoryId}
							value={filters.category}
							onChange={(e) =>
								setFilters({ ...filters, category: e.target.value })
							}
							className={`w-full p-3 border-2 rounded-lg ${colors.border.primary} ${colors.focus.border} focus:outline-none`}
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
						<label
							htmlFor={sortId}
							className={`block text-sm font-medium ${colors.text.secondary} mb-2`}
						>
							Sort by Price
						</label>
						<button
							id={sortId}
							type="button"
							onClick={() =>
								setFilters({
									...filters,
									sortPrice: filters.sortPrice === "asc" ? "desc" : "asc",
								})
							}
							className={`w-full p-3 border-2 ${colors.border.primary} rounded-lg ${colors.primary["50"]} ${colors.hover.secondary} transition-colors`}
						>
							Price:{" "}
							{filters.sortPrice === "asc" ? "Low to High" : "High to Low"}
						</button>
					</div>

					{/* Clear Filters */}
					<button
						type="button"
						onClick={clearFilters}
						className="w-full p-3 border-2 border-red-600 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-red-700 font-medium"
					>
						Clear All Filters
					</button>
				</div>
			</div>
		</div>
	);
}
