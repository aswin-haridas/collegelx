import React from "react";
import { Item } from "@/shared/lib/types";
import { Button } from "@/shared/components/Atoms/Button";

interface ItemFormProps {
  item?: Partial<Item>;
  onSubmit: (formData: Partial<Item>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

const ItemForm: React.FC<ItemFormProps> = ({
  item = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save",
}) => {
  const [formData, setFormData] = React.useState<Partial<Item>>({
    title: item.title || "",
    description: item.description || "",
    price: item.price || 0,
    category: item.category || "",
    year: item.year || "",
    department: item.department || "",
    status: item.status || "available",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "price") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 w-full p-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 w-full p-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Price (₹)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 w-full p-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 w-full p-2 border rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="Notes">Notes</option>
          <option value="Uniform">Uniform</option>
          <option value="Stationary">Stationary</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Year</label>
        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          className="mt-1 w-full p-2 border rounded-lg"
        >
          <option value="">Select Year</option>
          <option value="1">1</option>
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
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="mt-1 w-full p-2 border rounded-lg"
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

      <div>
        <label className="block text-sm font-medium text-gray-600">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded-lg"
        >
          <option value="available">Available</option>
          <option value="unlisted">Unlisted</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 rounded-lg border border-gray-300"
          >
            Cancel
          </button>
        )}
        <Button
          onClick={() => {}}
          content={isLoading ? "Saving..." : submitLabel}
          type="submit"
          disabled={isLoading}
          className="bg-green-600"
        />
      </div>
    </form>
  );
};

export default ItemForm;
