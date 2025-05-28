"use client";
import { styles } from "@/lib/styles";

export default function ProfileSettings({}) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

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
              style={{ backgroundColor: styles.primary }}
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
