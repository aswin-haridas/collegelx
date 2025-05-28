import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles";
import { ChatType, ProductType, UserMap } from "@/types";

interface SidebarProps {
  chats: ChatType[];
  chatProducts: Record<string, ProductType>;
  chatUsers: UserMap;
  user: any;
  loading: boolean;
  error: string | null;
  selectedChatId: string | null;
  setSelectedChatId: (id: string | null) => void;
}

export default function Sidebar({
  chats,
  chatProducts,
  chatUsers,
  user,
  loading,
  error,
  selectedChatId,
  setSelectedChatId,
}: SidebarProps) {
  const router = useRouter();
  const [chatsByProduct, setChatsByProduct] = useState<
    Record<string, ChatType[]>
  >({});
  const [productsList, setProductsList] = useState<Record<string, ProductType>>(
    {}
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (chats.length > 0) {
      const groupedChats: Record<string, ChatType[]> = {};
      const products: Record<string, ProductType> = {};

      chats.forEach((chat: ChatType) => {
        const productId = chat.product_id || "unknown";
        if (!groupedChats[productId]) groupedChats[productId] = [];
        groupedChats[productId].push(chat);
        if (chat.product_id && chatProducts[chat.id]) {
          products[productId] = chatProducts[chat.id];
        }
      });

      setChatsByProduct(groupedChats);
      setProductsList(products);
    }
  }, [chats, chatProducts]);

  const getChatName = (chat: ChatType) => {
    const currentUserId = user?.id || sessionStorage.getItem("user_id");
    return chat.buyer_id === currentUserId
      ? chatUsers[chat.seller_id]?.name || "Seller"
      : chatUsers[chat.buyer_id]?.name || "Buyer";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId((prev) => (prev === productId ? null : productId));
  };

  return (
    <div
      className="w-1/3 overflow-y-auto"
      style={{
        backgroundColor: "#FFF",
        borderRight: `1px solid ${styles.primary}`,
      }}
    >
      {loading ? (
        <div className="p-4 flex justify-center items-center h-full">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: styles.primary }}
          ></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : Object.keys(chatsByProduct).length === 0 ? (
        <div className="p-4 text-center flex flex-col items-center justify-center h-full">
          <div className="text-lg mb-2">No chats found</div>
          <button
            onClick={() => router.push("/products")}
            className="px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: styles.primary }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div>
          <div className="p-4 sticky top-0 z-10 bg-white border-b border-gray-200">
            <h2 className="font-semibold text-lg">Products</h2>
          </div>
          {Object.entries(chatsByProduct).map(([productId, productChats]) => {
            const product = productsList[productId] || ({} as ProductType);
            return (
              <div key={productId} className="mb-2">
                <div
                  className="p-3 flex items-center cursor-pointer hover:bg-gray-50"
                  style={{
                    backgroundColor:
                      selectedProductId === productId
                        ? styles.background
                        : "#FFF",
                    borderBottom: `1px solid ${styles.primary}`,
                  }}
                  onClick={() => handleProductClick(productId)}
                >
                  <div
                    className="w-12 h-12 rounded-md mr-3 bg-center bg-cover flex-shrink-0"
                    style={{
                      backgroundColor: styles.primary,
                      backgroundImage:
                        product.images && product.images.length > 0
                          ? `url(${product.images[0]})`
                          : "none",
                    }}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {product.name || "Unnamed Product"}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: styles.primary_dark }}
                    >
                      ₹{product.price || "N/A"} • {productChats.length}{" "}
                      conversation
                      {productChats.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        color: styles.primary_dark,
                        transform:
                          selectedProductId === productId
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
                {selectedProductId === productId && (
                  <div className="pl-4">
                    {productChats.map((chat) => (
                      <div
                        key={chat.id}
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
                        style={{
                          backgroundColor:
                            selectedChatId === chat.id
                              ? styles.background
                              : "#FFF",
                        }}
                        onClick={() => setSelectedChatId(chat.id)}
                      >
                        <div
                          className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white flex-shrink-0"
                          style={{ backgroundColor: styles.primary }}
                        >
                          {getChatName(chat).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h2 className="font-semibold">
                              {getChatName(chat)}
                            </h2>
                            <span
                              className="text-xs"
                              style={{ color: styles.primary_dark }}
                            >
                              {formatDate(chat.created_at)}
                            </span>
                          </div>
                          <p className="text-xs truncate">
                            Tap to view conversation
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
