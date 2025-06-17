"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, useState, useId } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";
import { supabase } from "@/lib/supabase";
import type { Listing } from "@/types";

export default function SellPage() {
	const router = useRouter();
	const { register, handleSubmit } = useForm<Listing>();

	const [images, setImages] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);

	const userId = "39629";

	// Generate unique IDs for form inputs
	const nameId = useId();
	const descriptionId = useId();
	const priceId = useId();
	const categoryId = useId();
	const conditionId = useId();
	const tagsId = useId();
	const imagesId = useId();

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setImages(files);

		const urls = files.map((file) => URL.createObjectURL(file));
		setPreviewUrls(urls);
	};

	const onSubmit: SubmitHandler<Listing> = async (data) => {
		if (!userId) {
			toast.error("Please login to create a listing");
			return;
		}

		if (images.length === 0) {
			toast.error("Please select at least one image.");
			return;
		}

		setUploading(true);
		try {
			const imageUrls = await Promise.all(
				images.map(async (image) => {
					const fileName = `${Date.now()}-${image.name}`;
					const { error } = await supabase.storage
						.from("images")
						.upload(fileName, image);

					if (error) throw error;

					const {
						data: { publicUrl },
					} = supabase.storage.from("images").getPublicUrl(fileName);

					return publicUrl;
				}),
			);

			const { error: insertError } = await supabase.from("products").insert({
				user_id: userId,
				title: data.name,
				description: data.description,
				price: data.price,
				category: data.category,
				condition: data.condition,
				images: imageUrls,
				status: "active",
			});

			if (insertError) {
				console.error("Insert Error:", insertError);
				toast.error("Failed to create listing. Please try again.");
				return;
			}

			toast.success("Listing created successfully!");
			router.push("/");
		} catch (error) {
			console.error("Error creating listing:", error);
			toast.error("Failed to create listing. Please try again.");
		} finally {
			setUploading(false);
		}
	};

	return (
		<>
			<div className="h-screen">
				<div className="max-w-4xl mx-auto p-4 ">
					<div className="bg-white rounded-lg shadow-md p-6">
						<h1 className="text-2xl font-semibold mb-6">Create Listing</h1>

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div>
								<label
									htmlFor={nameId}
									className="block text-sm font-medium text-gray-600"
								>
									Name
								</label>
								<input
									id={nameId}
									{...register("name", { required: "Title is required" })}
									type="text"
									className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
								/>
							</div>

							<div>
								<label
									htmlFor={descriptionId}
									className="block text-sm font-medium text-gray-600"
								>
									Description
								</label>
								<textarea
									id={descriptionId}
									{...register("description", {
										required: "Description is required",
									})}
									rows={4}
									className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor={priceId}
										className="block text-sm font-medium text-gray-600"
									>
										Price (₹)
									</label>
									<input
										id={priceId}
										{...register("price", {
											required: "Price is required",
											min: {
												value: 0,
												message: "Price cannot be negative",
											},
											pattern: {
												value: /^\d+(\.\d{1,2})?$/,
												message: "Enter a valid price",
											},
										})}
										type="number"
										min="0"
										step="0.01"
										className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
									/>
								</div>

								<div>
									<label
										htmlFor={categoryId}
										className="block text-sm font-medium text-gray-600"
									>
										Product Type
									</label>
									<select
										id={categoryId}
										{...register("category", {
											required: "Product type is required",
										})}
										className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
									>
										<option value="">Select Product Type</option>
										<option value="Notes">Notes</option>
										<option value="Uniform">Uniform</option>
										<option value="Stationary">Stationary</option>
										<option value="Others">Others</option>
									</select>
								</div>
							</div>

							<div>
								<label
									htmlFor={conditionId}
									className="block text-sm font-medium text-gray-600"
								>
									Condition
								</label>
								<select
									id={conditionId}
									{...register("condition", {
										required: "Condition is required",
									})}
									className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
								>
									<option value="">Select Condition</option>
									<option value="New">New</option>
									<option value="Like New">Like New</option>
									<option value="Good">Good</option>
									<option value="Fair">Fair</option>
									<option value="Poor">Poor</option>
								</select>
							</div>

							<div>
								<label
									htmlFor={tagsId}
									className="block text-sm font-medium text-gray-600"
								>
									Tags (comma separated)
								</label>
								<input
									id={tagsId}
									{...register("tags")}
									type="text"
									placeholder="e.g., mathematics, sem3, engineering"
									className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
								/>
								<p className="text-xs text-gray-500 mt-1">
									Add relevant tags to help others find your listing
								</p>
							</div>

							<div>
								<label
									htmlFor={imagesId}
									className="block text-sm font-medium text-gray-600 mb-2"
								>
									Images
								</label>
								<div className="flex items-center justify-center w-full">
									<label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
										<div className="flex flex-col items-center justify-center pt-5 pb-6">
											<Upload className="h-10 w-10 mb-3" />
											<p className="mb-2 text-sm text-gray-500">
												<span className="font-semibold">Click to upload</span>{" "}
												or drag and drop
											</p>
											<p className="text-xs text-gray-500">
												PNG, JPG, GIF up to 10MB each
											</p>
										</div>
										<input
											id={imagesId}
											type="file"
											className="hidden"
											multiple
											accept="image/*"
											onChange={handleImageChange}
											required
										/>
									</label>
								</div>
								{previewUrls.length > 0 && (
									<div className="mt-4 grid grid-cols-3 gap-4">
										{previewUrls.map((url) => (
											<div key={url} className="relative aspect-square">
												<Image
													src={url}
													alt="Preview"
													className="w-full h-full object-cover rounded-lg"
													width={100}
													height={100}
												/>
											</div>
										))}
									</div>
								)}
							</div>

							<button
								type="submit"
								className="w-full py-2 px-4 rounded-lg text-white flex items-center justify-center disabled:opacity-50"
								disabled={uploading}
							>
								{uploading ? (
									<>
										<Loading />
										Creating Listing...
									</>
								) : (
									"Create Listing"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
