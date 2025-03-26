"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export default function ProfilePage() {
  const { isAuthenticated, userId, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    router.push("/auth/login");
  };

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("name, email, phone, role")
          .eq("userid", userId)
          .eq("role", "user")
          .single();

        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading && isAuthenticated) {
      fetchUserData();
    }
  }, [userId, isAuthenticated, isLoading]);

  if (loading || isLoading) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: styles.warmPrimary }} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Header activeTextColor={styles.warmPrimary} />

      <div className="max-w-4xl mx-auto p-4 ml-64">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6" style={{ color: styles.warmText }}>
            Profile
          </h1>
          {user?.role=='user' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1" style={{ color: styles.warmText }}>{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1" style={{ color: styles.warmText }}>{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="mt-1" style={{ color: styles.warmText }}>{user.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600">Role</label>
                <p className="mt-1 capitalize" style={{ color: styles.warmText }}>{user.role}</p>
              </div>
            </div>
          ) : (
            <p>No user data available</p>
          )}
          <button
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}