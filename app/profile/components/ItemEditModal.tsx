"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { styles } from "@/shared/lib/styles";
// It would be good to import the Listing type here for formData and setItem
// import { Listing } from "@/types/index.ts"; 

type ItemEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onItemUpdated: () => void;
};

export default function ItemEditModal({
  isOpen,
  onClose,
  itemId,
  onItemUpdated,
}: ItemEditModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // TODO: Consider using Listing type for formData for better type safety
  const [formData, setFormData] = useState({
    title: "", // MODIFIED: name to title
    price: "",
    description: "",
    category_id: "", // MODIFIED: category to category_id (assuming it's an ID)
    status: "", // e.g., "available", "sold"
    condition: "", // Added field
  });
  const [error, setError] = useState("");
  // const [item, setItem] = useState<any>(null); // Consider using Listing type: useState<Listing | null>(null)

  useEffect(() => {
    const fetchItem = async () => {
      if (!isOpen || !itemId) return;

      setLoading(true);
      try {
        // MODIFIED: "products" to "listings"
        const { data, error: fetchError } = await supabase
          .from("listings")
          .select("title, price, description, category_id, status, condition") // Select specific fields
          .eq("id", itemId)
          .single();

        if (fetchError) throw fetchError;

        if (data) {
          // setItem(data); // If using a state for the full item
          setFormData({
            title: data.title || "", // MODIFIED: name to title
            price: data.price ? String(data.price) : "",
            description: data.description || "",
            category_id: data.category_id ? String(data.category_id) : "", // MODIFIED: category to category_id
            status: data.status || "available",
            condition: data.condition || "", // Added condition
          });
        }
      } catch (err:any) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [isOpen, itemId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (!formData.title || !formData.price) {
        throw new Error("Title and price are required");
      }

      const updateData: any = { // Use 'any' for now, or define a specific update type
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        status: formData.status,
        condition: formData.condition,
        updated_at: new Date().toISOString(), // Add updated_at timestamp
      };
      if (formData.category_id) {
        updateData.category_id = parseInt(formData.category_id);
      }


      // MODIFIED: "products" to "listings"
      const { error: updateError } = await supabase
        .from("listings")
        .update(updateData)
        .eq("id", itemId);

      if (updateError) throw updateError;

      onItemUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 backdrop-blur-lg " onClick={onClose} />
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
          style={{
            borderColor: styles.primary,
            borderWidth: "1px",
          }}
        >
          <div
            className="flex justify-between items-center p-4 border-b"
            style={{ borderColor: styles.primary }}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: styles.text }}
            >
              Edit Item
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2"
                  style={{ borderColor: styles.primary }}
                ></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.text }}
                  >
                    Title {/* MODIFIED: name to Title */}
                  </label>
                  <input
                    type="text"
                    name="title" // MODIFIED: name to title
                    value={formData.title} // MODIFIED: name to title
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.primary }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.text }}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.primary }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.text }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.primary }}
                  />
                </div>
                
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.text }}
                  >
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.primary }}
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>


                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.text }}
                  >
                    Category ID {/* MODIFIED: Category to Category ID */}
                  </label>
                  <input
                    type="number" // Assuming category_id is a number
                    name="category_id" // MODIFIED: category to category_id
                    value={formData.category_id} // MODIFIED: category to category_id
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.primary }}
                    placeholder="Enter Category ID (e.g., 1, 2)"
                  />
                  {/* Ideally, this would be a dropdown fetching from the 'categories' table */}
                </div>
                

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.text }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.primary }}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="reserved">Reserved</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md border"
                    style={{
                      borderColor: styles.primary,
                      color: styles.text,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-md text-white"
                    style={{
                      backgroundColor: saving ? styles.Accent : styles.primary,
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
