import { User } from "@/types";
import React from "react";

interface ItemEditModalProps{
  editingUser: User;
  setEditingUser: (user: User | null) => void;
  updateUser: (user: User) => void;
}

export default function UserEditModal({
  editingUser,
  setEditingUser,
  updateUser,
}: ItemEditModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-300">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateUser(editingUser);
            setEditingUser(null);
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-800 mb-1">Name</label>
            <input
              type="text"
              value={editingUser.full_name || ""}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  full_name: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-1">Email</label>
            <input
              type="email"
              value={editingUser.email || ""}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-1">Department</label>
            <input
              type="text"
              value={editingUser.department || ""}
              onChange={(e) =>
                setEditingUser({
                  ...editingUser,
                  department: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 mb-1">Role</label>
            <select
              value={editingUser.role || "user"}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
