"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Define types for better type safety
interface Product {
  id: string;
  title: string;
  price: number;
  description:string;
  approved: boolean;
}

// Loading component for better reusability
const LoadingSpinner = () => (
  <div className="h-screen">
    <Header activeTextColor={styles.warmPrimary} />
    <div className="flex justify-center items-center h-full ml-64">
      <Loader2
        className="h-8 w-8 animate-spin"
        style={{ color: styles.warmPrimary }}
      />
    </div>
  </div>
);

// Product item component
const ProductItem = ({
  product,
  onApprove,
  onReject,
  isProcessing,
}: {
  product: Product;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isProcessing: Record<string, boolean>;
}) => (
  <div
    key={product.id}
    className="border p-4 rounded-lg flex justify-between items-center"
  >
    <div>
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="text-gray-600">₹{product.price}</p>
    </div>
    <div className="space-x-2">
      <button
        onClick={() => onApprove(product.id)}
        disabled={isProcessing[product.id]}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
      >
        {isProcessing[product.id] ? "Processing..." : "Approve"}
      </button>
      <button
        onClick={() => onReject(product.id)}
        disabled={isProcessing[product.id]}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300"
      >
        {isProcessing[product.id] ? "Processing..." : "Reject"}
      </button>
    </div>
  </div>
);

