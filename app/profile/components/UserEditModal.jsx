"use client";

import { styles } from "@/lib/styles";
import { X, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserEditModal({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSave,
  saveSuccess,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle save and close
  const handleSaveAndClose = () => {
    handleSave();
    // Modal will be closed by parent component after save success
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg  bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Edit Profile</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {saveSuccess && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-offset-0 focus:ring-opacity-50"
                style={{ focusRing: styles.primary }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                University ID
              </label>
              <input
                type="text"
                name="university_id"
                value={formData.university_id}
                onChange={handleInputChange}
                placeholder="University ID"
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study
              </label>
              <input
                type="text"
                name="year"
                value={formData.year || ""}
                onChange={handleInputChange}
                placeholder="Year of Study"
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  placeholder="Update password (leave empty to keep current)"
                  className="w-full border p-2 rounded pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* Additional fields could be added here */}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-white rounded-lg hover:brightness-110"
              style={{ backgroundColor: styles.primary }}
              onClick={handleSaveAndClose}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
