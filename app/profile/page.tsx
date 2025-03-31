"use client";

import { useEffect, useState } from "react";
import { styles } from "@/lib/styles";
import { supabase } from "@/lib/supabase";
import { Star, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import { Item as ItemType } from "@/lib/types";
import Sidebar from "@/components/Sidebar";

interface User {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  university_id?: string;
  role: string;
  profile_image?: string;
  year?: string;
  rating?: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    university_id: "",
    year: "",
  });
  const router = useRouter();

  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
        if (error) throw error;
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          department: data.department,
          university_id: data.university_id,
          year: data.year,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        console.log("User data fetched:", user);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchUserItems() {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("id", userId);
        if (error) throw error;

        const transformedItems = data.map((item) => ({
          ...item,
          title: item.name || item.title,
          images: item.image ? [item.image] : [],
          imageUrl: item.image,
        }));

        setItems(transformedItems);
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    }

    if (userId) {
      fetchUserItems();
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from("users")
        .update(formData)
        .eq("id", userId);
      if (error) throw error;
      setUser({ ...user, ...formData } as User);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleEditItem = (itemId: string) => {
    router.push(`/sell/edit/${itemId}`);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase
          .from("items")
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        setItems(items.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  return (
    <div className="h-screen">
      <div className="max-w-4xl mx-auto p-4 ">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <div className="mr-4">
              <img
                src={
                  user?.profile_image ||
                  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-800"
              />
            </div>
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{
                  color: styles.warmText,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {user?.name}
              </h1>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= (user?.rating || 0)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {user?.rating ? `${user.rating}/5` : "No ratings yet"}
                </span>
              </div>
            </div>
          </div>

          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border p-2 my-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border p-2 my-2 rounded"
              />
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full border p-2 my-2 rounded"
              />
              <input
                type="text"
                name="university_id"
                value={formData.university_id}
                onChange={handleInputChange}
                className="w-full border p-2 my-2 rounded"
              />
              <input
                type="text"
                name="year"
                value={formData.year || ""}
                onChange={handleInputChange}
                className="w-full border p-2 my-2 rounded"
                placeholder="Year of Study"
              />
              <button
                className="mt-4 px-4 py-2 text-white rounded-lg hover:bg-green-600"
                onClick={handleSave}
                style={{ backgroundColor: styles.warmPrimary }}
              >
                Save
              </button>
            </>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <p className="my-2">
                  <strong>Name:</strong> {user?.name}
                </p>
                <p className="my-2">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="my-2">
                  <strong>Department:</strong>{" "}
                  {user?.department || "Not specified"}
                </p>
                <p className="my-2">
                  <strong>University ID:</strong>{" "}
                  {user?.university_id || "Not specified"}
                </p>
                <p className="my-2">
                  <strong>Year:</strong> {user?.year || "Not specified"}
                </p>
                {user?.phone && (
                  <p className="my-2">
                    <strong>Phone:</strong> {user.phone}
                  </p>
                )}
                <p className="my-2">
                  <strong>Role:</strong> {user?.role || "Student"}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 text-white rounded-lg hover:brightness-110"
                  style={{ backgroundColor: styles.warmPrimary }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          <h2
            className="text-xl font-semibold mt-8 mb-4"
            style={{ color: styles.warmText }}
          >
            Your Items
          </h2>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group">
                  <ItemCard item={item} />
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 bg-white rounded-full shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditItem(item.id);
                      }}
                      style={{ color: styles.warmPrimary }}
                      title="Edit item"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-2 bg-white rounded-full shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteItem(item.id);
                      }}
                      style={{ color: styles.warmPrimary }}
                      title="Delete item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div
                    className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor:
                        item.status === "available"
                          ? "#dcfce7"
                          : item.status === "pending"
                          ? "#fef3c7"
                          : "#fee2e2",
                      color:
                        item.status === "available"
                          ? "#166534"
                          : item.status === "pending"
                          ? "#92400e"
                          : "#b91c1c",
                    }}
                  >
                    {item.status || "No Status"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No items added yet.</p>
              <button
                onClick={() => router.push("/sell")}
                className="mt-4 px-4 py-2 text-white rounded-lg hover:brightness-110"
                style={{ backgroundColor: styles.warmPrimary }}
              >
                Add an Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
