"use client";
import { styles } from "@/shared/lib/styles";
interface ProfileSettingsProps {
  user: unknown;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  isChangingPassword: boolean;
  setIsChangingPassword: (value: boolean) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  formData: unknown;
  passwordData: unknown;
  passwordError: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleChangePassword: () => void;
  resetPasswordData?: () => void; // Add optional reset function
}

export default function ProfileSettings({
  user,
  setIsEditing,
}: ProfileSettingsProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: styles.TEXT }}
        >
          Account Settings
        </h2>

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
              style={{ backgroundColor: styles.PRIMARY }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
