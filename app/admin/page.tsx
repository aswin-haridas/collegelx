"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User, Item } from "@/lib/types";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "users" | "allItems" | "unlistedItems"
  >("users");
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [unlistedItems, setUnlistedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*");

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  // Fetch all items from Supabase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase.from("items").select("*");

        if (error) throw error;
        setItems(data || []);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items");
      }
    };

    fetchItems();
  }, []);

  // Fetch unlisted items from Supabase
  useEffect(() => {
    const fetchUnlistedItems = async () => {
      try {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("status", "unlisted");

        if (error) throw error;
        setUnlistedItems(data || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching unlisted items:", err);
        setError("Failed to load unlisted items");
        setIsLoading(false);
      }
    };

    fetchUnlistedItems();
  }, []);

  // Function to update user
  const updateUser = async (updatedUser: User) => {
    try {
      const { error } = await supabase
        .from("users")
        .update(updatedUser)
        .eq("id", updatedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      showSuccess("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    }
  };

  // Function to update item
  const updateItem = async (updatedItem: Item) => {
    try {
      const { error } = await supabase
        .from("items")
        .update(updatedItem)
        .eq("id", updatedItem.id);

      if (error) throw error;

      // Update local state
      setItems(
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      if (updatedItem.status === "unlisted") {
        setUnlistedItems(
          unlistedItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      } else {
        setUnlistedItems(
          unlistedItems.filter((item) => item.id !== updatedItem.id)
        );
      }
      setEditingItem(null);
      showSuccess("Item updated successfully!");
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item");
    }
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-lg font-bold">Admin</h2>
        </div>
        <nav className="mt-4">
          <a href="#" className="flex items-center p-4 bg-gray-200">
            <span className="mr-2">🏠</span> Dashboard
          </a>
          <a href="#" className="flex items-center p-4 hover:bg-gray-100">
            <span className="mr-2">📦</span> Products
          </a>
          <a href="#" className="flex items-center p-4 hover:bg-gray-100">
            <span className="mr-2">👤</span> Users
          </a>
          <a href="#" className="flex items-center p-4 hover:bg-gray-100">
            <span className="mr-2">⚙️</span> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
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
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Summary Counts */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-2xl font-bold">{users.length}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-2xl font-bold">{items.length}</h3>
            <p className="text-gray-600">Total Products</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-2xl font-bold">{unlistedItems.length}</h3>
            <p className="text-gray-600">Unlisted Products</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${
                activeTab === "users"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "allItems"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("allItems")}
            >
              All Items
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === "unlistedItems"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("unlistedItems")}
            >
              Unlisted Items
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
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
                          <td className="p-2">{user.userid}</td>
                          <td className="p-2">{user.name || "N/A"}</td>
                          <td className="p-2">{user.email || "N/A"}</td>
                          <td className="p-2">{user.university_id || "N/A"}</td>
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
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
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
                                item.status === "avalailable"
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
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
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
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateUser(editingUser);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Department</label>
                <input
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
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Role</label>
                <select
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateItem(editingItem);
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, category: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, status: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="available">available</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