export default function AdminPage() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<
    Record<string, boolean>
  >({});

  // Check authentication and admin role
  useEffect(() => {
    console.log("Auth Status:", { isAuthenticated, role, isLoading });
    const adminrole=sessionStorage.getItem("userRole")
    if ( adminrole!== "admin") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, role, isLoading, router]);

  // Fetch unapproved products
  const fetchUnsoldProducts = useCallback(async () => {
    try {
      setFetchError(null);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("availability", "false");

      if (error) {
        setFetchError(error.message);
        return;
      }

      setProducts(data || []);
    } catch (err) {
      setFetchError("Failed to fetch products");
      console.error("Error fetching products:", err);
    }
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchUnsoldProducts();
    }
  }, [loading, isAuthenticated, fetchUnsoldProducts]);

  const handleApprove = async (productId: string) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [productId]: true }));

      const { error } = await supabase
        .from("items")
        .update({ availability: true })
        .eq("id", productId);

      if (error) {
        setActionError(`Failed to approve: ${error.message}`);
        return;
      }

      await fetchUnsoldProducts();
    } catch (err) {
      setActionError("An unexpected error occurred while approving");
      console.error("Error approving product:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleReject = async (productId: string) => {
    try {
      setActionError(null);
      setProcessingItems((prev) => ({ ...prev, [productId]: true }));

      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", productId);

      if (error) {
        setActionError(`Failed to reject: ${error.message}`);
        return;
      }

      await fetchUnsoldProducts();
    } catch (err) {
      setActionError("An unexpected error occurred while rejecting");
      console.error("Error rejecting product:", err);
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen">
      <Header activeTextColor={styles.warmPrimary} />
      <div className="max-w-4xl mx-auto p-4 ml-64">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1
            className="text-2xl font-semibold mb-6"
            style={{ color: styles.warmPrimaryDark }}
          >
            Admin Dashboard
          </h1>

          {(fetchError || actionError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{fetchError || actionError}</span>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>

            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onApprove={handleApprove}
                onReject={handleReject}
                isProcessing={processingItems}
              />
            ))}

            {products.length === 0 && (
              <p className="text-gray-500">No products pending approval</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useAuth } from "@/lib/hooks/useAuth";
// import { styles } from "@/lib/styles";
// import Header from "@/components/Sidebar";
// import { supabase } from "@/lib/supabase";
// import { Loader2, AlertCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { LogOut } from "lucide-react";

// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   approved: boolean;
//   image?: string;
// }

// export default function AdminPage() {
//   const { isAuthenticated, role, isLoading } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [processingItems, setProcessingItems] = useState<
//     Record<string, boolean>
//   >({});

//   useEffect(() => {
//     console.log("Auth Status:", { isAuthenticated, role, isLoading });
//     const adminrole = sessionStorage.getItem("userRole");
//     if (adminrole !== "admin") {
//       router.push("/");
//     } else {
//       setLoading(false);
//     }
//   }, [isAuthenticated, role, isLoading, router]);

//   const fetchUnsoldProducts = useCallback(async () => {
//     try {
//       setFetchError(null);

//       const { data, error } = await supabase
//         .from("items")
//         .select("*")
//         .eq("availability", "false");

//       if (error) {
//         setFetchError(error.message);
//         return;
//       }

//       setProducts(data || []);
//     } catch (err) {
//       setFetchError("Failed to fetch products");
//       console.error("Error fetching products:", err);
//     }
//   }, []);

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       fetchUnsoldProducts();
//     }
//   }, [loading, isAuthenticated, fetchUnsoldProducts]);

//   const handleApprove = async (productId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [productId]: true }));

//       const { error } = await supabase
//         .from("items")
//         .update({ availability: true })
//         .eq("id", productId);

//       if (error) {
//         setFetchError(`Failed to approve: ${error.message}`);
//         return;
//       }

//       await fetchUnsoldProducts();
//     } catch (err) {
//       console.error("Error approving product:", err);
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   const handleReject = async (productId: string) => {
//     try {
//       setProcessingItems((prev) => ({ ...prev, [productId]: true }));

//       const { error } = await supabase
//         .from("items")
//         .delete()
//         .eq("id", productId);

//       if (error) {
//         setFetchError(`Failed to reject: ${error.message}`);
//         return;
//       }

//       await fetchUnsoldProducts();
//     } catch (err) {
//       console.error("Error rejecting product:", err);
//     } finally {
//       setProcessingItems((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       // Clear local storage items to match the login page approach
//       localStorage.removeItem("auth");
//       localStorage.removeItem("user_id");
//       localStorage.removeItem("name");
//       localStorage.removeItem("role");
//       sessionStorage.removeItem("userRole");
//       sessionStorage.removeItem("userName");
//       sessionStorage.removeItem("userId");
//       // Redirect to login page
//       router.push("/auth/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   if (loading || isLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50">
//       <div 
//         // className="flex items-center justify-between mb-6"
//         className="h-32 w-full left-0 top-0 z-10 shadow-md flex py-6 px-4  items-center justify-between mb-6"
//               style={{
//                 backgroundColor: styles.warmBg,
//                 borderRight: `1px solid ${styles.warmBorder}`,
//               }}
//         >
//           <h1 className="text-3xl font-semibold text-yellow-800 my-6" >
//             Admin Dashboard - Pending Approvals
//           </h1>
//           <button
//             onClick={handleLogout}
//             className="flex items-center py-2.5 px-3 text-lg rounded-lg transition-all duration-200 hover:bg-opacity-10"
//             style={{
//               color: styles.warmPrimaryDark,
//               backgroundColor: "transparent",
//             }}
//             onMouseOver={(e) => {
//               e.currentTarget.style.backgroundColor = "rgba(184, 110, 84, 0.1)";
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.backgroundColor = "transparent";
//             }}
//           >
//             <span className="mr-3">
//               <LogOut size={27} />
//             </span>
//             Logout
//           </button>
//         </div>
//       {/* <Header activeTextColor={styles.warmPrimary} /> */}
//       <div className="p-6 w-full max-w-7xl mx-auto ">
        

//         {fetchError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
//             <AlertCircle className="h-5 w-5 mr-2" />
//             <span>{fetchError}</span>
//           </div>
//         )}

//         <div className="grid grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div
//               key={product.id}
//               className="border-amber-900 shadow-lg rounded-lg overflow-hidden p-4"
//             >
//               {/* Product Image */}
//               <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
//                 {product.image ? (
//                   <Image
//                     src={product.image}
//                     alt={product.title}
//                     width={200}
//                     height={200}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <span className="text-gray-500">No Image</span>
//                 )}
//               </div>

//               {/* Product Details */}
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {product.title}
//                 </h3>
//                 <p className="text-gray-500 text-sm">{product.description}</p>
//                 <p className="text-lg font-semibold text-gray-900 mt-2">
//                   ₹{product.price}
//                 </p>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-between p-4">
//                 <button
//                   onClick={() => handleApprove(product.id)}
//                   disabled={processingItems[product.id]}
//                   className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 w-1/2 mr-2"
//                 >
//                   {processingItems[product.id] ? "Processing..." : "Approve"}
//                 </button>
//                 <button
//                   onClick={() => handleReject(product.id)}
//                   disabled={processingItems[product.id]}
//                   className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 w-1/2"
//                 >
//                   {processingItems[product.id] ? "Processing..." : "Reject"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {products.length === 0 && (
//           <p className="text-gray-500 text-center mt-6">
//             No products pending approval
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
