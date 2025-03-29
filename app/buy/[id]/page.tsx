"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useItem } from "@/lib/hooks/useItem";
import { useSeller } from "@/lib/hooks/useSeller";
import { useState, useEffect } from "react";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";
import { Loader2, MessageSquare, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Item } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function ItemPage() {
  const { isAuthenticated, isLoading: authLoading, userId } = useAuth(false);
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  const [ownerData, setOwnerData] = useState<{ name: string } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const {
    item,
    loading: itemLoading,
    error: itemError,
  } = useItem(itemId, true);

  const { seller, loading: sellerLoading } = useSeller(item?.sender_id);

  const loading = authLoading || itemLoading;

  const isOwner = userId && item?.sender_id === userId;

  // Store item ID and seller ID in session storage on page load
  useEffect(() => {
    if (item && seller) {
      sessionStorage.setItem("listing_id", item.id);
      sessionStorage.setItem("sender_id", seller.userid);
    }
  }, []);

  // Fetch owner data separately when item is loaded
  useEffect(() => {
    const fetchOwnerName = async () => {
      if (!item?.owner) return;

      const { data, error } = await supabase
        .from("users")
        .select("name")
        .eq("id", item.owner)
        .single();

      if (!error && data) {
        setOwnerData(data);
        console.log("Owner data fetched:", data);
      } else if (error) {
        console.error("Error fetching owner data:", error);
      }
    };

    if (item?.owner) {
      fetchOwnerName();
    }
  }, [item]);

  const handleChat = () => {
    if (!isAuthenticated) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    // Use session storage values as fallback if direct access to item/seller fails
    const chatItemId = item?.id || sessionStorage.getItem("currentItemId");
    const chatSellerId =
      seller?.userid || sessionStorage.getItem("currentSellerId");

    console.log("Chat data:", { chatItemId, chatSellerId, item, seller });

    if (!chatItemId || !chatSellerId) {
      console.error("Missing required chat information:", {
        chatItemId,
        chatSellerId,
      });
      alert(
        "Unable to start chat. Missing item or seller information. Please try refreshing the page."
      );
      return;
    }

    router.push(`/chat?listingId=${chatItemId}&receiverId=${chatSellerId}`);
  };

  if (loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.warmPrimary }}
          />
        </div>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="h-screen">
        <Sidebar />
        <div className="flex justify-center items-center h-full ml-64">
          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              Item not found
            </h2>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="max-w-6xl mx-auto p-4 ml-64 py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </button>
  
        {/* Main item card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-wrap md:flex-nowrap items-start gap-8">
            {/* Left Side - Multiple Images */}
            {item.images && item.images.length > 0 && (
              <div className="md:w-2/5 w-full">
                {/* Currently selected image */}
                <div className="rounded-lg overflow-hidden mb-4">
                  <img
                    src={item.images[selectedImageIndex]} // Add state for selectedImageIndex
                    alt={`${item.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                
                {/* Image selection buttons */}
                {item.images.length > 1 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)} // Add setter from useState
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-warmPrimary' // Use your warmPrimary color
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{
                          borderColor:
                            selectedImageIndex === index
                              ? styles.warmPrimary
                              : undefined,
                        }}
                      >
                        <img
                          src={image}
                          alt={`${item.title} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Right Side - Details */}
            <div className="md:w-3/5 w-full">
              <h1
                className={`${playfair.className} text-4xl font-bold text-gray-800 mb-4`}
              >
                {item.title}
              </h1>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-3xl font-bold"
                    style={{ color: styles.warmPrimary }}
                  >
                    ₹{item.price}
                  </p>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    {item.category}
                  </span>
                </div>

                <button
                  onClick={handleChat}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                    isOwner
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "text-white hover:bg-opacity-90"
                  }`}
                  style={{
                    backgroundColor: isOwner ? undefined : styles.warmPrimary,
                  }}
                  disabled={!!isOwner}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {isOwner ? "You own this item" : "Chat with Seller"}
                </button>
              </div>

              <div className="mb-6">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: styles.warmText }}
                >
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              <div className="mb-6">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: styles.warmText }}
                >
                  Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Product Type</p>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Listed On</p>
                    <p className="font-medium">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {ownerData && (
                    <div>
                      <p className="text-gray-500">Owner</p>
                      <p
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => router.push(`/profile/${item.owner}`)}
                        style={{ color: styles.warmPrimary }}
                      >
                        {ownerData.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller information */}
              {!sellerLoading && seller && (
                <div className="border-t border-gray-200 pt-6">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: styles.warmText }}
                  >
                    Seller Information
                  </h2>
                  <div
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => router.push(`/profile/${seller.userid}`)}
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center">
                      {seller.profile_image ? (
                        <img
                          src={seller.profile_image}
                          alt={seller.name || "Seller"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-500">
                          {seller.name?.charAt(0).toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div
                        className="font-medium hover:underline"
                        style={{ color: styles.warmText }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/profile/${seller.userid}`);
                        }}
                      >
                        {ownerData?.name || seller.name || "Anonymous Seller"}
                      </div>
                      <p className="text-sm text-gray-500">
                        {seller.department ? `${seller.department}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
