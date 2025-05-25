"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { styles } from "@/shared/lib/styles";
import { Loader2, MessageSquare, ArrowLeft, Heart } from "lucide-react";
import { useParams } from "next/navigation";
<<<<<<< HEAD
import { useItem } from "@/hooks/useItem";
import { useWishlist } from "@/hooks/useWishlist";
import { useChatSave } from "@/hooks/useChatSave";
import toast from "react-hot-toast";
=======
import { useWishlist } from "@/shared/hooks/useWishlist";
import { useProduct } from "@/shared/hooks/useProducts";
import Header from "@/shared/components/Header";
import { supabase } from "@/shared/lib/supabase";
import { useLoginCheck } from "@/shared/hooks/useLoginCheck";
import Image from "next/image";
>>>>>>> feature

export default function ItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

<<<<<<< HEAD
=======
  useLoginCheck();

  const { userId, isAuthenticated, isLoading: authLoading } = useAuth();
  const { product: item, loading: itemLoading } = useProduct(itemId);
  const [seller, setSellerData] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(false);

>>>>>>> feature
  const {
    isWishlisted,
    toggleWishlist,
    loading: wishlistLoading,
  } = useWishlist(itemId);

<<<<<<< HEAD
  // Added useChatSave hook
  const { saveChat, loading: chatSaving } = useChatSave();

  const loading = authLoading || itemLoading;

  const isseller = userId && item?.seller_id === userId;
=======
  const loading = authLoading || itemLoading || sellerLoading;

  const isseller = userId && item?.seller_id === userId;

  // Fetch seller information when item is loaded
  useEffect(() => {
    async function fetchSellerData() {
      if (item?.seller_id) {
        setSellerLoading(true);
        const { data: sellerData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", item.seller_id)
          .single();

        if (error) {
          console.error("Error fetching seller data:", error);
        } else {
          setSellerData(sellerData);
        }
        setSellerLoading(false);
      }
    }

    fetchSellerData();
  }, [item]);
>>>>>>> feature

  // Store item ID in session storage when it becomes available
  useEffect(() => {
    if (item) {
      sessionStorage.setItem("listing_id", item.id);
    }
  }, [item]);

  const handleChat = async () => {
<<<<<<< HEAD
    if (!userId || !item) return;

    const sellerId = item?.seller_id || item?.user_id;

    // Save the chat and get the chat ID
    await saveChat({
      senderId: userId,
      receiverId: sellerId,
      listingId: item?.id,
    });

    const chatItemId = item?.id || sessionStorage.getItem("listing_id");
    // Get seller ID consistently with no duplicates
    const sellerIdForChat = sellerId || sessionStorage.getItem("seller_id");

    if (!chatItemId || !sellerIdForChat) {
      console.error("Missing required data for chat:", {
        chatItemId,
        sellerId: sellerIdForChat,
=======
    const chatItemId = item?.id || sessionStorage.getItem("listing_id");
    const sellerId =
      item?.seller_id || item?.user_id || sessionStorage.getItem("seller_id");

    if (!chatItemId || !sellerId || !userId) {
      console.error("Missing required data for chat:", {
        chatItemId,
        sellerId,
        userId,
>>>>>>> feature
      });
      return;
    }

<<<<<<< HEAD
    toast.success(`Opening chat with seller about: ${item?.title}`);

    // Store in session storage before navigation
    sessionStorage.setItem("listing_id", chatItemId);
    sessionStorage.setItem("receiver_id", sellerIdForChat);

    // Navigate with query parameters to ensure data persistence
    router.push(`/chat?receiverId=${sellerIdForChat}&listingId=${chatItemId}`);
=======
    try {
      // Check if a chat already exists between the buyer and seller for this product
      const { data: existingChats, error: fetchError } = await supabase
        .from("chats")
        .select("id")
        .eq("buyer_id", userId)
        .eq("seller_id", sellerId)
        .eq("product_id", chatItemId);

      if (fetchError) {
        console.error("Error fetching existing chats:", fetchError);
        return;
      }

      let chatId;

      if (existingChats && existingChats.length > 0) {
        // Use the existing chat ID
        chatId = existingChats[0].id;
      } else {
        // Create a new chat
        const { data: newChat, error: createError } = await supabase
          .from("chats")
          .insert({
            buyer_id: userId,
            seller_id: sellerId,
            product_id: chatItemId,
          })
          .select();

        if (createError) {
          console.error("Error creating new chat:", createError);
          return;
        }

        chatId = newChat[0].id;
      }

      // Navigate to the chat page
      router.push(`/chat?chatId=${chatId}`);
    } catch (error) {
      console.error("Error handling chat:", error);
    }
>>>>>>> feature
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login`);
      return;
    }

    await toggleWishlist();
  };

  if (loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center h-full ">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.Primary }}
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
              style={{ color: styles.Text }}
            >
              Item not found
            </h2>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.Primary }}
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
      <Header />
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
                  <Image
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
                            ? "border-Primary"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        style={{
                          borderColor:
                            selectedImageIndex === index
                              ? styles.Primary
                              : undefined,
                        }}
                      >
                        <Image
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
                    style={{ color: styles.Primary }}
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
                      style={{ backgroundColor: styles.Primary }}
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
<<<<<<< HEAD
                      onClick={() =>
                        router.push(
                          `/profile/${item.seller_id || item.seller_id}`
                        )
                      }
                      style={{ color: styles.warmPrimary }}
=======
                      onClick={() => router.push(`/profile/${item.seller_id}`)}
                      style={{ color: styles.Primary }}
>>>>>>> feature
                    >
                      {seller?.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: styles.Text }}
                >
                  Description
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Item Details */}
              <div className="mb-6">
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: styles.Text }}
                >
                  Quick Info
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Category</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Seller</span>
                    <span
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => router.push(`/profile/${item.seller_id}`)}
<<<<<<< HEAD
                      style={{ color: styles.warmPrimary }}
=======
                      style={{ color: styles.Primary }}
>>>>>>> feature
                    >
                      {seller?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller information */}
              {!sellerLoading && seller && (
                <div className="border-t border-gray-200 pt-6">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: styles.Text }}
                  >
                    Seller Information
                  </h2>
                  <div
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() =>
                      router.push(
<<<<<<< HEAD
                        `/profile/${
                          item.seller_id || item.seller_id || seller?.userid
                        }`
=======
                        `/profile/${item.seller_id || seller?.userid}`
>>>>>>> feature
                      )
                    }
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center">
                      {seller?.profile_image ? (
                        <Image
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
                        style={{ color: styles.Text }}
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
