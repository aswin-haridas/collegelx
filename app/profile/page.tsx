

// // "use client";

// // import { useEffect, useState } from "react";
// // import { useAuth } from "@/lib/hooks/useAuth";
// // import { styles } from "@/lib/styles";
// // import Header from "@/components/Sidebar";
// // import { supabase } from "@/lib/supabase";
// // import { Loader2 } from "lucide-react";
// // import { useRouter } from "next/navigation";

// // interface User {
// //   name: string;
// //   email: string;
// //   phone?: string;
// //   role: string;
// // }

// // export default function ProfilePage() {
// //   const { isAuthenticated, userId, isLoading } = useAuth();
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
// //   const router = useRouter();
// //   const [userName, setUserName] = useState<string | null>(null);
// //   const handleLogout = () => {
// //     sessionStorage.clear();
// //     localStorage.clear();
// //     router.push("/auth/login");
// //   };

// //   useEffect(() => {
// //     async function fetchUserData() {
// //       if (!userId) return;
// //       try {
// //         const { data, error } = await supabase
// //           .from("users")
// //           .select("*")
// //           .eq("id", userId)
// //           .single();
        
// //         if (error) throw error;
// //         setUser(data);
// //         setFormData({ name: data.name, email: data.email, phone: data.phone || "" });
// //       } catch (error) {
// //         console.error("Error fetching user data:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //       const name = localStorage.getItem("name");
// //       setUserName(name || "User");
// //     }

// //     if (!isLoading && isAuthenticated) {
// //       fetchUserData();
// //     }
// //   }, [userId, isAuthenticated, isLoading]);

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   // const handleSave = async () => {
// //   //   if (!userId) return;
// //   //   try {
// //   //     const { error } = await supabase
// //   // .from("users")
// //   // .update({
// //   //   name: formData.name,
// //   //   email: formData.email,
// //   //   phone: formData.phone.trim() === "" ? null : formData.phone, // Convert empty phone to null
// //   // })
// //   // .eq("id", userId);
  
// //   // const name = localStorage.getItem("name");
// //   // setUserName(name);
// //   //     if (error) throw error;
// //   //     setUser({ ...user, ...formData } as User);
// //   //     setIsEditing(false);
// //   //   } catch (error) {
// //   //     console.error("Error updating user data:", error);
// //   //   }
// //   // };
// //   const handleSave = async () => {
// //     if (!userId) return;
// //     try {
// //       const { error } = await supabase
// //         .from("users")
// //         .update({
// //           name: formData.name,
// //           email: formData.email,
// //           phone: formData.phone.trim() === "" ? null : formData.phone, // Convert empty phone to null
// //         })
// //         .eq("id", userId);
  
// //       if (error) throw error;
  
// //       // Update local state
// //       setUser({ ...user, ...formData } as User);
// //       setIsEditing(false);
  
// //       // **Update localStorage with new user name**
// //       localStorage.setItem("name", formData.name);
// //       setUserName(formData.name); // Update the displayed name
  
// //     } catch (error) {
// //       console.error("Error updating user data:", error);
// //     }
// //   };
  
// //   if (loading || isLoading) {
// //     return (
// //       <div className="h-screen">
// //         <Header activeTextColor={styles.warmPrimary} />
// //         <div className="flex justify-center items-center h-full ml-64">
// //           <Loader2 className="h-8 w-8 animate-spin" style={{ color: styles.warmPrimary }} />
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="h-screen">
// //       <Header activeTextColor={styles.warmPrimary} />
// //       <div className="max-w-4xl mx-auto p-4 ml-64">
// //         <div className="bg-white rounded-lg shadow-md p-6">
// //           <h1 className="text-2xl font-semibold mb-6" style={{ color: styles.warmText }}>
// //             Profile {user?.name}
// //           </h1>
// //           {user?.role === "user" ? (
// //             <div className="space-y-4">
// //               {isEditing ? (
// //                 <>
// //                   <input
// //                     type="text"
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleInputChange}
// //                     className="w-full border p-2 rounded"
// //                   />
// //                   <input
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleInputChange}
// //                     className="w-full border p-2 rounded"
// //                   />
// //                   <input
// //                     type="text"
// //                     name="phone"
// //                     value={formData.phone}
// //                     onChange={handleInputChange}
// //                     className="w-full border p-2 rounded"
// //                   />
// //                   <button
// //                     className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
// //                     onClick={handleSave}
// //                   >
// //                     Save
// //                   </button>
// //                 </>
// //               ) : (
// //                 <>
// //                   <p><strong>Name:</strong> {user.name}</p>
// //                   <p><strong>Email:</strong> {user.email}</p>
// //                   {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
// //                   <button
// //                     className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
// //                     onClick={() => setIsEditing(true)}
// //                   >
// //                     Edit Profile
// //                   </button>
// //                 </>
// //               )}
// //             </div>
// //           ) : (
// //             <p>No user data available</p>
// //           )}
// //           <button
// //             className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
// //             onClick={handleLogout}
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/lib/hooks/useAuth";
// import { styles } from "@/lib/styles";
// import Header from "@/components/Sidebar";
// import { supabase } from "@/lib/supabase";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// interface User {
//   name: string;
//   email: string;
//   phone?: string;
//   role: string;
// }

// interface Item {
//   id: string;
//   name: string;
//   description: string;
//   created_at: string;
// }

// export default function ProfilePage() {
//   const { isAuthenticated, userId, isLoading } = useAuth();
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [items, setItems] = useState<Item[]>([]);
//   const router = useRouter();

