"use client";

import React, { useState } from "react";
import { styles } from "@/lib/styles";

import { Item } from "@/lib/types";

interface ItemActionsProps {
  item: Item;
}

const ItemActions = ({ item }: ItemActionsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState<Item>(item);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (isEditing) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/items/${item.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedItem),
        });

        if (!response.ok) {
          throw new Error("Failed to update item");
        }

        // Refresh the page to show updated data
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedItem(item);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "price") {
      setEditedItem({ ...editedItem, [name]: parseFloat(value) || 0 });
    } else {
      setEditedItem({ ...editedItem, [name]: value });
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2">
          <input
            type="text"
            name="title"
            value={editedItem.title}
            onChange={handleInputChange}
            className="px-2 py-1 border rounded"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editedItem.description || ""}
            onChange={handleInputChange}
            className="px-2 py-1 border rounded"
            placeholder="Description"
            rows={2}
          />
          <input
            type="number"
            name="price"
            value={editedItem.price || ""}
            onChange={handleInputChange}
            className="px-2 py-1 border rounded"
            placeholder="Price"
            step="0.01"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="px-3 py-1 rounded"
            style={{ backgroundColor: styles.warmPrimary, color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancelEdit}
            className="px-3 py-1 rounded"
            style={{
              backgroundColor: styles.warmBorder,
              color: styles.warmText,
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Are you sure you want to delete this item?
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded"
            style={{ backgroundColor: "red", color: "white" }}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </button>
          <button
            onClick={handleCancelDelete}
            className="px-3 py-1 rounded"
            style={{
              backgroundColor: styles.warmBorder,
              color: styles.warmText,
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleEdit}
        className="px-3 py-1 rounded"
        style={{ backgroundColor: styles.warmPrimary, color: "white" }}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 rounded"
        style={{ backgroundColor: styles.warmPrimaryDark, color: "white" }}
      >
        Delete
      </button>
    </div>
  );
};

export default ItemActions;
