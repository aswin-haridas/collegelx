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
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

// Custom hook for fetching similar items
function useSimilarItems(item: Item | null, limit: number = 4) {
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!item) {
      setLoading(false);
      return;
    }

    const fetchSimilarItems = async () => {
      try {
        // Find items with the same category but not the same ID
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("category", item.category)
          .eq("status", "available")
          .neq("id", item.id)
          .limit(limit);

        if (error) throw error;
        setSimilarItems(data || []);
      } catch (err) {
        console.error("Error fetching similar items:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarItems();
  }, [item, limit]);

  return { similarItems, loading, error };
}

export default function ItemPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth(false);
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;

  const {
    item,
    loading: itemLoading,
    error: itemError,
  } = useItem(itemId, true);

  const { seller, loading: sellerLoading } = useSeller(item?.seller_id);

  const { similarItems, loading: similarItemsLoading } = useSimilarItems(item);

  const loading = authLoading || itemLoading;

  const handleChat = () => {
    if (!isAuthenticated) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (item && seller) {
      router.push(`/chat?listingId=${item.id}&receiverId=${seller.userid}`);
    }
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
            {/* Left Side - Image */}
            {item.images && item.images.length > 0 && (
              <div className="md:w-2/5 w-full">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
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
                  className="w-full py-3 px-4 rounded-lg text-white flex items-center justify-center transition-colors hover:bg-opacity-90"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Chat with Seller
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
                  <div className="flex items-center">
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
                    <div>
                      <p
                        className="font-medium"
                        style={{ color: styles.warmText }}
                      >
                        {seller.name || "Anonymous Seller"}
                      </p>
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

        {/* Similar Products Section */}
        {!similarItemsLoading && similarItems.length > 0 && (
          <div className="mt-12">
            <h2
              className={`${playfair.className} text-2xl font-semibold mb-6`}
              style={{ color: styles.warmText }}
            >
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarItems.map((similarItem) => (
                <Link
                  href={`/buy/${similarItem.id}`}
                  key={similarItem.id}
                  className="block"
                >
                  <div
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col bg-white"
                    style={{ borderColor: styles.warmBorder }}
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      {similarItem.images && similarItem.images.length > 0 ? (
                        <img
                          src={similarItem.images[0]}
                          alt={similarItem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-500 text-sm">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="font-medium text-lg mb-1 line-clamp-2"
                        style={{ color: styles.warmText }}
                      >
                        {similarItem.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 flex-grow line-clamp-2">
                        {similarItem.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span
                          className="font-bold"
                          style={{ color: styles.warmPrimary }}
                        >
                          ₹{similarItem.price}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {similarItem.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
