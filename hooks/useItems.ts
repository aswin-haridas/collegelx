import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";

export function useItems() {
	const [items, setItems] = useState<Listing[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchItems = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("status", "active")
				.order("created_at", { ascending: false });

			if (error) {
				throw error;
			}

			setItems(data || []);
		} catch (err) {
			console.error("Error fetching items:", err);
			setError(err instanceof Error ? err.message : "Failed to fetch items");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	const refreshItems = useCallback(async () => {
		await fetchItems();
	}, [fetchItems]);

	return {
		items,
		loading,
		error,
		refreshItems,
	};
}
