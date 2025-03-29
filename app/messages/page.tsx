"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Define the message type based on your database schema
interface Message {
  id: string;
  sent_at: string;
  seller_id: string;
  reciver_id: string;
  message: string;
  created_at: string;
  listing_id: string;
  sender_name?: string;
  reciver_name?: string;
}

// Styles
const styles = {
  warmPrimary: "#FF5A5F",
  warmText: "#484848",
  warmBorder: "#DDDDDD",
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);

        // Get user from localStorage
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("name");

        if (!userId) {
          router.push("/auth/login");
          return;
        }

        // Get messages where the current user is either sender or receiver
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`seller_id.eq.${userId},reciver_id.eq.${userId}`)
          .order("sent_at", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        // Fetch sender and receiver names for each message
        const messagesWithNames = await Promise.all(
          data.map(async (message) => {
            // Get sender info
            if (message.seller_id === userId) {
              message.sender_name = userName || "You";
            } else if (message.seller_id) {
              const { data: senderData } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", message.seller_id)
                .single();

              message.sender_name = senderData?.name || "Unknown User";
            }

            // Get receiver info
            if (message.reciver_id === userId) {
              message.reciver_name = userName || "You";
            } else if (message.reciver_id) {
              const { data: receiverData } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", message.reciver_id)
                .single();

              message.reciver_name = receiverData?.name || "Unknown User";
            }

            return message;
          })
        );

        setMessages(messagesWithNames);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [router]);

  const handleMessageClick = (message: Message) => {
    const userId = localStorage.getItem("userId");
    // Determine if the current user is the sender or receiver
    const receiverId =
      message.seller_id === userId ? message.reciver_id : message.seller_id;

    // Store IDs in sessionStorage instead of URL parameters
    sessionStorage.setItem("listing_id", message.listing_id);
    sessionStorage.setItem("receiver_id", receiverId);
    sessionStorage.setItem("seller_id", userId || "");

    // Navigate to chat without parameters
    router.push(`/chat`);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: styles.warmText }}
        >
          Messages
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: styles.warmPrimary }}
            ></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Back to Home
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-lg shadow-sm">
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              No messages found
            </h2>
            <p className="text-gray-500 mb-4">
              You don't have any messages yet
            </p>
            <button
              onClick={() => router.push("/buy")}
              className="mt-4 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: styles.warmPrimary }}
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className="font-medium"
                        style={{ color: styles.warmText }}
                      >
                        {message.seller_id === message.reciver_id
                          ? "Note to self"
                          : `${message.sender_name} → ${message.reciver_name}`}
                      </h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(message.sent_at)}
                    </div>
                  </div>
                  {message.listing_id && (
                    <div className="mt-2 inline-block px-2 py-1 bg-gray-100 text-xs rounded text-gray-600">
                      Related to listing #{message.listing_id.substring(0, 8)}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
