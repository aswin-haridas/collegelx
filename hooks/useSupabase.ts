import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";

export default function useSupabase() {
	async function fetchItems() {
		try {
			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("status", "active")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching items:", error);
				throw error;
			}

			return data as Listing[];
		} catch (error) {
			console.error("Error fetching items:", error);
			return [];
		}
	}

	async function fetchItemById(id: string) {
		try {
			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				console.error("Error fetching item:", error);
				throw error;
			}

			return data as Listing;
		} catch (error) {
			console.error("Error fetching item:", error);
			return null;
		}
	}

	return { fetchItems, fetchItemById };
}
