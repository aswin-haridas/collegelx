"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/shared/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/hooks/useAuth";
import { useProfile } from "./useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import ProfileSettings from "./ProfileSettings";
import ItemEditModal from "./components/ItemEditModal";
import UserEditModal from "./components/UserEditModal";
import { Item, User, Review } from "@/shared/lib/types";

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
  const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingItemId, setEditingItemId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Item[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { userId, redirectIfUnauthenticated } = useAuth();
  const {
    fetchUserProfile,
    fetchUserItems,
    fetchUserReviews,
    fetchUserWishlist,
    updateUserProfile,
  } = useProfile(userId);

  // Redirect to login page if not authenticated
  redirectIfUnauthenticated("/auth/login");

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

      try {
        // Fetch user items
        const userItems = await fetchUserItems();
        if (userItems) {
          setItems(userItems);
        }

        // Fetch user wishlist
        const wishlist = await fetchUserWishlist();
        if (wishlist) {
          setWishlistItems(wishlist);
        }

        // Fetch user reviews
        const userReviews = await fetchUserReviews();
        if (userReviews) {
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, fetchUserItems, fetchUserWishlist, fetchUserReviews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
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
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("item_id", itemId);

    if (!error) {
      const updatedWishlist = await fetchUserWishlist();
      setWishlistItems(updatedWishlist || []);
    }
  };

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
