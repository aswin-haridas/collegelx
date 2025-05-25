"use client";
import React, { useState } from "react";
import { User, Item } from "@/app/lib/types";
import Header from "../components/shared/Header";
import { useAdmin } from "./useAdmin";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "users" | "allItems" | "unlistedItems"
  >("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const {
    users,
    items,
    unlistedItems,
    isLoading,
    error,
    showSuccessMessage,
    successMessage,
    setShowSuccessMessage,
    updateUser,
    updateItem,
  } = useAdmin();

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter unlisted items based on search query
  const filteredUnlistedItems = unlistedItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-50">
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="fixed top-4 right-4 bg-gray-100 border border-black text-gray-800 px-4 py-3 rounded z-50 shadow-md">
              <span>{successMessage}</span>
              <button
                className="ml-4 font-bold"
                onClick={() => setShowSuccessMessage(false)}
              >
                ×
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
            />
          </div>

          {/* Summary Counts */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold">{users.length}</h3>
              <p className="text-gray-700">Total Users</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold">{items.length}</h3>
              <p className="text-gray-700">Total Products</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-2xl font-bold">{unlistedItems.length}</h3>
              <p className="text-gray-700">Unlisted Products</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 ${
                  activeTab === "users"
                    ? "border-b-2 border-black text-black font-medium"
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActiveTab("users")}
              >
                Users
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "allItems"
                    ? "border-b-2 border-black text-black font-medium"
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActiveTab("allItems")}
              >
                All Items
              </button>
              <button
                className={`py-2 px-4 ${
                  activeTab === "unlistedItems"
                    ? "border-b-2 border-black text-black font-medium"
                    : "text-gray-600 hover:text-black"
                }`}
                onClick={() => setActiveTab("unlistedItems")}
              >
                Unlisted Items
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {isLoading ? (
              <div className="p-4 text-center">Loading data...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
              <>
                {/* Users Tab */}
                {activeTab === "users" && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Email</th>
                          <th className="p-2 text-left">University</th>
                          <th className="p-2 text-left">Department</th>
                          <th className="p-2 text-left">Role</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t">
                            <td className="p-2">{user.id}</td>
                            <td className="p-2">{user.name || "N/A"}</td>
                            <td className="p-2">{user.email || "N/A"}</td>
                            <td className="p-2">
                              {user.university_id || "N/A"}
                            </td>
                            <td className="p-2">{user.department || "N/A"}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {user.role || "User"}
                              </span>
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="bg-black hover:bg-gray-800 text-white py-1 px-2 rounded text-sm"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* All Items Tab */}
                {activeTab === "allItems" && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Title</th>
                          <th className="p-2 text-left">Category</th>
                          <th className="p-2 text-left">Price</th>
                          <th className="p-2 text-left">Status</th>
                          <th className="p-2 text-left">Seller</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-2">{item.id}</td>
                            <td className="p-2">{item.title}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">${item.price}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded ${
                                  item.status === "available"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="p-2">{item.seller_id}</td>
                            <td className="p-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="bg-black hover:bg-gray-800 text-white py-1 px-2 rounded text-sm"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Unlisted Items Tab */}
                {activeTab === "unlistedItems" && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Title</th>
                          <th className="p-2 text-left">Category</th>
                          <th className="p-2 text-left">Price</th>
                          <th className="p-2 text-left">Seller</th>
                          <th className="p-2 text-left">Created At</th>
                          <th className="p-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUnlistedItems.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-2">{item.id}</td>
                            <td className="p-2">{item.title}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">${item.price}</td>
                            <td className="p-2">{item.seller_id}</td>
                            <td className="p-2">
                              {new Date(item.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="bg-black hover:bg-gray-800 text-white py-1 px-2 rounded text-sm"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
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
                    value={editingUser.name || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
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
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl border border-gray-300">
              <h2 className="text-xl font-bold mb-4">Edit Item</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateItem(editingItem);
                  setEditingItem(null);
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-800 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 mb-1">Price</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-800 mb-1">Status</label>
                  <select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:border-black focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
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
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
