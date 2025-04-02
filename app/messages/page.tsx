"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";
import Header from "@/components/Header";

// Define the message type based on your database schema
interface Message {
  id: string;
  sent_at: string;
  sender_id: string;
  reciever_id: string;
  message: string;
  created_at: string;
  listing_id: string;
  sender_name?: string;
  reciver_name?: string;
}

// Define a new type for grouped conversations
interface Conversation {
  id: string; // unique identifier for the conversation
  listing_id: string;
  listing_title: string; // Add this field for storing the listing title
  participant_id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count?: number;
}

// Styles
const styles = {
  warmPrimary: "#FF5A5F",
  warmText: "#484848",
  warmBorder: "#DDDDDD",
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchMessages() {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
          setError("User not logged in");
          return;
        }

        // Get messages where the current user is either sender or receiver
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${userId},reciever_id.eq.${userId}`)
          .order("sent_at", { ascending: false });

        if (messagesError) {
          throw new Error(messagesError.message);
        }

        // Fetch user data for senders and receivers
        const userIds = new Set<string>();
        const listingIds = new Set<string>();

        messagesData.forEach((message) => {
          userIds.add(message.sender_id);
          userIds.add(message.reciever_id);
          if (message.listing_id) listingIds.add(message.listing_id);
        });

        // Get user details
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, name")
          .in("id", Array.from(userIds));

        if (usersError) {
          console.error("Error fetching users:", usersError);
        }

        // Get listing details from items table
        const { data: listingsData, error: listingsError } = await supabase
          .from("items")
          .select("id, title")
          .in("id", Array.from(listingIds));

        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
        }

        // Create lookup maps
        const userMap = new Map(
          usersData?.map((user) => [user.id, user]) || []
        );
        const listingMap = new Map(
          listingsData?.map((listing) => [listing.id, listing]) || []
        );

        // Enrich messages with user and listing data
        const enrichedMessages = messagesData.map((message) => ({
          ...message,
          sender: userMap.get(message.sender_id),
          receiver: userMap.get(message.reciever_id),
          listing: listingMap.get(message.listing_id),
        }));

        // Group messages by conversations (listing_id + other participant)
        const conversationsMap = new Map<string, Conversation>();

        for (const message of enrichedMessages) {
          // Determine who the other participant is
          const isUserSender = message.sender_id === userId;
          const participantId = isUserSender
            ? message.reciever_id
            : message.sender_id;

          // Create a unique key for the conversation: listing_id + participant_id
          const conversationKey = `${message.listing_id}-${participantId}`;

          // Get the participant's name from the user data
          const participantName = isUserSender
            ? message.receiver?.name || "Unknown User"
            : message.sender?.name || "Unknown User";

          // Get listing title
          const listingTitle =
            message.listing?.title ||
            `Listing #${message.listing_id?.substring(0, 8)}`;

          // If this is a new conversation we haven't processed yet, or this is a newer message
          if (
            !conversationsMap.has(conversationKey) ||
            new Date(message.sent_at).getTime() >
              new Date(
                conversationsMap.get(conversationKey)!.last_message_time
              ).getTime()
          ) {
            // Create or update conversation entry with the latest message
            conversationsMap.set(conversationKey, {
              id: conversationKey,
              listing_id: message.listing_id,
              listing_title: listingTitle,
              participant_id: participantId,
              participant_name: participantName,
              last_message: message.message,
              last_message_time: message.sent_at,
              unread_count: 0, // Could implement unread count later
            });
          }
        }

        // Convert the map to an array and sort by last message time
        const conversationsList = Array.from(conversationsMap.values()).sort(
          (a, b) =>
            new Date(b.last_message_time).getTime() -
            new Date(a.last_message_time).getTime()
        );

        setConversations(conversationsList);
        setFilteredConversations(conversationsList);
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

  // Filter conversations when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(
      (conversation) =>
        conversation.participant_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        conversation.last_message
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );

    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  // Group conversations by listing ID
  const groupedConversations = filteredConversations.reduce(
    (groups, conversation) => {
      const listingId = conversation.listing_id;
      if (!groups[listingId]) {
        groups[listingId] = [];
      }
      groups[listingId].push(conversation);
      return groups;
    },
    {} as Record<string, Conversation[]>
  );

  const handleConversationClick = (conversation: Conversation) => {
    // Store IDs in sessionStorage for the chat page
    sessionStorage.setItem("listing_id", conversation.listing_id);
    sessionStorage.setItem("receiver_id", conversation.participant_id);
    sessionStorage.setItem(
      "sender_id",
      sessionStorage.getItem("user_id") || ""
    );

    // Navigate to chat
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

  // Replace the getListingTitle function with this one that uses the stored title
  const getListingTitle = (conversation: Conversation) => {
    return (
      conversation.listing_title ||
      `Listing #${conversation.listing_id.substring(0, 8)}`
    );
  };

  return (
    <>
      {" "}
      <Header />
      <div className="h-screen flex bg-gray-50">
        <div className="flex-1  p-6">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-2xl font-bold"
              style={{ color: styles.warmText }}
            >
              Conversations
            </h1>
          </div>

          {/* Search bar */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                borderColor: styles.warmBorder,
              }}
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
          ) : filteredConversations.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-lg shadow-sm">
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: styles.warmText }}
              >
                {searchQuery
                  ? "No matching conversations"
                  : "No conversations found"}
              </h2>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "You don't have any messages yet"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/buy")}
                  className="mt-4 px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  Browse Listings
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm">
              {Object.entries(groupedConversations).map(
                ([listingId, conversationsGroup]) => (
                  <div key={listingId} className="mb-4">
                    <div
                      className="bg-gray-100 p-3 font-medium text-sm sticky top-0"
                      style={{ color: styles.warmText }}
                    >
                      {conversationsGroup[0].listing_title ||
                        getListingTitle(conversationsGroup[0])}
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {conversationsGroup.map((conversation) => (
                        <li
                          key={conversation.id}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleConversationClick(conversation)}
                        >
                          <div className="flex justify-between">
                            <div className="flex-1">
                              <h3
                                className="font-medium text-lg"
                                style={{ color: styles.warmText }}
                              >
                                {conversation.participant_name}
                              </h3>
                              <p className="text-gray-600 mt-1 line-clamp-1">
                                {conversation.last_message}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
                              {formatDate(conversation.last_message_time)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
