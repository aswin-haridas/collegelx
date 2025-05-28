"use client";

import { useEffect, useState } from "react";
import { styles } from "@/shared/lib/styles";
import { supabase } from "@/shared/lib/supabase";
import { Star, Edit, Trash2, Package, MessageSquare } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ItemCard from "@/shared/components/ItemCard";
import Header from "@/shared/components/Header";
import { useReview } from "../useReview";
import Image from "next/image";

import { Listing as Item, User, Review as ReviewType } from "@/types/index.ts"; 
import { useAuth } from "@/hooks/useAuth"; 

// Define specific columns for listings on this page
const profileListingColumns = "id, user_id, category_id, title, description, price, condition, status, images, created_at";
const profileUserColumns = "id, full_name, email, profile_picture, college_id, created_at";


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]); 
  const [activeTab, setActiveTab] = useState("products");
  const { userId: currentUserId } = useAuth();
  const router = useRouter();
  const params = useParams();
  const profileId = params.id as string;

  const {
    reviews,
    isPostingReview,
    setIsPostingReview,
    reviewData,
    handleReviewInputChange,
    handlePostReview,
    fetchUserReviews,
    averageRating,
  } = useReview(profileId, currentUserId);

  useEffect(() => {
    async function fetchUserData() {
      if (!profileId) return;
      try {
        const { data, error } = await supabase
          .from("users")
          .select(profileUserColumns) // MODIFIED: Specific columns
          .eq("id", profileId)
          .single();
        if (error) throw error;
        setUser(data as User);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [profileId]);

  useEffect(() => {
    async function fetchUserItems() {
      if (!profileId) return;
      try {
        const { data, error } = await supabase
          .from("listings") 
          .select(profileListingColumns) // MODIFIED: Specific columns
          .eq("user_id", profileId); 
        if (error) throw error;
        // Data should already conform to Listing (aliased as Item) if columns match
        setItems(data as Item[] || []); 
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    }

    if (profileId) {
      fetchUserItems();
    }
  }, [profileId]);

  useEffect(() => {
    if (profileId && activeTab === "reviews") {
      fetchUserReviews(); // Assuming useReview hook handles its own specific column selections
    }
  }, [profileId, activeTab, fetchUserReviews]);

  const handleEditItem = (itemId: string) => {
    router.push(`/sell/edit/${itemId}`); 
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase
          .from("listings") 
          .delete()
          .eq("id", itemId);

        if (error) throw error;

        setItems(items.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    if (
      confirm("Mark this item as sold? It will no longer be visible to buyers.")
    ) {
      try {
        const { data: updatedItem, error } = await supabase // Fetch the updated item
          .from("listings") 
          .update({ status: "sold" })
          .eq("id", itemId)
          .select(profileListingColumns) // Select the updated item with specific columns
          .single();

        if (error) throw error;

        if (updatedItem) {
            setItems(
              items.map((item) =>
                item.id === itemId ? (updatedItem as Item) : item
              )
            );
        }
      } catch (error) {
        console.error("Error marking item as sold:", error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const isOwnProfile = currentUserId === profileId;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex items-center p-6">
              <div className="mr-4">
                <Image
                  src={
                    user?.profile_picture || 
                    "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                  }
                  alt="Profile"
                  width={96} height={96} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-yellow-800"
                />
              </div>
              <div>
                <h1
                  className="text-2xl font-semibold"
                  style={{
                    color: styles.text, 
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {user?.full_name || user?.username} 
                </h1>
                <div className="flex items-center mt-2">
                  {renderStars(averageRating || 0)}
                  <span className="ml-2 text-sm text-gray-600">
                    {averageRating ? `${averageRating.toFixed(1)}/5` : "No ratings yet"}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  className={`py-3 px-4 font-medium flex items-center ${
                    activeTab === "products"
                      ? "border-b-2 border-yellow-800 text-yellow-800"
                      : "text-gray-500 hover:text-yellow-800"
                  }`}
                  onClick={() => setActiveTab("products")}
                >
                  <Package size={18} className="mr-2" />
                  Products
                </button>
                <button
                  className={`py-3 px-4 font-medium flex items-center ${
                    activeTab === "reviews"
                      ? "border-b-2 border-yellow-800 text-yellow-800"
                      : "text-gray-500 hover:text-yellow-800"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  <MessageSquare size={18} className="mr-2" />
                  Reviews
                </button>
              </div>
            </div>
          </div>

          {activeTab === "products" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: styles.text }}
                >
                  {isOwnProfile ? "Your Items" : `${user?.full_name || user?.username}'s Items`}
                </h2>
                {isOwnProfile && (
                  <button
                    onClick={() => router.push("/sell")}
                    className="px-4 py-2 text-white rounded-lg hover:brightness-110"
                    style={{ backgroundColor: styles.primary }}
                  >
                    Add New Item
                  </button>
                )}
              </div>

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
                            style={{ color: styles.primary }}
                            aria-label="Edit item" 
                          >
                            <Edit size={16} />
                          </button>
                          {item.status !== "sold" && (
                            <button
                              className="p-2 bg-white rounded-full shadow-md"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMarkAsSold(item.id);
                              }}
                              style={{ color: "#16a34a" }}
                              aria-label="Mark as sold" 
                            >
                              <Star size={16} />
                            </button>
                          )}
                          <button
                            className="p-2 bg-white rounded-full shadow-md"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteItem(item.id);
                            }}
                            style={{ color: "#ef4444" }}
                            aria-label="Delete item" 
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
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
                      style={{ backgroundColor: styles.primary }}
                    >
                      Add an Item
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: styles.text }}
                >
                  {isOwnProfile ? "Your Reviews" : `Reviews for ${user?.full_name || user?.username}`}
                </h2>
                {!isOwnProfile && currentUserId && (
                  <button
                    onClick={() => setIsPostingReview(true)}
                    className="px-4 py-2 text-white rounded-lg hover:brightness-110"
                    style={{ backgroundColor: styles.primary }}
                  >
                    Post Review
                  </button>
                )}
              </div>

              {isPostingReview && (
                <form
                  onSubmit={handlePostReview}
                  className="bg-gray-50 p-4 rounded-lg mb-6"
                >
                  <h3 className="font-medium mb-3">Post a Review</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <label key={star} className="cursor-pointer mr-2">
                          <input
                            type="radio"
                            name="rating"
                            value={star}
                            checked={reviewData.rating === star}
                            onChange={handleReviewInputChange}
                            className="sr-only"
                          />
                          <Star
                            size={24}
                            className={`${
                              star <= reviewData.rating
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comment
                    </label>
                    <textarea
                      name="comment"
                      value={reviewData.comment}
                      onChange={handleReviewInputChange}
                      placeholder="Write your review here..."
                      className="w-full border p-2 rounded h-24"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white rounded-lg hover:bg-green-600"
                      style={{ backgroundColor: styles.primary }}
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsPostingReview(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: ReviewType) => ( 
                    <div
                      key={review.id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{(review as any).reviewer_name || "Anonymous"}</p>
                          <div className="flex mt-1">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No reviews yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
