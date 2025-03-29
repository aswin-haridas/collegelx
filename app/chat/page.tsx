"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import { Item, Message, User } from "@/lib/types";
import Header from "@/components/Sidebar";
import { Loader2, Send, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    userId: currentUserId,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();

  // State variables
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [seller, setSeller] = useState<User | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get listingId and receiverId from query parameters
  const listingId = searchParams?.get("listingId");
  const receiverId = searchParams?.get("receiverId");

  // Fetch current user details
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) return;

    async function fetchCurrentUser() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("userid", currentUserId)
          .single();

        if (error) throw error;
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setError("Failed to load user information");
      }
    }

    fetchCurrentUser();
  }, [currentUserId, isAuthenticated]);

  // Fetch messages, item details, and seller info
  useEffect(() => {
    if (!listingId || !receiverId || !currentUserId) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("listing_id", listingId)
          .or(`sender_id.eq.${currentUserId},reciver_id.eq.${currentUserId}`)
          .order("sent_at", { ascending: true });

        if (messagesError) throw messagesError;

        // Fetch item details
        const { data: itemData, error: itemError } = await supabase
          .from("items")
          .select("*")
          .eq("id", listingId)
          .single();

        if (itemError) throw itemError;

        // Fetch seller details
        const { data: sellerData, error: sellerError } = await supabase
          .from("users")
          .select("*")
          .eq("userid", receiverId)
          .single();

        if (sellerError) throw sellerError;

        setMessages(messagesData || []);
        setItem(itemData);
        setSeller(sellerData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load conversation data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `listing_id=eq.${listingId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (
            (newMessage.sender_id === currentUserId &&
              newMessage.reciver_id === receiverId) ||
            (newMessage.sender_id === receiverId &&
              newMessage.reciver_id === currentUserId)
          ) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [listingId, receiverId, currentUserId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message function
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser || !listingId || !receiverId) return;

    setSending(true);

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: currentUser.userid,
        reciver_id: receiverId,
        listing_id: listingId,
        message: newMessage.trim(),
        sent_at: new Date().toISOString(),
      });

      if (error) throw error;

      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      setError(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // If no listing is selected, show chat list or prompt
  if (!listingId || !receiverId) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="max-w-4xl mx-auto p-4 ml-64">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <AlertCircle
              className="mx-auto h-12 w-12 mb-4"
              style={{ color: styles.warmPrimary }}
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              No conversation selected
            </h2>
            <p className="text-gray-600 mb-4">
              Select an item from your browsing history or visit an item page to
              start a conversation with the seller.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Browse Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: styles.warmPrimary }}
          />
          <span className="ml-2" style={{ color: styles.warmText }}>
            Loading conversation...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen">
        <Header activeTextColor={styles.warmPrimary} />
        <div className="flex justify-center items-center h-full ml-64">
          <div className="text-center">
            <AlertCircle
              className="mx-auto h-12 w-12 mb-4"
              style={{ color: styles.warmPrimary }}
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              {error}
            </h2>
            <button
              onClick={() => router.refresh()}
              className="px-4 py-2 rounded-lg text-white mt-4"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Header activeTextColor={styles.warmPrimary} />

      <div className="max-w-4xl mx-20  p-4 ml-64 h-full flex flex-col">
        {/* Chat Header with Item and Seller Info */}
        <div
          className="bg-white p-4 rounded-t-lg shadow-sm flex items-center space-x-4 border-b"
          style={{ borderColor: styles.warmBorder }}
        >
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} style={{ color: styles.warmText }} />
          </button>

          {item && (
            <div className="flex items-center flex-grow">
              <div className="h-12 w-12 bg-gray-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-200">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3
                  className="font-medium truncate"
                  style={{ color: styles.warmText }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: styles.warmPrimary }}>
                  ₹{item.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {seller && (
            <div className="flex items-center">
              <div className="mr-3 text-right hidden sm:block">
                <p className="font-medium" style={{ color: styles.warmText }}>
                  {seller.name}
                </p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                {seller.profile_image ? (
                  <img
                    src={seller.profile_image}
                    alt={seller.name || "Seller"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-300">
                    <span className="text-xs text-gray-500">
                      {seller.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div
          className="flex-grow bg-gray-50 p-4 overflow-y-auto"
          style={{ backgroundColor: styles.warmBg }}
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm">
                <h3
                  className="font-medium mb-2"
                  style={{ color: styles.warmText }}
                >
                  No messages yet
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start the conversation by sending a message to the seller
                  about this item.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUser?.userid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender_id === currentUser?.userid
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                    style={
                      message.sender_id === currentUser?.userid
                        ? { backgroundColor: styles.warmPrimary }
                        : {
                            backgroundColor: "white",
                            borderColor: styles.warmBorder,
                            border: "1px solid",
                          }
                    }
                  >
                    <p className="break-words">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === currentUser?.userid
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.sent_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white p-3 border-t rounded-b-lg shadow-sm"
          style={{ borderColor: styles.warmBorder }}
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{
                borderColor: styles.warmBorder,
                color: styles.warmText,
              }}
              placeholder="Type your message..."
              disabled={sending}
            />
            <button
              type="submit"
              className="p-2.5 px-5 rounded-lg text-white disabled:opacity-50"
              style={{ backgroundColor: styles.warmPrimary }}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
