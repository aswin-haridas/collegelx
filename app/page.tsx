import Card from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";

async function getItems(): Promise<Listing[]> {
	try {
		const { data, error } = await supabase
			.from("listings")
			.select("*")
			.eq("status", "active")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching items:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("Error fetching items:", error);
		return [];
	}
}

export default async function App() {
	const items = await getItems();

	if (items.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<h2 className="text-2xl font-semibold text-brown-700 mb-2">
						No items available
					</h2>
					<p className="text-brown-600">Check back later for new listings!</p>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{items.map((item) => (
					<Card key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
