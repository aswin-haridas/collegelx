// "use client";

// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/hooks/useAuth";
// import { useItem } from "@/lib/hooks/useItem";
// import { styles } from "@/lib/styles";
// import Header from "@/components/Sidebar";
// import { Loader2 } from "lucide-react";
// import { useParams } from "next/navigation";

// export default function ItemPage() {
//   const { isAuthenticated, isLoading: authLoading } = useAuth(false);
//   const router = useRouter();
//   const params = useParams();
//   const itemId = params?.id as string;

//   const {
//     item,
//     loading: itemLoading,
//     error: itemError,
//   } = useItem(itemId, true);

//   const loading = authLoading || itemLoading;

//   const handleChat = () => {
//     if (!isAuthenticated) {
//       router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
//       return;
//     }

//     if (item) {
//       router.push(`/chat?listing=${item.id}&seller=${item.user_id}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen">
//         <Header activeTextColor={styles.warmPrimary} />
//         <div className="flex justify-center items-center h-full ml-64">
//           <Loader2 className="h-8 w-8 animate-spin" style={{ color: styles.warmPrimary }} />
//         </div>
//       </div>
//     );
//   }

//   if (itemError || !item) {
//     return (
//       <div className="h-screen">
//         <Header activeTextColor={styles.warmPrimary} />
//         <div className="flex justify-center items-center h-full ml-64">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold mb-2" style={{ color: styles.warmText }}>
//               Item not found
//             </h2>
//             <h1>{itemId}</h1>
//             <button
//               onClick={() => router.push("/")}
//               className="mt-4 px-4 py-2 rounded-lg text-white"
//               style={{ backgroundColor: styles.warmPrimary }}
//             >
//               Back to Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen">
//       <Header activeTextColor={styles.warmPrimary} />
//       <div className="max-w-4xl mx-auto p-4 ml-64">
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
//           <p className="text-gray-600 mt-2">{item.description}</p>

//           <div className="mt-4">
//             <span className="text-lg font-semibold text-gray-700">Price:</span>
//             <span className="text-lg text-gray-800"> ${item.price}</span>
//           </div>

//           <div className="mt-2">
//             <span className="text-lg font-semibold text-gray-700">Product Type:</span>
//             <span className="text-lg text-gray-800"> {item.product_type}</span>
//           </div>

//           <div className="mt-2">
//             <span className="text-lg font-semibold text-gray-700">Created At:</span>
//             <span className="text-lg text-gray-800"> {new Date(item.created_at).toLocaleString()}</span>
//           </div>

//           {item.image_url && (
//             <div className="mt-4">
//               <img src={item.image_url[0]} alt={item.title} className="rounded-lg w-full max-h-80 object-cover" />
//             </div>
//           )}

//           {/* Chat Button */}
//           <button
//             onClick={handleChat}
//             className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-lg"
//           >
//             Chat with Seller
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useItem } from "@/lib/hooks/useItem";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function ItemPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth(false);
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;

  const {
    item,
    loading: itemLoading,
    error: itemError,
  } = useItem(itemId, true);

  const loading = authLoading || itemLoading;

  const handleChat = () => {
    if (!isAuthenticated) {
      router.push(
        `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (item) {
      router.push(`/chat?listing=${item.id}&seller=${item.user_id}`);
    }
  };

  if (loading) {
    return (
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
  }

  if (itemError || !item) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              Item not found
            </h2>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header activeTextColor={styles.warmPrimary} />
      <div className="max-w-6xl mx-auto p-4 ml-64 my-36">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap md:flex-nowrap items-center">
          {/* Left Side - Details */}
          <div className="md:w-1/2 w-full p-4">
            <h1 className="text-6xl font-bold text-gray-800">{item.title}</h1>
            <p className="text-gray-600 mt-4 text-lg">{item.description}</p>
            <div className="mt-4 text-lg">
              <p>
                <span className="font-semibold text-gray-700">Price:</span> 
                {item.price}
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Product Type:
                </span>
                {item.product_type}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Created At:</span>{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Right Side - Image */}
          {item.image_url && (
            <div className=" w-fit h-fit p-4 flex justify-center">
              <img
                src={item.image_url[0]}
                alt={item.title}
                className="rounded-lg w-full max-h-80 object-cover"
              />
            </div>
          )}
        </div>
        <button
          onClick={handleChat}
          className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg text-lg"
        >
          Chat with Seller
        </button>
      </div>
    </div>
  );
}
