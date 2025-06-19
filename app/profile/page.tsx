"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";
import Card from "@/components/ui/Card";

export default function Profile() {
	const router = useRouter();
	const [listings, setListings] = useState<Listing[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"active" | "sold" | "draft">(
		"active",
	);

	const fetchUserListings = useCallback(async () => {
		try {
			// For now, we'll fetch all listings. In a real app, you'd filter by user ID
			const { data, error } = await supabase
				.from("listings")
				.select("*")
				.eq("status", activeTab)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching listings:", error);
				return;
			}

			setListings(data || []);
		} catch (error) {
			console.error("Error fetching listings:", error);
		} finally {
			setIsLoading(false);
		}
	}, [activeTab]);

	useEffect(() => {
		fetchUserListings();
	}, [fetchUserListings]);

	const handleDeleteListing = async (listingId: string) => {
		if (!confirm("Are you sure you want to delete this listing?")) {
			return;
		}

		try {
			const { error } = await supabase
				.from("listings")
				.delete()
				.eq("id", listingId);

			if (error) {
				console.error("Error deleting listing:", error);
				alert("Failed to delete listing. Please try again.");
				return;
			}

			// Remove from local state
			setListings((prev) => prev.filter((listing) => listing.id !== listingId));
		} catch (error) {
			console.error("Error deleting listing:", error);
			alert("Failed to delete listing. Please try again.");
		}
	};

	const handleStatusChange = async (listingId: string, newStatus: string) => {
		try {
			const { error } = await supabase
				.from("listings")
				.update({ status: newStatus })
				.eq("id", listingId);

			if (error) {
				console.error("Error updating listing status:", error);
				alert("Failed to update listing status. Please try again.");
				return;
			}

			// Refresh listings
			fetchUserListings();
		} catch (error) {
			console.error("Error updating listing status:", error);
			alert("Failed to update listing status. Please try again.");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-brown-600">Loading your listings...</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-brown-900 mb-2">My Profile</h1>
				<p className="text-brown-600">Manage your listings and account</p>
			</div>

			{/* Profile Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center">
						<div className="p-3 bg-green-100 rounded-full">
							<svg
								className="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-brown-600">
								Active Listings
							</p>
							<p className="text-2xl font-bold text-brown-900">
								{listings.filter((l) => l.status === "active").length}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center">
						<div className="p-3 bg-blue-100 rounded-full">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-brown-600">Total Sales</p>
							<p className="text-2xl font-bold text-brown-900">$0</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex items-center">
						<div className="p-3 bg-purple-100 rounded-full">
							<svg
								className="w-6 h-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-brown-600">Member Since</p>
							<p className="text-2xl font-bold text-brown-900">2024</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg shadow-md mb-8">
				<div className="border-b border-beige-200">
					<nav className="flex space-x-8 px-6">
						<button
							type="button"
							onClick={() => setActiveTab("active")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "active"
									? "border-brown-500 text-brown-600"
									: "border-transparent text-brown-500 hover:text-brown-700 hover:border-brown-300"
							}`}
						>
							Active Listings
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("sold")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "sold"
									? "border-brown-500 text-brown-600"
									: "border-transparent text-brown-500 hover:text-brown-700 hover:border-brown-300"
							}`}
						>
							Sold Items
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("draft")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "draft"
									? "border-brown-500 text-brown-600"
									: "border-transparent text-brown-500 hover:text-brown-700 hover:border-brown-300"
							}`}
						>
							Drafts
						</button>
					</nav>
				</div>

				<div className="p-6">
					{listings.length === 0 ? (
						<div className="text-center py-12">
							<svg
								className="mx-auto h-12 w-12 text-brown-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
							<h3 className="mt-2 text-sm font-medium text-brown-900">
								No {activeTab} listings
							</h3>
							<p className="mt-1 text-sm text-brown-500">
								{activeTab === "active" &&
									"You haven't created any active listings yet."}
								{activeTab === "sold" && "You haven't sold any items yet."}
								{activeTab === "draft" && "You don't have any draft listings."}
							</p>
							{activeTab === "active" && (
								<div className="mt-6">
									<button
										type="button"
										onClick={() => router.push("/create")}
										className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
									>
										<svg
											className="-ml-1 mr-2 h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 6v6m0 0v6m0-6h6m-6 0H6"
											/>
										</svg>
										Create New Listing
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{listings.map((listing) => (
								<div key={listing.id} className="relative">
									<Card item={listing} />
									<div className="absolute top-2 right-2 flex space-x-2">
										{activeTab === "active" && (
											<>
												<button
													type="button"
													onClick={() => handleStatusChange(listing.id, "sold")}
													className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600"
													title="Mark as sold"
													aria-label="Mark as sold"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												</button>
												<button
													type="button"
													onClick={() => router.push(`/edit/${listing.id}`)}
													className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
													title="Edit listing"
													aria-label="Edit listing"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden="true"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
											</>
										)}
										<button
											type="button"
											onClick={() => handleDeleteListing(listing.id)}
											className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
											title="Delete listing"
											aria-label="Delete listing"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
