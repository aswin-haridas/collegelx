"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { styles } from "@/lib/styles";
import {
  Package,
  MessageSquare,
  Settings,
  Heart,
  Star,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import toast from "react-hot-toast";

export default function ProfilePage() {
  // State for tabs and modals
  const [activeTab, setActiveTab] = useState("products");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form data states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    university_id: "",
    year: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Item edit modal states
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalPrice, setModalPrice] = useState("");
  const [modalCategory, setModalCategory] = useState("");
  const [modalYear, setModalYear] = useState("");
  const [modalDepartment, setModalDepartment] = useState("");
  const [modalIsLoading, setModalIsLoading] = useState(false);

  // Hooks
  const router = useRouter();
  const { userId } = useAuth();
  const {
    user,
    items,
    reviews,
    wishlistItems,
    fetchUserData,
    fetchUserItems,
    fetchUserReviews,
    fetchUserWishlist,
    updateUserProfile,
  } = useProfile(userId);

  // Effects
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department || "",
        university_id: user.university_id || "",
        year: user.year || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (!userId) return;
    if (activeTab === "products") fetchUserItems();
    else if (activeTab === "reviews") fetchUserReviews();
    else if (activeTab === "wishlist") fetchUserWishlist();
  }, [userId, activeTab, fetchUserItems, fetchUserReviews, fetchUserWishlist]);

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId, fetchUserData]);

  useEffect(() => {
    if (isEditModalOpen && editingItemId) {
      fetchItemDetails();
    }
  }, [isEditModalOpen, editingItemId]);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveWithFeedback = async () => {
    const result = await updateUserProfile(formData);
    if (result) {
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    // Add actual password change logic here (e.g., Supabase auth update)
    toast.success("Password updated successfully!");
    setIsChangingPassword(false);
    resetPasswordData();
  };

  const resetPasswordData = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase
          .from("items")
          .delete()
          .eq("id", itemId);
        if (error) throw error;
        fetchUserItems();
        toast.success("Item deleted successfully!");
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item.");
      }
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    if (confirm("Mark this item as sold? It will no longer be visible to buyers.")) {
      try {
        const { error } = await supabase
          .from("items")
          .update({ status: "sold" })
          .eq("id", itemId);
        if (error) throw error;
        fetchUserItems();
        toast.success("Item marked as sold!");
      } catch (error) {
        console.error("Error marking item as sold:", error);
        toast.error("Failed to mark item as sold.");
      }
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    if (confirm("Remove this item from your wishlist?")) {
      try {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("item_id", itemId);
        if (error) throw error;
        fetchUserWishlist();
        toast.success("Item removed from wishlist!");
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove item from wishlist.");
      }
    }
  };

  const fetchItemDetails = async () => {
    setModalIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", editingItemId)
        .single();
      if (error) throw error;
      setModalTitle(data.title);
      setModalDescription(data.description);
      setModalPrice(data.price.toString());
      setModalCategory(data.category);
      setModalYear(data.year);
      setModalDepartment(data.department);
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast.error("Failed to load item details.");
    } finally {
      setModalIsLoading(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalIsLoading(true);
    try {
      const { error } = await supabase
        .from("items")
        .update({
          title: modalTitle,
          description: modalDescription,
          price: parseFloat(modalPrice),
          category: modalCategory,
          year: modalYear,
          department: modalDepartment,
        })
        .eq("id", editingItemId);
      if (error) throw error;
      toast.success("Item updated successfully!");
      fetchUserItems();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    } finally {
      setModalIsLoading(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex items-center p-6">
            <div className="mr-4">
              <img
                src={
                  user?.profile_image ||
                  "https://i.pinimg.com/736x/2c/47/d5/2c47d5dd5b532f83bb55c4cd6f5bd1ef.jpg"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-800"
              />
            </div>
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{
                  color: styles.warmText,
                  fontFamily: "Playfair Display, serif",
                }}
              >
                {user?.name}
              </h1>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "products"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("products")}
              >
                <Package size={18} className="mr-2" />
                My Products
              </button>
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "wishlist"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("wishlist")}
              >
                <Heart size={18} className="mr-2" />
                Wishlist
              </button>
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "reviews"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                <MessageSquare size={18} className="mr-2" />
                Reviews
              </button>
              <button
                className={`py-3 px-4 font-medium flex items-center ${
                  activeTab === "settings"
                    ? "border-b-2 border-yellow-800 text-yellow-800"
                    : "text-gray-500 hover:text-yellow-800"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={18} className="mr-2" />
                Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: styles.warmText }}>
                Your Items
              </h2>
              <button
                onClick={() => router.push("/sell")}
                className="px-4 py-2 text-white rounded-lg hover:brightness-110"
                style={{ backgroundColor: styles.warmPrimary }}
              >
                Add New Item
              </button>
            </div>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="relative group">
                    <ItemCard item={item} />
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 bg-white rounded-full shadow-md"
                        onClick={() => handleEditItem(item.id)}
                        style={{ color: styles.warmPrimary }}
                        title="Edit item"
                      >
                        <Edit size={16} />
                      </button>
                      {item.status !== "sold" && (
                        <button
                          className="p-2 bg-white rounded-full shadow-md"
                          onClick={() => handleMarkAsSold(item.id)}
                          style={{ color: "#16a34a" }}
                          title="Mark as sold"
                        >
                          <Star size={16} fill="#16a34a" />
                        </button>
                      )}
                      <button
                        className="p-2 bg-white rounded-full shadow-md"
                        onClick={() => handleDeleteItem(item.id)}
                        style={{ color: "#ef4444" }}
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div
                      className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium rounded-full"
                      style={{
                        backgroundColor:
                          item.status === "available"
                            ? "#dcfce7"
                            : item.status === "pending"
                            ? "#fef3c7"
                            : item.status === "sold"
                            ? "#dbeafe"
                            : "#fee2e2",
                        color:
                          item.status === "available"
                            ? "#166534"
                            : item.status === "pending"
                            ? "#92400e"
                            : item.status === "sold"
                            ? "#1e40af"
                            : "#b91c1c",
                      }}
                    >
                      {item.status === "sold"
                        ? "Sold"
                        : item.status === "available"
                        ? "Available"
                        : item.status === "pending"
                        ? "Pending"
                        : "No Status"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No items added yet.</p>
                <button
                  onClick={() => router.push("/sell")}
                  className="mt-4 px-4 py-2 text-white rounded-lg hover:brightness-110"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  Add an Item
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: styles.warmText }}>
                Your Wishlist
              </h2>
            </div>
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="relative group">
                    <ItemCard item={item} />
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 bg-white rounded-full shadow-md"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        style={{ color: "#ef4444" }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No items in your wishlist yet.</p>
                <button
                  onClick={() => router.push("/")}
                  className="mt-4 px-4 py-2 text-white rounded-lg hover:brightness-110"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  Browse Items
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold" style={{ color: styles.warmText }}>
                Your Reviews
              </h2>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{review.reviewer_name}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No reviews yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: styles.warmText }}>
              Account Settings
            </h2>
            {isEditing ? (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-3">Edit Profile</h3>
                {saveSuccess && (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    Profile updated successfully!
                  </div>
                )}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full border p-2 my-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full border p-2 my-2 rounded"
                />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                  className="w-full border p-2 my-2 rounded"
                />
                <input
                  type="text"
                  name="university_id"
                  value={formData.university_id}
                  onChange={handleInputChange}
                  placeholder="University ID"
                  className="w-full border p-2 my-2 rounded"
                />
                <input
                  type="text"
                  name="year"
                  value={formData.year || ""}
                  onChange={handleInputChange}
                  className="w-full border p-2 my-2 rounded"
                  placeholder="Year of Study"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-4 py-2 text-white rounded-lg hover:bg-green-600"
                    onClick={handleSaveWithFeedback}
                    style={{ backgroundColor: styles.warmPrimary }}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-3">Profile Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p className="my-2">
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p className="my-2">
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="my-2">
                    <strong>Department:</strong> {user?.department || "Not specified"}
                  </p>
                  <p className="my-2">
                    <strong>University ID:</strong> {user?.university_id || "Not specified"}
                  </p>
                  <p className="my-2">
                    <strong>Year:</strong> {user?.year || "Not specified"}
                  </p>
                  {user?.phone && (
                    <p className="my-2">
                      <strong>Phone:</strong> {user.phone}
                    </p>
                  )}
                  <p className="my-2">
                    <strong>Role:</strong> {user?.role || "Student"}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 text-white rounded-lg hover:brightness-110"
                    style={{ backgroundColor: styles.warmPrimary }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
            {isChangingPassword ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Change Password</h3>
                {passwordError && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {passwordError}
                  </div>
                )}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Current Password"
                    className="w-full border p-2 my-2 rounded pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="w-full border p-2 my-2 rounded pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm New Password"
                    className="w-full border p-2 my-2 rounded pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-4 py-2 text-white rounded-lg hover:bg-green-600"
                    onClick={handleChangePassword}
                    style={{ backgroundColor: styles.warmPrimary }}
                  >
                    Update Password
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPasswordData();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Password</h3>
                <p className="text-gray-600 mb-4">
                  Set a strong password to protect your account
                </p>
                <button
                  className="px-4 py-2 text-white rounded-lg hover:brightness-110"
                  style={{ backgroundColor: styles.warmPrimary }}
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Item Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
              {modalIsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleUpdateItem} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Title</label>
                    <input
                      type="text"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      required
                      className="mt-1 w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      value={modalDescription}
                      onChange={(e) => setModalDescription(e.target.value)}
                      required
                      rows={4}
                      className="mt-1 w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Price (₹)</label>
                    <input
                      type="number"
                      value={modalPrice}
                      onChange={(e) => setModalPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      required
                      className="mt-1 w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Category</option>
                      <option value="Notes">Notes</option>
                      <option value="Uniform">Uniform</option>
                      <option value="Stationary">Stationary</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Year</label>
                    <select
                      value={modalYear}
                      onChange={(e) => setModalYear(e.target.value)}
                      required
                      className="mt-1 w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Department
                    </label>
                    <select
                      value={modalDepartment}
                      onChange={(e) => setModalDepartment(e.target.value)}
                      required
                      className="mt-1 w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="AI">AI</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="EC">EC</option>
                      <option value="EEE">EEE</option>
                      <option value="Civil">Civil</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="py-2 px-4 rounded-lg border border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-lg text-white"
                      style={{ backgroundColor: "#4CAF50" }}
                      disabled={modalIsLoading}
                    >
                      {modalIsLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}