"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import { supabase } from "@/lib/supabase";
import { Star, Edit, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
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
  id: string;
}

export default function ProfilePage() {
  const { isAuthenticated, userId, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState(false);

  const router = useRouter();
  const { id } = useParams();
  const profileId = Array.isArray(id) ? id[0] : id;
  const isOwnProfile = userId === profileId;

  useEffect(() => {
    async function fetchUserData() {
      if (!profileId) return;
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", profileId)
          .single();
        if (error) throw error;
        setUser(data);

        // Fetch user's average rating
        const { data: ratingData, error: ratingError } = await supabase
          .from("ratings")
          .select("rating")
          .eq("rated_user_id", profileId);

        if (ratingError) throw ratingError;

        if (ratingData && ratingData.length > 0) {
          const avgRating =
            ratingData.reduce((sum, item) => sum + Number(item.rating), 0) /
            ratingData.length;
          setUser((prev) => (prev ? { ...prev, rating: avgRating } : null));
        }

        // Check if current user has already rated this user
        if (userId && userId !== profileId) {
          const { data: existingRating, error: ratingCheckError } =
            await supabase
              .from("ratings")
              .select("rating")
              .eq("rated_user_id", profileId)
              .eq("rater_user_id", userId)
              .maybeSingle();

          if (!ratingCheckError && existingRating) {
            setUserRating(existingRating.rating);
            setHasRated(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    if (!isLoading) {
      fetchUserData();
    }
  }, [profileId, userId, isLoading, isOwnProfile]);

  useEffect(() => {
    async function fetchUserItems() {
      if (!profileId) return;
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("user_id", profileId);
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

    if (profileId) {
      fetchUserItems();
    }
  }, [profileId]);

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

  const handleRateUser = async (rating: number) => {
    if (!userId || !profileId || userId === profileId) return;

    try {
      // First check if user has already rated
      const { data: existingRating, error: checkError } = await supabase
        .from("ratings")
        .select("id")
        .eq("rated_user_id", profileId)
        .eq("rater_user_id", userId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      let ratingError;
      // If already rated, update the rating
      if (existingRating) {
        const { error } = await supabase
          .from("ratings")
          .update({ rating })
          .eq("rated_user_id", profileId)
          .eq("rater_user_id", userId);
        ratingError = error;
      } else {
        // Otherwise insert a new rating
        const { error } = await supabase.from("ratings").insert({
          rated_user_id: profileId,
          rater_user_id: userId,
          rating,
        });
        ratingError = error;
      }

      if (ratingError) throw ratingError;

      setUserRating(rating);
      setHasRated(true);

      // Refetch the average rating
      const { data: ratingData, error: ratingError2 } = await supabase
        .from("ratings")
        .select("rating")
        .eq("rated_user_id", profileId);

      if (ratingError2) throw ratingError2;

      if (ratingData && ratingData.length > 0) {
        const avgRating =
          ratingData.reduce((sum, item) => sum + Number(item.rating), 0) /
          ratingData.length;
        setUser((prev) => (prev ? { ...prev, rating: avgRating } : null));
      }
    } catch (error) {
      console.error("Error rating user:", error);
      alert("Failed to submit rating. Please try again.");
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
                    } cursor-pointer transition-all duration-150`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {user?.rating
                    ? `${user.rating.toFixed(1)}/5`
                    : "No ratings yet"}
                </span>
              </div>

              {!isOwnProfile && userId && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Rate this user:</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`cursor-pointer transition-all duration-150 hover:scale-110 ${
                          star <= (hoveredRating || userRating || 0)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleRateUser(star)}
                      />
                    ))}
                    {hasRated && (
                      <span className="ml-2 text-sm text-green-600">
                        {userRating ? `Your rating: ${userRating}/5` : ""}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

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
          </div>

          <h2
            className="text-xl font-semibold mt-8 mb-4"
            style={{ color: styles.warmText }}
          >
            {isOwnProfile ? "Your Items" : `${user?.name}'s Items`}
          </h2>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group">
                  <ItemCard item={item} />
                  {isOwnProfile && (
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
                  )}
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
              {isOwnProfile && (
                <button
                  onClick={() => router.push("/sell")}
                  className="mt-4 px-4 py-2 text-white rounded-lg hover:brightness-110"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  Add an Item
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
