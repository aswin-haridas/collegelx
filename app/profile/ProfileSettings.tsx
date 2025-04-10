"use client";

import { styles } from "@/shared/lib/styles";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ProfileSettingsProps {
  user: any;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isChangingPassword: boolean;
  setIsChangingPassword: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  formData: any;
  passwordData: any;
  passwordError: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleChangePassword: () => void;
  resetPasswordData?: () => void; // Add optional reset function
}

export default function ProfileSettings({
  user,
  isEditing,
  setIsEditing,
  isChangingPassword,
  setIsChangingPassword,
  showPassword,
  setShowPassword,
  formData,
  passwordData,
  passwordError,
  handleInputChange,
  handlePasswordChange,
  handleSave,
  handleChangePassword,
  resetPasswordData,
}: ProfileSettingsProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Wrapper for handleSave to show success message
  const handleSaveWithFeedback = () => {
    handleSave();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: styles.warmText }}
        >
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
                <strong>Department:</strong>{" "}
                {user?.department || "Not specified"}
              </p>
              <p className="my-2">
                <strong>University ID:</strong>{" "}
                {user?.university_id || "Not specified"}
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
                  if (resetPasswordData) {
                    resetPasswordData(); // Reset password form if function is provided
                  } else {
                    // Fallback reset if no function provided
                    handlePasswordChange({
                      target: { name: "currentPassword", value: "" },
                    } as React.ChangeEvent<HTMLInputElement>);
                    handlePasswordChange({
                      target: { name: "newPassword", value: "" },
                    } as React.ChangeEvent<HTMLInputElement>);
                    handlePasswordChange({
                      target: { name: "confirmPassword", value: "" },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
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
    </div>
  );
}
