"use client";

import { useItems } from "@/hooks/useItems";
import Card from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { RefreshCw } from "lucide-react";

export default function ItemListings() {
	const { items, loading, error, refreshItems } = useItems();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loading />
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-red-600 mb-4">
						Error loading items
					</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						type="button"
						onClick={refreshItems}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<RefreshCw className="w-4 h-4" />
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-gray-700 mb-2">
						No items available
					</h2>
					<p className="text-gray-500 mb-4">
						Check back later for new listings!
					</p>
					<button
						type="button"
						onClick={refreshItems}
						className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<RefreshCw className="w-4 h-4" />
						Refresh
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Available Items ({items.length})
				</h1>
				<button
					type="button"
					onClick={refreshItems}
					className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
				>
					<RefreshCw className="w-4 h-4" />
					Refresh
				</button>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{items.map((item) => (
					<Card key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