//   // Handle logout
//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     router.push("/auth/login");
//   };

//   // Fetch user details
//   useEffect(() => {
//     async function fetchUserData() {
//       if (!userId) return;
//       try {
//         const { data, error } = await supabase
//           .from("users")
//           .select("*")
//           .eq("id", userId)
//           .single();
        
//         if (error) throw error;
//         setUser(data);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (!isLoading && isAuthenticated) {
//       fetchUserData();
//     }
//   }, [userId, isAuthenticated, isLoading]);

//   // Fetch items added by the user
//   useEffect(() => {
//     async function fetchUserItems() {
//       if (!userId) return;
//       try {
//         const { data, error } = await supabase
//           .from("items") // Change "items" to your actual table name
//           .select("*")
//           .eq("user_id", userId);

//         if (error) throw error;
//         setItems(data);
//       } catch (error) {
//         console.error("Error fetching user items:", error);
//       }
//     }

//     if (userId) {
//       fetchUserItems();
//     }
//   }, [userId]);

//   if (loading || isLoading) {
//     return (
//       <div className="h-screen">
//         <Header activeTextColor={styles.warmPrimary} />
//         <div className="flex justify-center items-center h-full ml-64">
//           <Loader2 className="h-8 w-8 animate-spin" style={{ color: styles.warmPrimary }} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen">
//       <Header activeTextColor={styles.warmPrimary} />
//       <div className="max-w-4xl mx-auto p-4 ml-64">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h1 className="text-2xl font-semibold mb-6" style={{ color: styles.warmText }}>
//             Profile {user?.name}
//           </h1>
          
//           {user ? (
//             <>
//               <p><strong>Name:</strong> {user.name}</p>
//               <p><strong>Email:</strong> {user.email}</p>
//               {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}

//               <h2 className="text-xl font-semibold mt-6">Your Items</h2>
//               {items.length > 0 ? (
//                 <ul className="mt-4 space-y-2">
//                   {items.map((item) => (
//                     <li key={item.id} className="p-3 border rounded shadow-md">
//                       <p><strong>Name:</strong> {item.name}</p>
//                       <p><strong>Description:</strong> {item.description}</p>
//                       <p className="text-sm text-gray-500">Created at: {new Date(item.created_at).toLocaleString()}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="mt-4 text-gray-500">No items added yet.</p>
//               )}

//               <button
//                 className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <p>No user data available</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { Loader2, University } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  university_id?: string;
  role: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  created_at: string;
}

export default function ProfilePage() {
  const { isAuthenticated, userId, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    university_id: "",
  });
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return;
      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).single();
        if (error) throw error;
        setUser(data);
        setFormData({ name: data.name, email: data.email, department: data.department , university_id: data.university_id});
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading && isAuthenticated) {
      fetchUserData();
    }
  }, [userId, isAuthenticated, isLoading]);

  useEffect(() => {
    async function fetchUserItems() {
      if (!userId) return;
      try {
        const { data, error } = await supabase.from("items").select("*").eq("user_id", userId);
        if (error) throw error;
        setItems(data);
      } catch (error) {
        console.error("Error fetching user items:", error);
      }
    }

    if (userId) {
      fetchUserItems();
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      const { error } = await supabase.from("users").update(formData).eq("id", userId);
      if (error) throw error;
      setUser({ ...user, ...formData } as User);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
    const name = localStorage.getItem("name");
    setUserName(name || "User");
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    router.push("/auth/login");
  };

  if (loading || isLoading) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: styles.warmPrimary }} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Header activeTextColor={styles.warmPrimary} />
      <div className="max-w-4xl mx-auto p-4 ml-64">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6" style={{ color: styles.warmText }}>
            Profile {user?.name}
          </h1>
          {isEditing ? (
  <>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      className="w-full border p-2 my-2 rounded"
    />
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      className="w-full border p-2 my-2 rounded"
    />
    <input
      type="text"
      name="department"
      value={formData.department}
      onChange={handleInputChange}
      className="w-full border p-2 my-2 rounded"
    />
    <input
      type="text"
      name="university_id"
      value={formData.university_id}
      onChange={handleInputChange}
      className="w-full border p-2 my-2 rounded"
    />
    <button
      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      onClick={handleSave}
    >
      Save
    </button>
  </>
) : (
  <>
    <p className="my-2"><strong>Name:</strong> {user?.name}</p>
    <p className="my-2"><strong>Email:</strong> {user?.email}</p>
    <p className="my-2"><strong>Department:</strong> {user?.department}</p> 
    <p className="my-2"><strong>University Id:</strong> {user?.university_id}</p> 
    {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
    <button
      className="mt-4 px-4 py-2 bg-yellow-800 text-white rounded-lg hover:bg-yellow-700"
      onClick={() => setIsEditing(true)}
    >
      Edit Profile
    </button>
  </>
)}


          <h2 className="text-xl font-semibold mt-6">Your Items</h2>
          {items.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li key={item.id} className="p-3 border flex justify-between items-center rounded shadow-md">
                <div className="flex-1">
                  {/* <p><strong>Name:</strong> {item.name}</p> */}
                  <p><strong> {item.description}</strong></p>
                  <p className="text-sm text-gray-500">Created at: {new Date(item.created_at).toLocaleString()}</p>
                </div>
                {item.image && (
                  <div className="w-32 h-32 ml-4">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                  </div>
                )}
              </li>
              
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No items added yet.</p>
          )}

          
        </div>
      </div>
    </div>
  );
}