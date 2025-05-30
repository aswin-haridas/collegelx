"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Item } from "@/types"; // Item type
import { User } from '@supabase/supabase-js'; // Supabase User type
import { supabase } from '@/shared/lib/supabase'; // Client-side Supabase
import toast from 'react-hot-toast';
import { styles } from "@/shared/styles/theme";
import { MessageSquare, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Assuming playfair is part of styles from theme.ts or defined globally.
// If not, it needs to be imported or defined properly. For now, let's assume it's available via styles.
const playfair = styles.playfair || { className: "font-playfair" }; // Access from styles or fallback

// Define ItemWithSeller if not imported (structure based on server component query)
type ItemWithSeller = Item & {
  seller_id: User | null;
};

interface ProductDetailClientViewProps {
  item: ItemWithSeller;
  user: User | null;
  isSeller: boolean;
  isWishlistedInitial: boolean;
}

export default function ProductDetailClientView({ item, user, isSeller, isWishlistedInitial }: ProductDetailClientViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitial);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    setIsWishlisted(isWishlistedInitial);
  }, [isWishlistedInitial]);

  const handleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to your wishlist.");
      router.push("/login");
      return;
    }
    if (!item) return;

    setWishlistLoading(true);
    if (isWishlisted) {
      // Remove from wishlist
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", item.id)
        .eq("user_id", user.id);
      if (error) {
        toast.error("Failed to remove from wishlist: " + error.message);
      } else {
        setIsWishlisted(false);
        toast.success("Removed from wishlist!");
      }
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from("wishlist")
        .insert([{ product_id: item.id, user_id: user.id }]);
      if (error) {
        toast.error("Failed to add to wishlist: " + error.message);
      } else {
        setIsWishlisted(true);
        toast.success("Added to wishlist!");
      }
    }
    setWishlistLoading(false);
  };

  const handleChat = () => {
    if (!user) {
      toast.error("Please login to chat with the seller.");
      router.push("/login");
      return;
    }
    if (!item || !item.seller_id) {
      toast.error("Seller information is not available.");
      return;
    }
    router.push(`/chat?recipientId=${item.seller_id.id}&listingId=${item.id}`);
  };

  if (!item) {
    // but as a fallback:
    return <p className="text-center text-red-500">Item not found.</p>;
  }

  // Use item.seller_id directly if it's populated by the server query
  const seller = item.seller_id;

  return (
    <div className="max-w-6xl mx-auto p-4 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </button>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-wrap md:flex-nowrap items-start gap-8">
          {/* Left Side - Multiple Images */}
          {item.images && item.images.length > 0 && (
            <div className="md:w-2/5 w-full">
              <div className="rounded-lg overflow-hidden mb-4">
                <Image
                  src={item.images[selectedImageIndex]}
                  alt={`${item.name} - Image ${selectedImageIndex + 1}`}
                  width={500} // Provide appropriate width
                  height={500} // Provide appropriate height
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              {item.images.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {item.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? "border-Primary" // Make sure 'Primary' is a valid class or use styles.primary
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={{
                        borderColor:
                          selectedImageIndex === index
                            ? styles.primary // Assuming styles.primary is defined
                            : undefined,
                      }}
                    >
                      <Image
                        src={image}
                        alt={`${item.name} - Thumbnail ${index + 1}`}
                        width={80} // Thumbnail width
                        height={80} // Thumbnail height
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
              {item.name}
            </h1>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-3xl font-bold"
                  style={{ color: styles.primary }}
                >
                  ₹{item.price}
                </p>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                  {item.category}
                </span>
              </div>

              {isSeller ? (
                <div className="py-3 px-4 rounded-lg bg-gray-200 text-gray-700 text-center font-medium mb-2">
                  You own this item
                </div>
              ) : (
                <div className="flex gap-2 mb-2">
                  <button
                    className="flex-grow py-3 px-4 rounded-lg flex items-center justify-center transition-colors text-white hover:bg-opacity-90"
                    style={{ backgroundColor: styles.primary }}
                    onClick={handleChat}
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
                      className={`h-5 w-5 ${isWishlisted ? "fill-current text-pink-600" : "text-gray-700"}`}
                    />
                  </button>
                </div>
              )}

              {seller && (
                <div className="text-sm text-gray-600 flex items-center">
                  <span className="mr-1">Posted by:</span>
                  <Link href={`/profile/${seller.id}`} className="font-medium cursor-pointer hover:underline" style={{ color: styles.primary }}>
                      {seller.full_name || "Unknown Seller"}
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {item.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Quick Info</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Category</span>
                  <span className="font-medium">{item.category}</span>
                </div>
                {seller && (
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Seller</span>
                     <Link href={`/profile/${seller.id}`} className="font-medium cursor-pointer hover:underline" style={{ color: styles.primary }}>
                        {seller.full_name || "Unknown Seller"}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {seller && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Seller Information
                </h2>
                <Link href={`/profile/${seller.id}`} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4 flex items-center justify-center">
                    {seller.profile_picture ? (
                      <Image
                        src={seller.profile_picture}
                        alt={seller.full_name || "Seller"}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-500">
                        {(seller.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium hover:underline">
                      {seller.full_name || "Anonymous Seller"}
                    </div>
                    <p className="text-sm text-gray-500">
                      {seller.department ? `${seller.department}` : ""}
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
