"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";

export default function CreateItem() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		condition: "good",
		category: "",
		tags: "",
		images: [] as string[],
	});

	// Generate unique IDs for form elements
	const nameId = useId();
	const descriptionId = useId();
	const priceId = useId();
	const conditionId = useId();
	const categoryId = useId();
	const tagsId = useId();
	const imagesId = useId();

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		setIsLoading(true);
		const uploadedUrls: string[] = [];

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const fileExt = file.name.split(".").pop();
				const fileName = `${Math.random()}.${fileExt}`;
				const filePath = `listings/${fileName}`;

				const { error: uploadError } = await supabase.storage
					.from("images")
					.upload(filePath, file);

				if (uploadError) {
					console.error("Error uploading image:", uploadError);
					continue;
				}

				const {
					data: { publicUrl },
				} = supabase.storage.from("images").getPublicUrl(filePath);

				uploadedUrls.push(publicUrl);
			}

			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...uploadedUrls],
			}));
		} catch (error) {
			console.error("Error uploading images:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const tagsArray = formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag);

			const { data, error } = await supabase
				.from("listings")
				.insert({
					name: formData.name,
					description: formData.description,
					price: parseFloat(formData.price),
					condition: formData.condition,
					category: formData.category,
					tags: tagsArray,
					images: formData.images,
					status: "active",
				})
				.select()
				.single();

			if (error) {
				console.error("Error creating listing:", error);
				alert("Failed to create listing. Please try again.");
				return;
			}

			router.push(`/listings/${data.id}`);
		} catch (error) {
			console.error("Error creating listing:", error);
			alert("Failed to create listing. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto px-4 py-8">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h1 className="text-3xl font-bold text-brown-900 mb-6">
					Create New Listing
				</h1>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor={nameId}
							className="block text-sm font-medium text-brown-700 mb-2"
						>
							Item Name *
						</label>
						<input
							type="text"
							id={nameId}
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							required
							className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
							placeholder="Enter item name"
						/>
					</div>

					<div>
						<label
							htmlFor={descriptionId}
							className="block text-sm font-medium text-brown-700 mb-2"
						>
							Description *
						</label>
						<textarea
							id={descriptionId}
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							required
							rows={4}
							className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
							placeholder="Describe your item in detail"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor={priceId}
								className="block text-sm font-medium text-brown-700 mb-2"
							>
								Price ($) *
							</label>
							<input
								type="number"
								id={priceId}
								name="price"
								value={formData.price}
								onChange={handleInputChange}
								required
								min="0"
								step="0.01"
								className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
								placeholder="0.00"
							/>
						</div>

						<div>
							<label
								htmlFor={conditionId}
								className="block text-sm font-medium text-brown-700 mb-2"
							>
								Condition *
							</label>
							<select
								id={conditionId}
								name="condition"
								value={formData.condition}
								onChange={handleInputChange}
								required
								className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
							>
								<option value="new">New</option>
								<option value="like-new">Like New</option>
								<option value="good">Good</option>
								<option value="fair">Fair</option>
								<option value="poor">Poor</option>
							</select>
						</div>
					</div>

					<div>
						<label
							htmlFor={categoryId}
							className="block text-sm font-medium text-brown-700 mb-2"
						>
							Category
						</label>
						<input
							type="text"
							id={categoryId}
							name="category"
							value={formData.category}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
							placeholder="e.g., Electronics, Books, Clothing"
						/>
					</div>

					<div>
						<label
							htmlFor={tagsId}
							className="block text-sm font-medium text-brown-700 mb-2"
						>
							Tags (comma-separated)
						</label>
						<input
							type="text"
							id={tagsId}
							name="tags"
							value={formData.tags}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
							placeholder="e.g., laptop, computer, tech"
						/>
					</div>

					<div>
						<label
							htmlFor={imagesId}
							className="block text-sm font-medium text-brown-700 mb-2"
						>
							Images
						</label>
						<input
							type="file"
							id={imagesId}
							name="images"
							multiple
							accept="image/*"
							onChange={handleImageUpload}
							className="w-full px-3 py-2 border border-beige-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
						/>
						<p className="text-sm text-brown-600 mt-1">
							Upload multiple images to showcase your item
						</p>
					</div>

					{formData.images.length > 0 && (
						<div>
							<span className="block text-sm font-medium text-brown-700 mb-2">
								Uploaded Images
							</span>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{formData.images.map((url) => (
									<img
										key={url}
										src={url}
										alt="Preview"
										className="w-full h-24 object-cover rounded-md"
									/>
								))}
							</div>
						</div>
					)}

					<div className="flex gap-4">
						<button
							type="submit"
							disabled={isLoading}
							className="flex-1 bg-brown-600 text-white py-2 px-4 rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Creating..." : "Create Listing"}
						</button>
						<button
							type="button"
							onClick={() => router.back()}
							className="flex-1 bg-beige-200 text-brown-700 py-2 px-4 rounded-md hover:bg-beige-300 focus:outline-none focus:ring-2 focus:ring-beige-500 focus:ring-offset-2"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
