"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { styles } from "@/shared/lib/styles";

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
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    status: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      if (!isOpen || !itemId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", itemId)
          .single();

        if (error) throw error;

        if (data) {
          setItem(data);
          setFormData({
            name: data.name || "",
            price: data.price ? String(data.price) : "",
            description: data.description || "",
            category: data.category || "",
            status: data.status || "available",
          });
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError("Failed to load item details");
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
      // Validate form
      if (!formData.name || !formData.price) {
        throw new Error("name and price are required");
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          status: formData.status,
        })
        .eq("id", itemId);

      if (error) throw error;

      onItemUpdated();
      onClose();
    } catch (err: unknown) {
      setError(err.message || "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 backdrop-blur-lg " onClick={onClose} />

      {/* Modal content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
          style={{
            borderColor: styles.Border,
            borderWidth: "1px",
          }}
        >
          {/* Modal header */}
          <div
            className="flex justify-between items-center p-4 border-b"
            style={{ borderColor: styles.Border }}
          >
            <h2
              className="text-xl font-semibold"
              style={{ color: styles.Text }}
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

          {/* Modal body */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2"
                  style={{ borderColor: styles.Primary }}
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
                    style={{ color: styles.Text }}
                  >
                    name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.Border }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.Text }}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.Border }}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.Text }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.Border }}
                  />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{ color: styles.Text }}
                    >
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      style={{ borderColor: styles.Border }}
                    >
                      <option value="">Select category</option>
                      <option value="textbooks">Textbooks</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="accessories">Accessories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: styles.Text }}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    style={{ borderColor: styles.Border }}
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
                      borderColor: styles.Border,
                      color: styles.Text,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-md text-white"
                    style={{
                      backgroundColor: saving ? styles.Accent : styles.Primary,
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
