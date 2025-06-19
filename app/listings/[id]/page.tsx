"use client";

import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";

async function getListing(id: string): Promise<Listing | null> {
	try {
		const { data, error } = await supabase
			.from("listings")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			console.error("Error fetching listing:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.error("Error fetching listing:", error);
		return null;
	}
}

export default function ListingPage({ params }: { params: { id: string } }) {
	const [listing, setListing] = useState<Listing | null>(null);
	const [showChat, setShowChat] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchListing = async () => {
			const data = await getListing(params.id);
			if (!data) {
				notFound();
			}
			setListing(data);
			setIsLoading(false);
		};

		fetchListing();
	}, [params.id]);

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
				</div>
			</div>
		);
	}

	if (!listing) {
		notFound();
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			{/* Back button */}
			<Link
				href="/"
				className="inline-flex items-center text-brown-600 hover:text-brown-800 mb-6 transition-colors"
			>
				<svg
					className="w-4 h-4 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Listings
			</Link>

			{/* Main content */}
			<div className="bg-beige-50 rounded-lg shadow-lg overflow-hidden border border-beige-200">
				{/* Images section */}
				<div className="relative h-96 bg-beige-100">
					{listing.images && listing.images.length > 0 ? (
						<Image
							src={listing.images[0]}
							alt={`Image of ${listing.name}`}
							fill
							className="object-cover"
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<span className="text-brown-500">No image available</span>
						</div>
					)}
				</div>

				{/* Details section */}
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h1 className="text-3xl font-bold text-brown-900 mb-2">
								{listing.name}
							</h1>
							<p className="text-2xl font-semibold text-brown-700">
								${listing.price.toFixed(2)}
							</p>
						</div>
						<div className="text-right">
							<span className="inline-block bg-brown-100 text-brown-800 text-sm font-medium px-3 py-1 rounded-full">
								{listing.condition}
							</span>
							{listing.status && (
								<span className="block mt-2 inline-block bg-beige-200 text-brown-800 text-sm font-medium px-3 py-1 rounded-full">
									{listing.status}
								</span>
							)}
						</div>
					</div>

					{/* Description */}
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-brown-900 mb-2">
							Description
						</h2>
						<p className="text-brown-700 leading-relaxed">
							{listing.description}
						</p>
					</div>

					{/* Additional details */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Category */}
						{listing.category && (
							<div>
								<h3 className="text-lg font-semibold text-brown-900 mb-2">
									Category
								</h3>
								<p className="text-brown-700">{listing.category}</p>
							</div>
						)}

						{/* Tags */}
						{listing.tags && listing.tags.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-brown-900 mb-2">
									Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{listing.tags.map((tag) => (
										<span
											key={tag}
											className="bg-beige-200 text-brown-700 text-sm px-2 py-1 rounded"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Created date */}
						{listing.created_at && (
							<div>
								<h3 className="text-lg font-semibold text-brown-900 mb-2">
									Listed on
								</h3>
								<p className="text-brown-700">
									{new Date(listing.created_at).toLocaleDateString()}
								</p>
							</div>
						)}

						{/* Updated date */}
						{listing.updated_at && (
							<div>
								<h3 className="text-lg font-semibold text-brown-900 mb-2">
									Last updated
								</h3>
								<p className="text-brown-700">
									{new Date(listing.updated_at).toLocaleDateString()}
								</p>
							</div>
						)}
					</div>

					{/* Action buttons */}
					<div className="mt-8 flex gap-4">
						<button
							type="button"
							onClick={() => setShowChat(true)}
							className="bg-brown-600 text-beige-50 px-6 py-3 rounded-lg font-medium hover:bg-brown-700 transition-colors"
						>
							Chat with Seller
						</button>
						<button
							type="button"
							className="border border-brown-300 text-brown-700 px-6 py-3 rounded-lg font-medium hover:bg-beige-100 transition-colors"
						>
							Save to Wishlist
						</button>
					</div>
				</div>
			</div>

			{/* Chat Interface */}
			{showChat && (
				<ChatInterface
					listingId={listing.id}
					sellerId={listing.owner || "default-seller-id"}
					buyerId="current-user-id" // In a real app, this would come from auth
					listingName={listing.name}
					sellerName="Seller Name" // In a real app, this would come from user data
					onClose={() => setShowChat(false)}
				/>
			)}
		</div>
	);
}
