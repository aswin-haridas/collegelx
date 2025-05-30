"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";
import Header from "@/shared/components/Header";
import { styles } from "@/shared/styles/theme";
import SearchBar from "./SearchBar";
import ConversationList from "./ConversationList";
import { Conversation } from "@/types";

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
          .select("id, name")
          .in("id", Array.from(listingIds));

        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
        }

        // Create lookup maps
        const userMap = new Map(
          usersData?.map((user: any) => [user.id, user]) || [],
        );
        const listingMap = new Map(
          listingsData?.map((listing: any) => [listing.id, listing]) || [],
        );

        // Enrich messages with user and listing data
        const enrichedMessages = messagesData.map((message: any) => ({
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

          // Get listing name
          const listingname =
            message.listing?.name ||
            `Listing #${message.listing_id?.substring(0, 8)}`;

          // If this is a new conversation we haven't processed yet, or this is a newer message
          if (
            !conversationsMap.has(conversationKey) ||
            new Date(message.sent_at).getTime() >
              new Date(
                conversationsMap.get(conversationKey)!.last_message_time,
              ).getTime()
          ) {
            // Create or update conversation entry with the latest message
            conversationsMap.set(conversationKey, {
              id: conversationKey,
              listing_id: message.listing_id,
              listing_name: listingname,
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
            new Date(a.last_message_time).getTime(),
        );

        setConversations(conversationsList);
        setFilteredConversations(conversationsList);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
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
          .includes(searchQuery.toLowerCase()),
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
    {} as Record<string, Conversation[]>,
  );

  const handleConversationClick = (conversation: Conversation) => {
    // Store IDs in sessionStorage for the chat page
    sessionStorage.setItem("listing_id", conversation.listing_id);
    sessionStorage.setItem("receiver_id", conversation.participant_id);
    sessionStorage.setItem(
      "sender_id",
      sessionStorage.getItem("user_id") || "",
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

  // Replace the getListingname function with this one that uses the stored name
  const getListingname = (conversation: Conversation) => {
    return (
      conversation.listing_name ||
      `Listing #${conversation.listing_id.substring(0, 8)}`
    );
  };
  return (
    <>
      <Header />
      <div className="h-screen flex bg-gray-50">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1
              className="text-2xl font-bold"
              style={{ color: styles.primary }}
            >
              Conversations
            </h1>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <ConversationList
            loading={loading}
            error={error}
            filteredConversations={filteredConversations}
            searchQuery={searchQuery}
            groupedConversations={groupedConversations}
            handleConversationClick={handleConversationClick}
            formatDate={formatDate}
            getListingname={getListingname}
          />
        </div>
      </div>
    </>
  );
}
