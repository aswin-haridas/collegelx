"use client";

import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles";
import { Star, Edit, Trash2 } from "lucide-react";
import ItemCard from "@/components/ItemCard";

interface ProfileContentProps {
  activeTab: string;
  items: any[];
  wishlistItems: any[];
  reviews: any[];
  handleEditItem: (itemId: string) => void;
  handleDeleteItem: (itemId: string) => void;
  handleMarkAsSold: (itemId: string) => void;
  handleRemoveFromWishlist: (itemId: string) => void;
}

export default function ProfileContent({
  activeTab,
  items,
  wishlistItems,
  reviews,
  handleEditItem,
  handleDeleteItem,
  handleMarkAsSold,
  handleRemoveFromWishlist,
}: ProfileContentProps) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {activeTab === "products" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: styles.warmText }}>
              Your Items
            </h2>
            <button
              onClick={() => router.push("/sell")}
              className="px-4 py-2 text-white rounded-lg hover:brightness-110"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Add New Item
            </button>
          </div>
          {/* Products content */}
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
                    {item.status !== "sold" && (
                      <button
                        className="p-2 bg-white rounded-full shadow-md"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMarkAsSold(item.id);
                        }}
                        style={{ color: "#16a34a" }}
                        title="Mark as sold"
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
                          : item.status === "sold"
                          ? "#dbeafe"
                          : "#fee2e2",
                      color:
                        item.status === "available"
                          ? "#166534"
                          : item.status === "pending"
                          ? "#92400e"
                          : item.status === "sold"
                          ? "#1e40af"
                          : "#b91c1c",
                    }}
                  >
                    {item.status === "sold"
                      ? "Sold"
                      : item.status === "available"
                      ? "Available"
                      : item.status === "pending"
                      ? "Pending"
                      : "No Status"}
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
      )}

      {activeTab === "wishlist" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: styles.warmText }}>
              Your Wishlist
            </h2>
          </div>
          {/* Wishlist content */}
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="relative group">
                  <ItemCard item={item} />
                  <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 bg-white rounded-full shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(item.id);
                      }}
                      style={{ color: "#ef4444" }}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No items in your wishlist yet.</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 text-white rounded-lg hover:brightness-110"
                style={{ backgroundColor: styles.warmPrimary }}
              >
                Browse Items
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold" style={{ color: styles.warmText }}>
              Your Reviews
            </h2>
          </div>
          {/* Reviews content */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{review.reviewer_name}</p>
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
  );
}