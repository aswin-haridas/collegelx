"use client";

import { useState, useEffect } from "react";
import { useChat } from "./useChat";
import { supabase } from "@/shared/lib/supabase";
import { styles } from "@/shared/lib/styles";
import Header from "@/shared/components/Header";
import { Message as MessageType, User } from "@/app/lib/types";
import { useLoginCheck } from "@/shared/hooks/useLoginCheck";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const {
    messages,
    chats,
    chatProducts,
    chatUsers,
    loading,
    error,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
  } = useChat();

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useLoginCheck();

  const [newMessage, setNewMessage] = useState("");

  // Group chats by product
  const [chatsByProduct, setChatsByProduct] = useState<
    Record<string, unknown[]>
  >({});

  // Create a mapping of product IDs to products
  const [productsList, setProductsList] = useState<Record<string, unknown>>({});

  // Track which product is expanded to show its users
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  // Get current user from session storage
  useEffect(() => {
    const currentUserId = sessionStorage.getItem("user_id");
    if (currentUserId) {
      const fetchUser = async () => {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUserId)
          .single();

        if (data) {
          setUser(data);
        }
      };
      fetchUser();
    }
  }, []);

  // Organize chats by product and extract product details
  useEffect(() => {
    if (chats.length > 0) {
      const groupedChats: Record<string, unknown[]> = {};
      const products: Record<string, unknown> = {};

      chats.forEach((chat) => {
        const productId = chat.product_id || "unknown";

        if (!groupedChats[productId]) {
          groupedChats[productId] = [];
        }

        groupedChats[productId].push(chat);

        // Find product details from chatProducts
        if (chat.product_id && chatProducts[chat.id]) {
          products[productId] = chatProducts[chat.id];
        }
      });

      setChatsByProduct(groupedChats);
      setProductsList(products);
    }
  }, [chats, chatProducts]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage("");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getChatName = (chat: unknown) => {
    const currentUserId = user?.id || sessionStorage.getItem("user_id");

    if (chat.buyer_id === currentUserId) {
      return chatUsers[chat.seller_id]?.name || "Seller";
    } else {
      return chatUsers[chat.buyer_id]?.name || "Buyer";
    }
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Function to handle product click - toggle selection
  const handleProductClick = (productId: string) => {
    if (selectedProductId === productId) {
      setSelectedProductId(null); // Collapse if already selected
    } else {
      setSelectedProductId(productId); // Expand this product
    }
  };

  return (
    <>
      <Header />
      <div
        className="flex"
        style={{ height: "calc(100vh - 70px)", backgroundColor: styles.Bg }}
      >
        {/* Chat List Sidebar */}
        <div
          className="w-1/3 overflow-y-auto"
          style={{
            backgroundColor: "#FFFFFF",
            borderRight: `1px solid ${styles.Border}`,
          }}
        >
          {loading ? (
            <div className="p-4 flex justify-center items-center h-full">
              <div
                className="animate-spin rounded-full h-10 w-10 border-b-2"
                style={{ borderColor: styles.Primary }}
              ></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">Error: {error}</div>
          ) : Object.keys(chatsByProduct).length === 0 ? (
            <div className="p-4 text-center flex flex-col items-center justify-center h-full">
              <div className="text-lg mb-2" style={{ color: styles.Text }}>
                No chats found
              </div>
              <button
                onClick={() => router.push("/products")}
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: styles.Primary }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div>
              {/* Products List */}
              <div className="p-4 sticky top-0 z-10 bg-white border-b border-gray-200">
                <h2
                  className="font-semibold text-lg"
                  style={{ color: styles.Text }}
                >
                  Products
                </h2>
              </div>

              {/* Display products as expandable headers */}
              {Object.entries(chatsByProduct).map(
                ([productId, productChats]) => {
                  const product = productsList[productId] || {};

                  return (
                    <div key={productId} className="mb-2">
                      {/* Product header - clickable to expand/collapse */}
                      <div
                        className="p-3 flex items-center cursor-pointer hover:bg-gray-50"
                        style={{
                          backgroundColor:
                            selectedProductId === productId
                              ? styles.Bg
                              : "#FFFFFF",
                          borderBottom: `1px solid ${styles.Border}`,
                        }}
                        onClick={() => handleProductClick(productId)}
                      >
                        <div
                          className="w-12 h-12 rounded-md mr-3 bg-center bg-cover flex-shrink-0"
                          style={{
                            backgroundColor: styles.Border,
                            backgroundImage:
                              product.images && product.images.length > 0
                                ? `url(${product.images[0]})`
                                : "none",
                          }}
                        ></div>
                        <div className="flex-1">
                          <h3
                            className="font-medium"
                            style={{ color: styles.Text }}
                          >
                            {product.name || "Unnamed Product"}
                          </h3>
                          <p
                            className="text-xs"
                            style={{ color: styles.AccentDark }}
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
                              color: styles.AccentDark,
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

                      {/* Chat users for this product - only shown when product is selected */}
                      {selectedProductId === productId && (
                        <div className="pl-4">
                          {productChats.map((chat) => (
                            <div
                              key={chat.id}
                              className="p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center"
                              style={{
                                backgroundColor:
                                  selectedChatId === chat.id
                                    ? styles.Bg
                                    : "#FFFFFF",
                              }}
                              onClick={() => setSelectedChatId(chat.id)}
                            >
                              <div
                                className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white flex-shrink-0"
                                style={{
                                  backgroundColor: styles.Primary,
                                }}
                              >
                                {getChatName(chat).charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h2
                                    className="font-semibold"
                                    style={{ color: styles.Text }}
                                  >
                                    {getChatName(chat)}
                                  </h2>
                                  <span
                                    className="text-xs"
                                    style={{
                                      color: styles.AccentDark,
                                    }}
                                  >
                                    {formatDate(chat.created_at)}
                                  </span>
                                </div>
                                <p
                                  className="text-xs truncate"
                                  style={{ color: styles.Text }}
                                >
                                  Tap to view conversation
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedChatId ? (
            <>
              {/* Chat Header */}
              <div
                className="p-4 flex items-center"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderBottom: `1px solid ${styles.Border}`,
                }}
              >
                {/* Back arrow to return to product layer */}
                <div
                  className="mr-3 cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
                  onClick={() => setSelectedChatId(null)}
                  style={{ color: styles.AccentDark }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </div>

                {/* Try to get the product info */}
                {chats.find((chat) => chat.id === selectedChatId)?.product_id &&
                  chatProducts[selectedChatId] && (
                    <div
                      className="w-10 h-10 mr-3 rounded-md bg-cover bg-center"
                      style={{
                        backgroundImage:
                          chatProducts[selectedChatId]?.images &&
                          chatProducts[selectedChatId].images.length > 0
                            ? `url(${chatProducts[selectedChatId].images[0]})`
                            : "none",
                        backgroundColor: styles.Border,
                      }}
                      onClick={() => {
                        const productId = chats.find(
                          (chat) => chat.id === selectedChatId
                        )?.product_id;
                        if (productId) {
                          router.push(`/buy/${productId}`);
                        }
                      }}
                    ></div>
                  )}

                <div className="flex flex-col flex-1">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: styles.Text }}
                  >
                    {chats.find((chat) => chat.id === selectedChatId)
                      ? getChatName(
                          chats.find((chat) => chat.id === selectedChatId)
                        )
                      : "Chat"}
                  </h2>

                  {/* Show product info if available */}
                  {chatProducts[selectedChatId] && (
                    <div
                      className="text-xs cursor-pointer"
                      style={{ color: styles.Primary }}
                      onClick={() => {
                        const productId = chats.find(
                          (chat) => chat.id === selectedChatId
                        )?.product_id;
                        if (productId) {
                          router.push(`/buy/${productId}`);
                        }
                      }}
                    >
                      {truncateText(
                        chatProducts[selectedChatId].name ||
                          "View product details"
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 p-4 overflow-y-auto"
                style={{ backgroundColor: styles.Bg }}
              >
                {loading ? (
                  <div className="text-center">Loading messages...</div>
                ) : error ? (
                  <div className="text-red-500 text-center">Error: {error}</div>
                ) : messages.length === 0 ? (
                  <div className="text-center">No messages yet</div>
                ) : (
                  messages.map((message: MessageType) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.seller_id === user?.id ||
                        message.seller_id === sessionStorage.getItem("user_id")
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className="max-w-xs p-3 rounded-lg"
                        style={{
                          backgroundColor:
                            message.seller_id === user?.id ||
                            message.seller_id ===
                              sessionStorage.getItem("user_id")
                              ? styles.Primary
                              : "#FFFFFF",
                          color:
                            message.seller_id === user?.id ||
                            message.seller_id ===
                              sessionStorage.getItem("user_id")
                              ? "#FFFFFF"
                              : styles.Text,
                        }}
                      >
                        <p>{message.message}</p>
                        <span
                          className="text-xs opacity-75"
                          style={{
                            color:
                              message.seller_id === user?.id ||
                              message.seller_id ===
                                sessionStorage.getItem("user_id")
                                ? styles.Accent
                                : styles.AccentDark,
                          }}
                        >
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div
                className="p-4"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderTop: `1px solid ${styles.Border}`,
                }}
              >
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-l-md focus:outline-none"
                    style={{
                      border: `1px solid ${styles.Border}`,
                      backgroundColor: styles.Bg,
                      color: styles.Text,
                    }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    className="p-2 rounded-r-md"
                    style={{
                      backgroundColor: styles.Primary,
                      color: "#FFFFFF",
                    }}
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex items-center justify-center"
              style={{ color: styles.Text }}
            >
              <div className="text-center max-w-md mx-auto p-6">
                <h2 className="text-xl font-semibold mb-2">
                  Select a conversation
                </h2>
                <p className="text-sm">
                  Select a product and then a chat from the sidebar to start
                  messaging with buyers or sellers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
