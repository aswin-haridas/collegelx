import React, { useState } from "react";
import { User } from "@/shared/lib/types";
import { Button } from "@/shared/components/Atoms/Button";

interface EditUserModalProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onSave,
  onCancel,
}) => {
  const [editingUser, setEditingUser] = useState<User>(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editingUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-gray-700 mb-1">
              Name
            </label>
            <input
              id="userName"
              type="text"
              value={editingUser.name || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userEmail" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="userEmail"
              type="email"
              value={editingUser.email || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="userDepartment"
              className="block text-gray-700 mb-1"
            >
              Department
            </label>
            <input
              id="userDepartment"
              type="text"
              value={editingUser.department || ""}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  department: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label htmlFor="userRole" className="block text-gray-700 mb-1">
              Role
            </label>
            <select
              id="userRole"
              value={editingUser.role || "user"}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
