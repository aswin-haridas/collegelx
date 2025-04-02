"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// filepath: d:/SP/collegelx/app/profile/ItemEditModal.tsx


interface ItemEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: string;
    onItemUpdated: () => void;
}

export default function ItemEditModal({
    isOpen,
    onClose,
    itemId,
    onItemUpdated,
}: ItemEditModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [department, setDepartment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && itemId) {
            fetchItemDetails();
        }
    }, [isOpen, itemId]);

    const fetchItemDetails = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from("items")
                .select("*")
                .eq("id", itemId)
                .single();

            if (error) throw error;

            setTitle(data.title);
            setDescription(data.description);
            setPrice(data.price.toString());
            setCategory(data.category);
            setYear(data.year);
            setDepartment(data.department);
        } catch (error) {
            console.error("Error fetching item details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from("items")
                .update({
                    title,
                    description,
                    price: parseFloat(price),
                    category,
                    year,
                    department,
                })
                .eq("id", itemId);

            if (error) throw error;

            alert("Item updated successfully!");
            onItemUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="mt-1 w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
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
                            <label className="block text-sm font-medium text-gray-600">
                                Year
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
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
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
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

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 rounded-lg border border-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-4 rounded-lg text-white"
                                style={{ backgroundColor: "#4CAF50" }}
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}