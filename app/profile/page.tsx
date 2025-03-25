"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles";
import { playfair } from "@/lib/fonts";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Item } from "@/lib/types";
import ItemCard from "@/components/ItemCard";
import Link from "next/link";

export default function ProfilePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user's listed items
  const fetchUserItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("seller_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Item[];
    } catch (err: any) {
      console.error("Error fetching user items:", err);
      throw new Error(err.message);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userId");

    // Clear local storage for backward compatibility
    localStorage.removeItem("user");

    // Redirect to login page
    router.push("/auth/login");
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      if (typeof window === "undefined") return;

      try {
        setLoading(true);
        setError(null);

        // Get user data from sessionStorage
        const storedUserName = sessionStorage.getItem("userName");
        const storedUserId = sessionStorage.getItem("userId");

        setUserName(storedUserName);
        setUserId(storedUserId);

        // If user is not logged in, redirect to login
        if (!storedUserId) {
          router.push("/auth/login");
          return;
        }

        // Fetch items listed by this user
        const items = await fetchUserItems(storedUserId);
        setUserItems(items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1
              className={`text-3xl font-bold mb-4 ${playfair.className}`}
              style={{ color: styles.warmText }}
            >
              {userName ? `${userName}'s Profile` : "My Profile"}
            </h1>

            <div className="flex justify-between items-center">
              <p style={{ color: styles.warmText }}>
                Manage your items and account settings
              </p>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-white transition-colors"
                style={{ backgroundColor: styles.warmPrimary }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor =
                    styles.warmPrimaryDark;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = styles.warmPrimary;
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* User's Listed Items Section */}
          <div className="mb-8">
            <h2
              className={`text-2xl font-semibold mb-4 ${playfair.className}`}
              style={{ color: styles.warmText }}
            >
              Your Listed Items
            </h2>

            {loading ? (
              <div
                className="text-center py-10"
                style={{ color: styles.warmText }}
              >
                Loading your items...
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : userItems.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p style={{ color: styles.warmText }} className="mb-4">
                  You haven't listed any items for sale yet.
                </p>
                <Link
                  href="/sell"
                  className="px-4 py-2 rounded-md text-white transition-colors inline-block"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  List an Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userItems.map((item) => (
                  <Link href={`/buy/${item.id}`} key={item.id}>
                    <ItemCard item={item} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
