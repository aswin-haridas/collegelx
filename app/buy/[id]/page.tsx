"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth/useAuth";
import { useState, useEffect } from "react";
import { styles } from "@/shared/lib/styles";
import { playfair } from "@/shared/lib/fonts";
import { Loader2, MessageSquare, ArrowLeft, Heart } from "lucide-react";
import { useParams } from "next/navigation";
import { useWishlist } from "@/shared/hooks/useWishlist";
import { useItem } from "@/hooks/useItem";

export default function ItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const {
    item,
    loading: itemLoading,
    seller,
    sellerLoading,
  } = useItem(itemId, true);
  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    isWishlisted,
    toggleWishlist,
    loading: wishlistLoading,
  } = useWishlist(itemId);

  const loading = authLoading || itemLoading;

  const isseller = userId && item?.seller_id === userId;

  // Store item ID in session storage when it becomes available
  useEffect(() => {
    if (item) {
      sessionStorage.setItem("listing_id", item.id);
    }
  }, [item]);

  const handleChat = () => {
    const chatItemId = item?.id || sessionStorage.getItem("listing_id");
    // Get seller ID consistently with no duplicates
    const sellerId =
      item?.seller_id || item?.user_id || sessionStorage.getItem("sender_id");

    if (!chatItemId || !sellerId) {
      console.error("Missing required data for chat:", {
        chatItemId,
        sellerId,
      });
      return;
    }

    console.log("Navigating to chat with:", { sellerId, chatItemId });

    // Store in session storage before navigation
    sessionStorage.setItem("listing_id", chatItemId);
    sessionStorage.setItem("receiver_id", sellerId);

    // Navigate with query parameters to ensure data persistence
    router.push(`/chat?receiverId=${sellerId}&listingId=${chatItemId}`);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login`);
      return;
    }

    toggleWishlist();
  };

  if (loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full ">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.warmPrimary }}
          />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full ">
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
      <div className="max-w-6xl mx-auto p-4  py-10">
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
                    src={item.images[selectedImageIndex]}
                    alt={`${item.title} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>

                {/* Image selection buttons */}
                {item.images.length > 1 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-warmPrimary"
                            : "border-gray-200 hover:border-gray-400"
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

                {isseller ? (
                  <div className="py-3 px-4 rounded-lg bg-gray-200 text-gray-700 text-center font-medium mb-2">
                    You own this item
                  </div>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={handleChat}
                      className="flex-grow py-3 px-4 rounded-lg flex items-center justify-center transition-colors text-white hover:bg-opacity-90"
                      style={{ backgroundColor: styles.warmPrimary }}
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Chat with Seller
                    </button>

                    <button
                      onClick={handleWishlist}
                      disabled={wishlistLoading}
                      className={`px-4 py-3 rounded-lg flex items-center justify-center transition-colors ${
                        isWishlisted
                          ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                        style={{ color: isWishlisted ? "#e11d48" : undefined }}
                      />
                    </button>
                  </div>
                )}

                {seller && (
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="mr-1">Posted by:</span>
                    <span
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => router.push(`/profile/${item.seller_id}`)}
                      style={{ color: styles.warmPrimary }}
                    >
                      {seller?.name}
                    </span>
                  </div>
                )}
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

                  <div>
                    <p className="text-gray-500">Seller</p>
                    <p
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => router.push(`/profile/${item.seller_id}`)}
                      style={{ color: styles.warmPrimary }}
                    >
                      {seller?.name || "Unknown"}
                    </p>
                  </div>
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
                    onClick={() =>
                      router.push(
                        `/profile/${item.seller_id || seller?.userid}`
                      )
                    }
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center">
                      {seller?.profile_image ? (
                        <img
                          src={seller.profile_image}
                          alt={seller?.name || "Seller"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-500">
                          {(seller?.name || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div
                        className="font-medium hover:underline"
                        style={{ color: styles.warmText }}
                      >
                        {seller?.name || "Anonymous Seller"}
                      </div>
                      <p className="text-sm text-gray-500">
                        {seller?.department ? `${seller.department}` : ""}
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
