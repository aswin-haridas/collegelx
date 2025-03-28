"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import { Item, Message, User } from "@/lib/types";
import Header from "@/components/Sidebar";
import { Loader2, Send, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ChatPage() {
  const { isAuthenticated, userId, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listing");
  const receiverId = searchParams.get("seller");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSubscription, setChatSubscription] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  // Check if user is logged in and get user data
  useEffect(() => {
    async function checkAuth() {
      try {
        setIsAuthChecking(true);

        if (!isAuthenticated) {
          return; // useAuth hook will handle the redirect
        }

        // Get user profile from user table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)

        if (userError) throw userError;

        setCurrentUser(userData[0] || null);

        // Fetch data if we have listing ID and seller ID
        if (listingId && receiverId) {
          await fetchListingAndSellerData();
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setError("Failed to load user data");
      } finally {
        setIsAuthChecking(false);
      }
    }

    if (!isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, userId, isLoading, listingId, receiverId]);

  // Fetch listing and seller data
  async function fetchListingAndSellerData() {
    try {
      // Get listing details
      if (listingId) {
        const { data: itemData, error: itemError } = await supabase
          .from("items")
          .select("*")
          .eq("id", listingId)
          .single();

        if (itemError) throw itemError;
        setItem(itemData);
      }

      // Get seller details
      if (receiverId) {
        const { data: sellerData, error: sellerError } = await supabase
          .from("users")
          .select("*")
          .eq("id", receiverId)
          .single();

        if (sellerError) throw sellerError;
        setSeller(sellerData);
      }

      // Fetch previous messages
      await fetchMessages();

      // Subscribe to new messages
      setupRealtimeSubscription();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load conversation data");
    }
  }

  // Fetch previous messages between the current user and seller for this listing
  async function fetchMessages() {
    if (!currentUser?.userid || !receiverId || !listingId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:sender_id(name, profile_image)
        `
        )
        .or(
          `and(sender_id.eq.${currentUser.userid},reciver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},reciver_id.eq.${currentUser.userid})`
        )
        .eq("listing_id", listingId)
        .order("sent_at", { ascending: true });

      if (error) throw error;

      // Format messages with sender info
      const formattedMessages = data.map((msg: any) => ({
        ...msg,
        sender_name: msg.sender?.name,
        sender_profile_image: msg.sender?.profile_image,
      })) as Message[];

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages");
    }
  }

  // Set up real-time subscription for new messages
  function setupRealtimeSubscription() {
    if (!currentUser?.userid || !receiverId || !listingId) return;

    // Clean up any existing subscription
    if (chatSubscription) {
      supabase.removeChannel(chatSubscription);
    }

    // Create a new subscription
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `listing_id=eq.${listingId}`,
        },
        async (payload) => {
          console.log("New message received:", payload);

          // Get sender details
          const { data: senderData } = await supabase
            .from("user")
            .select("name, profile_image")
            .eq("userid", payload.new.sender_id)
            .single();

          // Add the new message to state with proper typing
          const newMsg = {
            ...payload.new,
            sender_name: senderData?.name,
            sender_profile_image: senderData?.profile_image,
          } as Message;

          setMessages((current) => [...current, newMsg]);
        }
      )
      .subscribe();

    setChatSubscription(channel);

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser || !receiverId || !listingId) return;

    setSending(true);

    try {
      const messageData = {
        sender_id: currentUser.userid,
        reciver_id: receiverId,
        listing_id: Number(listingId),
        message: newMessage.trim(),
        sent_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("messages").insert(messageData);

      if (error) throw error;

      // Clear input after sending
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Cleanup subscription when component unmounts
  useEffect(() => {
    return () => {
      if (chatSubscription) {
        supabase.removeChannel(chatSubscription);
      }
    };
  }, [chatSubscription]);

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

      <div className="max-w-4xl mx-auto p-4 ml-64 h-full flex flex-col">
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
                {item.image_url && item.image_url.length > 0 ? (
                  <img
                    src={item.image_url[0]}
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
              className="p-2 rounded-lg text-white disabled:opacity-50"
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
