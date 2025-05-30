"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";

export default function ProfilePage() {
  // State for tabs and modals
  const [activeTab, setActiveTab] = useState("products");
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingItemId, setEditingItemId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { userId } = useAuth();
  const {
    fetchUserProfile,
    fetchUserItems,
    fetchUserReviews,
    fetchUserWishlist,
    updateUserProfile,
  } = useProfile(userId);

  // Effects
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;
      const userData = await fetchUserProfile();
      setUser(userData);

      // Set initial form data
      if (userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          department: userData.department || "",
          university_id: userData.university_id || "",
          year: userData.year || "",
        });
      }
    };

    loadUserProfile();
  }, [userId, fetchUserProfile]);

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return;
      setIsLoading(true);
      console.log("Loading data for user:", userId);

      try {
        // Fetch user items
        console.log("Fetching user items...");
        const userItems = await fetchUserItems();
        console.log("Items fetched:", userItems?.length || 0);
        setItems(userItems || []);

        // Fetch user wishlist
        const wishlist = await fetchUserWishlist();
        setWishlistItems(wishlist || []);

        // Fetch user reviews
        const userReviews = await fetchUserReviews();
        setReviews(userReviews || []);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, fetchUserItems, fetchUserWishlist, fetchUserReviews]);

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
      setUser(result);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsUserEditModalOpen(false);
      }, 2000);
    }
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordError("");
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setIsEditModalOpen(true);
  };

  const handleEditProfile = () => {
    setIsUserEditModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    const { error } = await supabase.from("products").delete().eq("id", itemId);

    if (!error) {
      const updatedItems = await fetchUserItems();
      setItems(updatedItems || []);
    }
  };

  const handleMarkAsSold = async (itemId: string) => {
    const { error } = await supabase
      .from("products")
      .update({ status: "sold" })
      .eq("id", itemId);

    if (!error) {
      const updatedItems = await fetchUserItems();
      setItems(updatedItems || []);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", itemId)
        .eq("user_id", userId);

      if (!error) {
        const updatedWishlist = await fetchUserWishlist();
        setWishlistItems(updatedWishlist || []);
      } else {
        console.error("Error removing from wishlist:", error);
      }
    } catch (err) {
      console.error("Exception removing from wishlist:", err);
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
      setModalname(data.name);
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
          name: modalname,
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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <>
          <ProfileHeader
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab !== "settings" && (
            <ProfileContent
              activeTab={activeTab}
              items={items}
              wishlistItems={wishlistItems}
              reviews={reviews}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
              handleMarkAsSold={handleMarkAsSold}
              handleRemoveFromWishlist={handleRemoveFromWishlist}
            />
          )}
          {activeTab === "settings" && (
            <ProfileSettings
              user={user}
              isEditing={isEditing}
              setIsEditing={handleEditProfile}
              isChangingPassword={isChangingPassword}
              setIsChangingPassword={setIsChangingPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              formData={formData}
              passwordData={passwordData}
              passwordError={passwordError}
              handleInputChange={handleInputChange}
              handlePasswordChange={handlePasswordChange}
              handleSave={handleSave}
              handleChangePassword={handleChangePassword}
              resetPasswordData={() => {
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setPasswordError("");
              }}
            />
          )}

          <ItemEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            itemId={editingItemId}
            onItemUpdated={async () => {
              const updatedItems = await fetchUserItems();
              if (updatedItems) {
                setItems(updatedItems);
              }
            }}
          />

          <UserEditModal
            isOpen={isUserEditModalOpen}
            onClose={() => setIsUserEditModalOpen(false)}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            saveSuccess={saveSuccess}
          />
        </>
      )}
    </div>
  );
}
