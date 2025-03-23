"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import { playfair } from "@/app/font/fonts";
import Header from "@/components/Header";
import { Trash2 } from "lucide-react";

export default function SellPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    status: "available", // Default status
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get current user ID on component mount
  useEffect(() => {
    async function getUserId() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    }
    getUserId();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);

      // Create temporary URLs for preview
      const urls = filesArray.map((file) => URL.createObjectURL(file));
      setImageUrls(urls);
    }
  };

  const handleDeleteImage = (index: number) => {
    // Create new arrays without the deleted image
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Remove the URL and revoke the object URL to free memory
    const imageUrl = imageUrls[index];
    URL.revokeObjectURL(imageUrl);

    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        `Unsupported file type: ${file.type}. Please use JPEG, PNG, GIF, or WEBP.`
      );
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error(
        `File size exceeds 5MB limit. Please compress your image.`
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);
    setIsUploading(true);

    try {
      // Check if any images were selected
      if (images.length === 0) {
        throw new Error("Please add at least one image of your item");
      }

      // Upload images first
      const imageUrls: string[] = [];
      setUploadProgress(0);

      for (let i = 0; i < images.length; i++) {
        try {
          const url = await uploadImage(images[i]);
          imageUrls.push(url);
          // Update progress
          setUploadProgress(Math.round(((i + 1) / images.length) * 100));
        } catch (error: any) {
          throw new Error(`Error uploading image ${i + 1}: ${error.message}`);
        }
      }

      // Format data for Supabase
      const itemData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: parseInt(formData.category),
        user_id: userId,
        status: formData.status,
        created_at: new Date(),
        images: imageUrls, // Add the image URLs
      };

      // Insert into Supabase items table
      const { data, error } = await supabase
        .from("items")
        .insert(itemData)
        .select();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      alert("Item added successfully!");
      router.push("/");
    } catch (error: any) {
      console.error("Error adding item:", error);
      setUploadError(error.message);
      alert(`Failed to add item: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const inputStyle = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors`;

  return (
    <div
      style={{
        backgroundColor: styles.warmBg,
        minHeight: "100vh",
        color: styles.warmText,
      }}
    >
      <Header />

      <div className="max-w-2xl mx-auto p-6">
        <h1
          className={`text-3xl font-bold mb-8 ${playfair.className}`}
          style={{ color: styles.warmPrimary }}
        >
          Sell Your Item
        </h1>

        <div
          className="bg-white p-6 rounded-lg shadow-md"
          style={{ borderColor: styles.warmBorder }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className={`block font-medium `}>
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputStyle}
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className={inputStyle}
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="block font-medium">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className={inputStyle}
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="block font-medium">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={inputStyle}
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                >
                  <option value="">Select a category</option>
                  <option value="1">Textbooks</option>
                  <option value="2">Electronics</option>
                  <option value="3">Furniture</option>
                  <option value="4">Clothing</option>
                  <option value="5">Other</option>
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label htmlFor="images" className="block font-medium">
                Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="w-full"
              />

              {/* Image Previews */}
              {imageUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative h-24 border rounded">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} color="white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {loading && uploadProgress > 0 && (
                <div className="w-full mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${uploadProgress}%`,
                        backgroundColor: styles.warmPrimary,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-1">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Display upload errors if any */}
            {uploadError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {uploadError}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading
                    ? styles.warmAccent
                    : styles.warmPrimary,
                  color: "white",
                  borderColor: "transparent",
                }}
                className="w-full py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 transition-colors disabled:opacity-70 font-medium"
              >
                {loading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
