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
  verified: boolean; // Add verified status
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
  <div
    className={`rounded-lg shadow-md p-4 flex items-center`}
    style={{ backgroundColor: bgColor }}
  >
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
    className="border border-gray-50 shadow-xl p-4 rounded-lg flex justify-between items-center"
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
        className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
          isProcessing[product.id]
            ? "bg-green-300"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isProcessing[product.id] ? "Processing..." : "Approve"}
      </button>
      <button
        onClick={() => onReject(product.id)}
        disabled={isProcessing[product.id]}
        className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${
          isProcessing[product.id] ? "opacity-70" : "hover:opacity-80"
        }`}
        style={{
          backgroundColor: styles.warmPrimary,
        }}
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
  onToggleVerify,
  isProcessing,
}: {
  user: User;
  onToggleBan: (id: string, currentStatus: boolean) => Promise<void>;
  onToggleVerify: (id: string, currentStatus: boolean) => Promise<void>;
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
      <div className="flex space-x-2 mt-1">
        <span
          className={`px-2 py-1 rounded text-xs ${
            user.banned
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {user.banned ? "Banned" : "Active"}
        </span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            user.verified
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {user.verified ? "Verified" : "Pending"}
        </span>
      </div>
    </div>
    <div className="space-x-2 flex">
      <button
        onClick={() => onToggleVerify(user.id, user.verified)}
        disabled={isProcessing[`verify-${user.id}`] || user.role === "admin"}
        className={`px-4 py-2 ${
          user.verified
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white rounded-lg disabled:bg-gray-300 flex items-center`}
      >
        {isProcessing[`verify-${user.id}`]
          ? "Processing..."
          : user.verified
          ? "Unverify"
          : "Verify"}
      </button>
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
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<
    Record<string, boolean>
  >({});
  const [activeSection, setActiveSection] = useState<
    "pendingItems" | "allItems" | "users" | "settings"
  >("pendingItems");

  // Search and filter states
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("all");

  // Stats counters
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingApprovals: 0,
    registeredUsers: 0,
  });

  // Set page loading state when auth is complete
  useEffect(() => {
    if (!authLoading) {
      setPageLoading(false);
    }
  }, [authLoading]);

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
      setFilteredProducts(data || []);
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

      // Map data to ensure verified field exists
      const usersWithVerified = (data || []).map((user) => ({
        ...user,
        verified: user.verified !== undefined ? user.verified : false,
      }));

      setUsers(usersWithVerified);
      setFilteredUsers(usersWithVerified);
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

  // Filter products based on search and status
  useEffect(() => {
    if (allProducts.length) {
      let filtered = [...allProducts];

      // Apply search filter
      if (productSearchQuery) {
        filtered = filtered.filter(
          (product) =>
            product.title
              .toLowerCase()
              .includes(productSearchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(productSearchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (productStatusFilter !== "all") {
        filtered = filtered.filter(
          (product) => product.status === productStatusFilter
        );
      }

      setFilteredProducts(filtered);
    }
  }, [allProducts, productSearchQuery, productStatusFilter]);

  // Filter users based on search
  useEffect(() => {
    if (users.length) {
      if (userSearchQuery) {
        const filtered = users.filter((user) =>
          user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }
  }, [users, userSearchQuery]);

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

  const handleToggleUserVerify = async (
    userId: string,
    currentVerifyStatus: boolean
  ) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [`verify-${userId}`]: true }));

      const { error } = await supabase
        .from("users")
        .update({ verified: !currentVerifyStatus })
        .eq("id", userId);

      if (error) {
        setActionError(`Failed to update user verification: ${error.message}`);
        return;
      }

      await fetchUsers();
    } catch (err) {
      setActionError(
        "An unexpected error occurred while updating user verification"
      );
      console.error("Error updating user verification:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [`verify-${userId}`]: false }));
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
    <div className="flex h-screen" style={{ backgroundColor: styles.warmBg }}>
      {/* Sidebar */}
      <div
        className="w-20 flex flex-col items-center py-8 space-y-8 shadow-md"
        style={{
          backgroundColor: "white",
          borderRight: `1px solid ${styles.warmBorder}`,
        }}
      >
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer p-3 rounded-xl transition-all`}
            style={{
              backgroundColor: item.active ? "#F2E6DC" : "transparent",
              color: item.active ? styles.warmPrimaryDark : styles.warmText,
            }}
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
              bgColor={styles.warmPrimary}
            />
            <StatCard
              icon={<ClipboardCheck size={24} color="white" />}
              title="Pending Approvals"
              count={stats.pendingApprovals}
              bgColor={styles.warmAccent}
            />
            <StatCard
              icon={<UserCircle size={24} color="white" />}
              title="Registered Users"
              count={stats.registeredUsers}
              bgColor={styles.warmPrimaryDark}
            />
          </div>

          {(fetchError || actionError) && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center"
              style={{ borderColor: styles.warmBorder }}
            >
              <CircleCheck className="h-5 w-5 mr-2" />
              <span>{fetchError || actionError}</span>
            </div>
          )}

          {/* Content Section Title */}
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-semibold"
              style={{ color: styles.warmText }}
            >
              {activeSection === "pendingItems" && "Pending Approvals"}
              {activeSection === "allItems" && "All Products"}
              {activeSection === "users" && "User Management"}
              {activeSection === "settings" && "Settings"}
            </h2>
          </div>

          {/* Content Area */}
          <div
            className="rounded-lg shadow-md p-6"
            style={{
              backgroundColor: "white",
              borderColor: styles.warmBorder,
            }}
          >
            {/* Search and filter bars */}
            {activeSection === "users" && (
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Search users by email"
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeSection === "allItems" && (
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search products by name or description"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                  />
                  <select
                    className="p-2 border border-gray-300 rounded-md bg-white"
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="unlisted">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            )}

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
                  {filteredProducts.map((product) => (
                    <AllProductItem
                      key={product.id}
                      product={product}
                      onRemove={handleRemoveProduct}
                      isProcessing={processingItems}
                    />
                  ))}

                  {filteredProducts.length === 0 && (
                    <p className="text-gray-500">
                      No products match your filters
                    </p>
                  )}
                </>
              )}

              {activeSection === "users" && (
                <>
                  {filteredUsers.map((user) => (
                    <UserItem
                      key={user.id}
                      user={user}
                      onToggleBan={handleToggleUserBan}
                      onToggleVerify={handleToggleUserVerify}
                      isProcessing={processingItems}
                    />
                  ))}

                  {filteredUsers.length === 0 && (
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
