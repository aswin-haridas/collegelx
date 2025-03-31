"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import { supabase } from "@/lib/supabase";
import {
  Loader2,
  CircleCheck,
  UserX,
  UserCheck,
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ShoppingBag,
  ClipboardCheck,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { playfair } from "@/lib/fonts";
import Sidebar from "@/components/Sidebar";

// Define types for better type safety
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  status: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  banned: boolean;
  created_at: string;
}

// Loading component for better reusability
const LoadingSpinner = () => (
  <div className="h-screen">
    <div className="flex justify-center items-center h-full ">
      <Loader2
        className="h-8 w-8 animate-spin"
        style={{ color: styles.warmPrimary }}
      />
    </div>
  </div>
);

// Stats Card Component
const StatCard = ({
  icon,
  title,
  count,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  bgColor: string;
}) => (
  <div className={`${bgColor} rounded-lg shadow-md p-4 flex items-center`}>
    <div className="p-3 bg-white bg-opacity-30 rounded-full mr-4">{icon}</div>
    <div>
      <h3 className="text-xl font-bold text-white">{count}</h3>
      <p className="text-white text-opacity-90">{title}</p>
    </div>
  </div>
);

// Product item component
const ProductItem = ({
  product,
  onApprove,
  onReject,
  isProcessing,
}: {
  product: Product;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isProcessing: Record<string, boolean>;
}) => (
  <div
    key={product.id}
    className="border border-gray-50 shadow-xl  p-4 rounded-lg flex justify-between items-center"
  >
    <div>
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-gray-600">₹{product.price}</p>
    </div>
    <div className="space-x-2">
      <button
        onClick={() => onApprove(product.id)}
        disabled={isProcessing[product.id]}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
      >
        {isProcessing[product.id] ? "Processing..." : "Approve"}
      </button>
      <button
        onClick={() => onReject(product.id)}
        disabled={isProcessing[product.id]}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300"
      >
        {isProcessing[product.id] ? "Processing..." : "Reject"}
      </button>
    </div>
  </div>
);

