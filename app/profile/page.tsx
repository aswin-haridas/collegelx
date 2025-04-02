"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import ProfileSettings from "./ProfileSettings";
import ItemEditModal from "./ItemEditModal";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("products");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const [editingItemId, setEditingItemId] = useState("");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const result = await updateUserProfile(formData);
    if (result) setIsEditing(false);
  };

  const handleChangePassword = async () => {
    // ... same implementation
  };

  const handleEditItem = (itemId: string) => {
    setEditingItemId(itemId);
    setIsEditModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    // ... same implementation
  };

  const handleMarkAsSold = async (itemId: string) => {
    // ... same implementation
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    // ... same implementation
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          setIsEditing={setIsEditing}
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
        />
      )}

      <ItemEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        itemId={editingItemId}
        onItemUpdated={fetchUserItems}
      />
    </div>
  );
}
