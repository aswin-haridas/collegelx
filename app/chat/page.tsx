"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";

interface Message {
  id: string;
  message: string;
  seller_id: string;
  reciver_id: string;
  sent_at: string;
  listing_id: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const receiverId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("receiver_id")
      : null;
  const listingId =
    typeof window !== "undefined" ? sessionStorage.getItem("listing_id") : null;

  useEffect(() => {
    // Redirect if not logged in or no receiver ID
    if (!userId || !receiverId) {
      router.push("/messages");
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        // Fix the query structure
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`seller_id.eq.${userId},reciver_id.eq.${userId}`)
          .or(`seller_id.eq.${receiverId},reciver_id.eq.${receiverId}`)
          .order("sent_at", { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        // Filter messages client-side to ensure they're between these two users only
        const filteredMessages = (data || []).filter(
          (msg) =>
            (msg.seller_id === userId && msg.reciver_id === receiverId) ||
            (msg.seller_id === receiverId && msg.reciver_id === userId)
        );

        setMessages(filteredMessages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReceiverName = async () => {
      if (!receiverId) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", receiverId)
          .single();

        if (data && !error) {
          setReceiverName(data.name);
        }
      } catch (err) {
        console.error("Error fetching receiver name:", err);
      }
    };

    fetchMessages();
    fetchReceiverName();

    // Subscribe to new messages with improved approach
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;

          // Only add message if it belongs to this conversation
          if (
            (newMessage.seller_id === userId &&
              newMessage.reciver_id === receiverId) ||
            (newMessage.seller_id === receiverId &&
              newMessage.reciver_id === userId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    // Debug that subscription is active
    console.log("Realtime subscription activated");

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [userId, receiverId, router]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !userId || !receiverId) return;

    try {
      setSending(true);

      const messageData = {
        message: newMessage.trim(),
        seller_id: userId,
        reciver_id: receiverId,
        sent_at: new Date().toISOString(),
        listing_id: listingId || "",
      };

      const { error } = await supabase.from("messages").insert([messageData]);

      if (error) throw new Error(error.message);

      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        {/* Chat header */}
        <div
          className="p-4 border-b flex items-center"
          style={{ borderColor: styles.warmBorder }}
        >
          <button
            onClick={() => router.push("/messages")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" style={{ color: styles.warmText }} />
          </button>
          <div>
            <h2
              className="font-medium text-lg"
              style={{ color: styles.warmText }}
            >
              {receiverName || "Chat"}
            </h2>
            {listingId && (
              <p className="text-sm text-gray-500">
                Listing #{listingId.substring(0, 8)}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2
              className="h-8 w-8 animate-spin"
              style={{ color: styles.warmPrimary }}
            />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => router.push("/messages")}
                className="mt-4 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: styles.warmPrimary }}
              >
                Back to Messages
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-3 ${
                    message.seller_id === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[70%] ${
                      message.seller_id === userId
                        ? "text-white"
                        : "bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        message.seller_id === userId ? styles.warmPrimary : "",
                      color:
                        message.seller_id === userId
                          ? "white"
                          : styles.warmText,
                    }}
                  >
                    <p>{message.message}</p>
                    <div className="text-xs mt-1 opacity-70 text-right">
                      {new Date(message.sent_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t flex"
              style={{ borderColor: styles.warmBorder }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow p-3 border rounded-lg mr-2"
                style={{ borderColor: styles.warmBorder }}
                placeholder="Type your message..."
                disabled={sending}
              />
              <button
                type="submit"
                className="p-3 rounded-lg text-white"
                style={{ backgroundColor: styles.warmPrimary }}
                disabled={!newMessage.trim() || sending}
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