// All Products item component
const AllProductItem = ({
  product,
  onRemove,
  isProcessing,
}: {
  product: Product;
  onRemove: (id: string) => Promise<void>;
  isProcessing: Record<string, boolean>;
}) => (
  <div
    key={product.id}
    className="border border-gray-50 shadow-xl p-4 rounded-lg flex justify-between items-center"
  >
    <div>
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-gray-600">₹{product.price}</p>
      <span
        className={`px-2 py-1 rounded text-xs ${
          product.status === "available"
            ? "bg-green-100 text-green-800"
            : product.status === "sold"
            ? "bg-blue-100 text-blue-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {product.status}
      </span>
    </div>
    <div className="space-x-2">
      <button
        onClick={() => onRemove(product.id)}
        disabled={isProcessing[product.id]}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300"
      >
        {isProcessing[product.id] ? "Processing..." : "Remove"}
      </button>
    </div>
  </div>
);

// User item component
const UserItem = ({
  user,
  onToggleBan,
  isProcessing,
}: {
  user: User;
  onToggleBan: (id: string, currentStatus: boolean) => Promise<void>;
  isProcessing: Record<string, boolean>;
}) => (
  <div
    key={user.id}
    className="border border-gray-50 shadow-xl p-4 rounded-lg flex justify-between items-center"
  >
    <div>
      <h3 className="font-semibold">{user.email}</h3>
      <p className="text-sm text-gray-600">Role: {user.role}</p>
      <p className="text-xs text-gray-400">
        Joined: {new Date(user.created_at).toLocaleDateString()}
      </p>
      <span
        className={`px-2 py-1 rounded text-xs ${
          user.banned
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {user.banned ? "Banned" : "Active"}
      </span>
    </div>
    <div className="space-x-2">
      <button
        onClick={() => onToggleBan(user.id, user.banned)}
        disabled={isProcessing[user.id] || user.role === "admin"}
        className={`px-4 py-2 ${
          user.banned
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        } text-white rounded-lg disabled:bg-gray-300 flex items-center`}
      >
        {isProcessing[user.id] ? (
          "Processing..."
        ) : user.banned ? (
          <>
            <UserCheck className="h-4 w-4 mr-1" />
            Unban
          </>
        ) : (
          <>
            <UserX className="h-4 w-4 mr-1" />
            Ban
          </>
        )}
      </button>
    </div>
  </div>
);

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<
    Record<string, boolean>
  >({});
  const [activeSection, setActiveSection] = useState<
    "pendingItems" | "allItems" | "users" | "settings"
  >("pendingItems");

  // Stats counters
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApprovals: 0,
    registeredUsers: 0,
  });

  // Check authentication and admin role
  useEffect(() => {
    const checkAdminRole = () => {
      const storedRole = localStorage.getItem("userRole");
      setUserRole(storedRole);

      console.log("Auth Status:", {
        isAuthenticated,
        userRole: storedRole,
        loading: authLoading,
      });

      if (!authLoading) {
        if (!isAuthenticated || storedRole !== "admin") {
          router.push("/");
        } else {
          setPageLoading(false);
        }
      }
    };

    checkAdminRole();
  }, [isAuthenticated, authLoading, router]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      // Fetch total products count
      const { count: totalProducts, error: productsError } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true });

      // Fetch pending approvals count
      const { count: pendingApprovals, error: pendingError } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("status", "unlisted");

      // Fetch registered users count
      const { count: registeredUsers, error: usersError } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (productsError || pendingError || usersError) {
        console.error("Error fetching stats", {
          productsError,
          pendingError,
          usersError,
        });
        return;
      }

      setStats({
        totalProducts: totalProducts || 0,
        pendingApprovals: pendingApprovals || 0,
        registeredUsers: registeredUsers || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  // Fetch unapproved products
  const fetchUnsoldProducts = useCallback(async () => {
    try {
      setFetchError(null);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("status", "unlisted");

      if (error) {
        setFetchError(error.message);
        return;
      }

      setProducts(data || []);
    } catch (err) {
      setFetchError("Failed to fetch products");
      console.error("Error fetching products:", err);
    }
  }, []);

  // Fetch all products
  const fetchAllProducts = useCallback(async () => {
    try {
      setFetchError(null);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
        return;
      }

      setAllProducts(data || []);
    } catch (err) {
      setFetchError("Failed to fetch all products");
      console.error("Error fetching all products:", err);
    }
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setFetchError(null);

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
        return;
      }

      setUsers(data || []);
    } catch (err) {
      setFetchError("Failed to fetch users");
      console.error("Error fetching users:", err);
    }
  }, []);

  useEffect(() => {
    if (!pageLoading && isAuthenticated && userRole === "admin") {
      // Always fetch stats
      fetchStats();

      if (activeSection === "pendingItems") {
        fetchUnsoldProducts();
      } else if (activeSection === "allItems") {
        fetchAllProducts();
      } else if (activeSection === "users") {
        fetchUsers();
      }
    }
  }, [
    pageLoading,
    isAuthenticated,
    userRole,
    activeSection,
    fetchUnsoldProducts,
    fetchAllProducts,
    fetchUsers,
    fetchStats,
  ]);

  const handleApprove = async (productId: string) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [productId]: true }));

      const { error } = await supabase
        .from("items")
        .update({ status: "available" })
        .eq("id", productId);

      if (error) {
        setActionError(`Failed to approve: ${error.message}`);
        return;
      }

      await fetchUnsoldProducts();
      await fetchStats(); // Refresh stats after changes
    } catch (err) {
      setActionError("An unexpected error occurred while approving");
      console.error("Error approving product:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleReject = async (productId: string) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [productId]: true }));

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", productId);

      if (error) {
        setActionError(`Failed to reject: ${error.message}`);
        return;
      }

      await fetchUnsoldProducts();
      await fetchStats(); // Refresh stats after changes
    } catch (err) {
      setActionError("An unexpected error occurred while rejecting");
      console.error("Error rejecting product:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [productId]: true }));

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", productId);

      if (error) {
        setActionError(`Failed to remove: ${error.message}`);
        return;
      }

      await fetchAllProducts();
      await fetchStats(); // Refresh stats after changes
    } catch (err) {
      setActionError("An unexpected error occurred while removing the product");
      console.error("Error removing product:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleToggleUserBan = async (
    userId: string,
    currentBanStatus: boolean
  ) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [userId]: true }));

      const { error } = await supabase
        .from("users")
        .update({ banned: !currentBanStatus })
        .eq("id", userId);

      if (error) {
        setActionError(`Failed to update user: ${error.message}`);
        return;
      }

      await fetchUsers();
      await fetchStats(); // Refresh stats after changes
    } catch (err) {
      setActionError("An unexpected error occurred while updating user");
      console.error("Error updating user:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (pageLoading || authLoading) {
    return <LoadingSpinner />;
  }

  // Sidebar navigation items
  const navItems = [
    {
      icon: <LayoutDashboard size={24} />,
      label: "Dashboard",
      action: () => setActiveSection("pendingItems"),
      active: activeSection === "pendingItems",
    },
    {
      icon: <Package size={24} />,
      label: "Products",
      action: () => setActiveSection("allItems"),
      active: activeSection === "allItems",
    },
    {
      icon: <Users size={24} />,
      label: "Users",
      action: () => setActiveSection("users"),
      active: activeSection === "users",
    },
    {
      icon: <Settings size={24} />,
      label: "Settings",
      action: () => setActiveSection("settings"),
      active: activeSection === "settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-20 bg-white shadow-md flex flex-col items-center py-8 space-y-8">
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer p-3 rounded-xl transition-all
              ${
                item.active
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            onClick={item.action}
            title={item.label}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <h1
            className={`text-4xl font-base mb-8 ${playfair.className}`}
            style={{ color: styles.warmPrimaryDark }}
          >
            Admin Dashboard
          </h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<ShoppingBag size={24} color="white" />}
              title="Total Products"
              count={stats.totalProducts}
              bgColor="bg-blue-500"
            />
            <StatCard
              icon={<ClipboardCheck size={24} color="white" />}
              title="Pending Approvals"
              count={stats.pendingApprovals}
              bgColor="bg-amber-500"
            />
            <StatCard
              icon={<UserCircle size={24} color="white" />}
              title="Registered Users"
              count={stats.registeredUsers}
              bgColor="bg-green-500"
            />
          </div>

          {(fetchError || actionError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <CircleCheck className="h-5 w-5 mr-2" />
              <span>{fetchError || actionError}</span>
            </div>
          )}

          {/* Content Section Title */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeSection === "pendingItems" && "Pending Approvals"}
              {activeSection === "allItems" && "All Products"}
              {activeSection === "users" && "User Management"}
              {activeSection === "settings" && "Settings"}
            </h2>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {activeSection === "pendingItems" && (
                <>
                  {products.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isProcessing={processingItems}
                    />
                  ))}

                  {products.length === 0 && (
                    <p className="text-gray-500">
                      No products pending approval
                    </p>
                  )}
                </>
              )}

              {activeSection === "allItems" && (
                <>
                  {allProducts.map((product) => (
                    <AllProductItem
                      key={product.id}
                      product={product}
                      onRemove={handleRemoveProduct}
                      isProcessing={processingItems}
                    />
                  ))}

                  {allProducts.length === 0 && (
                    <p className="text-gray-500">No products available</p>
                  )}
                </>
              )}

              {activeSection === "users" && (
                <>
                  {users.map((user) => (
                    <UserItem
                      key={user.id}
                      user={user}
                      onToggleBan={handleToggleUserBan}
                      isProcessing={processingItems}
                    />
                  ))}

                  {users.length === 0 && (
                    <p className="text-gray-500">No users found</p>
                  )}
                </>
              )}

              {activeSection === "settings" && (
                <div className="text-gray-500">
                  <p>Settings panel coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
