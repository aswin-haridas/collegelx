"use client";

import { styles } from "@/lib/styles";
import { MessageSquare, ArrowLeft, Heart } from "lucide-react";
import Header from "@/components/shared/Header";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import useSupabase from "@/hooks/useSupabase";
import { useParams } from "next/navigation";

export default function ItemPage() {
  const id = useAuth();
  const itemId = useParams().id as string;

  console.log(id);

  const item = useSupabase(
    "listings",
    ["id", "name", "price", "category", "images", "description", "seller_id"],
    itemId,
  );
  console.log(item);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-4  py-10">
        {/* Back button */}
        <button className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
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
                    alt={`${item.name} - Image ${selectedImageIndex + 1}`}
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
                              ? styles.primary
                              : undefined,
                        }}
                      >
                        <Image
                          src={image}
                          alt={`${item.name} - Thumbnail ${index + 1}`}
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

                {isseller ? (
                  <div className="py-3 px-4 rounded-lg bg-gray-200 text-gray-700 text-center font-medium mb-2">
                    You own this item
                  </div>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <button
                      className="flex-grow py-3 px-4 rounded-lg flex items-center justify-center transition-colors text-white hover:bg-opacity-90"
                      style={{ backgroundColor: styles.primary }}
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
                      style={{ color: styles.primary }}
                    >
                      {seller?.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Item Details */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Quick Info</h2>
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
                      style={{ color: styles.primary }}
                    >
                      {seller?.name || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller information */}
              {!sellerLoading && seller && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Seller Information
                  </h2>
                  <div
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() =>
                      router.push(
                        `/profile/${item.seller_id || seller?.userid}`,
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
                      <div className="font-medium hover:underline">
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
