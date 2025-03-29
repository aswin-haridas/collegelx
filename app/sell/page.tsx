"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";

export default function SellPage() {
  const { isAuthenticated, userId, isLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setcategory] = useState("");
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userId) console.log(userId);
    setUploading(true);
    try {
      // Upload images to storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const fileName = `${Date.now()}-${image.name}`;
          const { data, error } = await supabase.storage
            .from("images")
            .upload(fileName, image);

          if (error) throw error;

          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(fileName);

          return publicUrl;
        })
      );
      const userID = sessionStorage.getItem("userId");
      // Insert item into database
      const { error: insertError } = await supabase.from("items").insert({
        id: userID,
        title,
        description,
        price: parseFloat(price),
        product_type: category,
        year,
        department,
        images: imageUrls,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert tags string to array
        status: "unlisted", // Changed from availability: "false"
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Insert Error:", insertError);
        alert("Failed to create listing. Please try again.");
      }

      // Redirect to home page on success
      router.push("/");
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(URL.revokeObjectURL);
    };
  }, [previewUrls]);

  if (isLoading) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.warmPrimary }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Header activeTextColor={styles.warmPrimary} />
      <div className="max-w-4xl mx-auto p-4 ml-64">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1
            className="text-2xl font-semibold mb-6"
            style={{ color: styles.warmText }}
          >
            Create Listing
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Row */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            {/* Description Row */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            {/* Price and Product Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Product Type
                </label>
                <select
                  value={category}
                  onChange={(e) => setcategory(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                >
                  <option value="">Select Product Type</option>
                  <option value="Notes">Notes</option>
                  <option value="Uniform">Uniform</option>
                  <option value="Stationary">Stationary</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Year and Department Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: styles.warmBorder,
                    color: styles.warmText,
                  }}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="AI">AI</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="EC">EC</option>
                  <option value="EEE">EEE</option>
                  <option value="Civil">Civil</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            {/* Tags Row */}
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. engineering, first year, textbook"
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                style={{
                  borderColor: styles.warmBorder,
                  color: styles.warmText,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload
                      className="h-10 w-10 mb-3"
                      style={{ color: styles.warmText }}
                    />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                  </div>
                  <input
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
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg text-white flex items-center justify-center disabled:opacity-50"
              style={{ backgroundColor: styles.warmPrimary }}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
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
  );
}
