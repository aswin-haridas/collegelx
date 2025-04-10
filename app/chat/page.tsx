// src/app/chat/page.tsx (or appropriate path)
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, AlertCircle, Send, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/shared/lib/supabase";
import { styles } from "@/shared/lib/styles";
import Header from "@/shared/components/Header";
import { Conversation, Message } from "@/shared/lib/types";

export default function ChatPage() {
  // Conversations list state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [errorConversations, setErrorConversations] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Selected conversation tracking
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // Input state for new message
  const [newMessageInput, setNewMessageInput] = useState(""); // State for the input field

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- User and Initial Params ---
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch userId from session storage on mount
    const storedUserId = sessionStorage.getItem("user_id");
    if (!storedUserId) {
      console.log("User not logged in, redirecting...");
      router.push("/login");
    } else {
      setUserId(storedUserId);
    }
  }, [router]);

  // --- Fetch Conversations ---
  const fetchConversations = useCallback(async (currentUserId: string) => {
    setErrorConversations(null);
    setLoadingConversations(true);
    try {
      // Get messages where the current user is either sender or receiver
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select<"*", Message>("*") // Use Message type
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`) // Use correct field name
        .order("created_at", { ascending: false });

      if (messagesError)
        throw new Error(`Messages fetch error: ${messagesError.message}`);
      if (!messagesData) throw new Error("No messages data received");

      // --- Enrichment ---
      const participantIds = new Set<string>();
      const listingIds = new Set<string>();
      messagesData.forEach((message) => {
        // Add the *other* participant's ID
        participantIds.add(
          message.sender_id === currentUserId
            ? message.receiver_id // Use correct field name
            : message.sender_id
        );
        listingIds.add(message.listing_id);
      });

      // Fetch listings info
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select<"*", Listing>("id, title") // Use Listing type
        .in("id", Array.from(listingIds));
      if (listingsError)
        console.warn("Error fetching listings:", listingsError.message); // Don't block on listing errors

      // Create lookup maps
      const profileMap = new Map(profilesData?.map((p) => [p.id, p]) || []);
      const listingMap = new Map(listingsData?.map((l) => [l.id, l]) || []);

      // --- Group into Conversations ---
      const conversationsMap = new Map<string, Conversation>();
      for (const message of messagesData) {
        const participantId =
          message.sender_id === currentUserId
            ? message.receiver_id // Use correct field name
            : message.sender_id;
        const conversationKey = `${message.listing_id}-${participantId}`;

        // Ensure necessary info is available, provide defaults if not
        const participantProfile = profileMap.get(participantId);
        const participantName = participantProfile?.name || "Unknown User";
        const listing = listingMap.get(message.listing_id);
        const listingTitle =
          listing?.title || `Listing ${message.listing_id.substring(0, 6)}...`;

        // If this is the first message seen for this convo or a newer message
        if (
          !conversationsMap.has(conversationKey) ||
          new Date(message.created_at) >
            new Date(conversationsMap.get(conversationKey)!.last_message_time)
        ) {
          conversationsMap.set(conversationKey, {
            id: conversationKey,
            listing_id: message.listing_id,
            listing_title: listingTitle,
            participant_id: participantId,
            participant_name: participantName,
            last_message: message.message,
            last_message_time: message.created_at,
            unread_count: 0, // Implement unread count logic separately if needed
          });
        }
      }

      const conversationsList = Array.from(conversationsMap.values()).sort(
        (a, b) =>
          new Date(b.last_message_time).getTime() -
          new Date(a.last_message_time).getTime()
      );

      setConversations(conversationsList);
      setFilteredConversations(conversationsList); // Initialize filter
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An unknown error occurred fetching conversations";
      setErrorConversations(message);
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }, []); // useCallback dependencies are listed

  // Initial conversation fetch effect
  useEffect(() => {
    if (userId) {
      console.log("Fetching conversations for user:", userId);
      fetchConversations(userId);
    }
  }, [userId, fetchConversations]); // Depend on userId and the memoized fetch function

  // --- Selecting Conversation & Using useChat Hook ---

  // Effect to select initial conversation from URL params
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      // Only run if conversations loaded and none selected yet
      const initialReceiverId = searchParams?.get("receiverId");
      const initialListingId = searchParams?.get("listingId");

      if (initialReceiverId && initialListingId) {
        console.log("Attempting to select conversation from URL params:", {
          initialReceiverId,
          initialListingId,
        });
        const conversationKey = `${initialListingId}-${initialReceiverId}`;
        const foundConversation = conversations.find(
          (c) => c.id === conversationKey
        );
        if (foundConversation) {
          console.log("Found matching conversation:", foundConversation);
          setSelectedConversation(foundConversation);
        } else {
          console.log("No conversation found matching URL params.");
        }
      }
    }
  }, [searchParams, conversations, selectedConversation]); // Depend on params and conversations

  // Call the useChat hook with data from the selected conversation
  const { chatState, participantInfo, sendMessage } = useChat(
    userId,
    selectedConversation?.participant_id ?? null,
    selectedConversation?.listing_id ?? null
  );

  // --- Filtering Conversations ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = conversations.filter(
        (conv) =>
          conv.participant_name.toLowerCase().includes(lowerCaseQuery) ||
          conv.listing_title.toLowerCase().includes(lowerCaseQuery) ||
          conv.last_message.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  // --- Scrolling ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages]); // Scroll when messages from the hook change

  // --- Event Handlers ---
  const handleConversationClick = (conversation: Conversation) => {
    console.log("Conversation clicked:", conversation);
    setSelectedConversation(conversation);
    setNewMessageInput(""); // Clear input when switching conversations

    // Update URL without full page reload
    const url = `/chat?receiverId=${conversation.participant_id}&listingId=${conversation.listing_id}`;
    // Use router.push for better integration with Next.js navigation state
    router.push(url, { scroll: false }); // scroll: false prevents jumping to top
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageInput.trim() || chatState.sending || !selectedConversation)
      return;

    await sendMessage(newMessageInput); // Call hook's sendMessage
    setNewMessageInput(""); // Clear input after sending
  };

  const goToListing = () => {
    if (participantInfo.listingInfo) {
      router.push(`/buy/${participantInfo.listingInfo.id}`);
    }
  };

  // --- UI Rendering ---

  // Group conversations by listing for display
  const groupedConversations = filteredConversations.reduce(
    (groups, conversation) => {
      const key = conversation.listing_id; // Group by listing ID
      if (!groups[key]) {
        // Store title once per group
        groups[key] = { title: conversation.listing_title, convos: [] };
      }
      groups[key].convos.push(conversation);
      return groups;
    },
    {} as Record<string, { title: string; convos: Conversation[] }>
  );

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-60px)] bg-gray-50">
        {/* Left sidebar - Conversations list */}
        <div
          className="w-full md:w-1/3 border-r flex flex-col overflow-hidden" // Responsive width
          style={{ borderColor: styles.warmBorder }}
        >
          <div
            className="p-4 border-b"
            style={{ borderColor: styles.warmBorder }}
          >
            <h1
              className="text-xl font-semibold mb-4"
              style={{ color: styles.warmText }}
            >
              Messages
            </h1>
            <div className="relative">
              <Search className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full w-4 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[styles.warmPrimary] focus:border-[styles.warmPrimary]"
                style={{ borderColor: styles.warmBorder }}
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation List Area */}
          <div className="flex-1 overflow-y-auto">
            {loadingConversations ? (
              <div className="flex justify-center items-center h-32">
                <Loader2
                  className="animate-spin h-8 w-8"
                  style={{ color: styles.warmPrimary }}
                />
              </div>
            ) : errorConversations ? (
              <div className="p-4 text-center text-red-600">
                <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                Error loading conversations: {errorConversations}
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p className="mb-4">No conversations yet.</p>
                <button
                  onClick={() => router.push("/buy")}
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: styles.warmPrimary }}
                >
                  Browse Listings
                </button>
              </div>
            ) : filteredConversations.length === 0 && searchQuery ? (
              <div className="text-center p-8 text-gray-500">
                No conversations match '{searchQuery}'.
              </div>
            ) : (
              Object.entries(groupedConversations).map(([listingId, group]) => (
                <div key={listingId} className="mb-1">
                  <div
                    className="bg-gray-100 p-2 text-xs font-medium sticky top-0 z-10"
                    style={{ color: styles.warmText }}
                  >
                    {group.title}
                  </div>
                  <ul>
                    {group.convos.map((conv) => (
                      <li
                        key={conv.id}
                        className={`px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 ${
                          selectedConversation?.id === conv.id
                            ? "bg-gray-200"
                            : ""
                        }`}
                        onClick={() => handleConversationClick(conv)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            {" "}
                            {/* min-w-0 prevents overflow */}
                            <h3
                              className="font-medium truncate"
                              style={{ color: styles.warmText }}
                            >
                              {conv.participant_name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                              {conv.last_message}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap pl-2">
                            {new Date(
                              conv.last_message_time
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side - Active chat */}
        <div className="flex-1 flex flex-col bg-white">
          {" "}
          {/* Added bg-white */}
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <h2 className="text-xl mb-2">Select a conversation</h2>
                <p>Choose a chat from the sidebar to start messaging.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div
                className="p-4 border-b flex items-center justify-between bg-white z-10"
                style={{ borderColor: styles.warmBorder }}
              >
                <h2
                  className="font-semibold text-lg"
                  style={{ color: styles.warmText }}
                >
                  {participantInfo.participantName || "Loading..."}
                </h2>
                {participantInfo.listingInfo && (
                  <div
                    className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={goToListing}
                    title={`View listing: ${participantInfo.listingInfo.title}`}
                  >
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {participantInfo.listingInfo.title}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: styles.warmPrimary }}
                      >
                        ₹{participantInfo.listingInfo.price.toLocaleString()}
                      </p>
                    </div>
                    {/* Optional: Add image or icon */}
                  </div>
                )}
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {" "}
                {/* Message bubbles spacing & background */}
                {chatState.loading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2
                      className="h-8 w-8 animate-spin"
                      style={{ color: styles.warmPrimary }}
                    />
                  </div>
                ) : chatState.error ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-600">Error loading messages:</p>
                      <p className="text-red-500 text-sm">{chatState.error}</p>
                    </div>
                  </div>
                ) : chatState.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>No messages yet.</p>
                    <p className="text-sm">
                      Send a message to start the conversation!
                    </p>
                  </div>
                ) : (
                  chatState.messages.map((message) => (
                    <div
                      key={message.id} // Use message.id as key
                      className={`flex ${
                        message.sender_id === userId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl max-w-[70%] px-4 py-2 shadow-sm ${
                          message.sender_id === userId
                            ? "bg-[styles.warmPrimary] text-white rounded-br-none" // Your messages
                            : "bg-white text-[styles.warmText] rounded-bl-none border border-gray-100" // Other's messages
                        }`}
                        // Applying styles directly for dynamic colors
                        style={{
                          backgroundColor:
                            message.sender_id === userId
                              ? styles.warmPrimary
                              : "#FFFFFF",
                          color:
                            message.sender_id === userId
                              ? "white"
                              : styles.warmText,
                        }}
                      >
                        <p className="break-words text-sm">{message.message}</p>
                        <div
                          className={`text-xs mt-1 text-right ${
                            message.sender_id === userId
                              ? "opacity-70"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
              </div>

              {/* Message input form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t flex items-center bg-white" // Ensure input area has background
                style={{ borderColor: styles.warmBorder }}
              >
                <input
                  type="text"
                  value={newMessageInput}
                  onChange={(e) => setNewMessageInput(e.target.value)}
                  className="flex-grow p-3 border rounded-lg mr-2 text-sm focus:outline-none focus:ring-1"
                  style={{
                    borderColor: styles.warmBorder,
                  }}
                  placeholder="Type your message..."
                  disabled={
                    chatState.sending || chatState.loading || !!chatState.error
                  } // Disable if sending, loading, or error
                  onKeyDown={(e) => {
                    // Allow Enter to send message, but Shift+Enter for new line
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (
                        newMessageInput.trim() &&
                        !chatState.sending &&
                        !chatState.loading &&
                        !chatState.error
                      ) {
                        handleSendMessage(e);
                      }
                    }
                  }}
                />
                <button
                  type="submit"
                  className="p-3 rounded-lg text-white flex items-center justify-center h-[46px] w-[46px] disabled:opacity-50 transition-colors" // Fixed size, disabled style
                  style={{ backgroundColor: styles.warmPrimary }}
                  disabled={
                    !newMessageInput.trim() ||
                    chatState.sending ||
                    chatState.loading ||
                    !!chatState.error
                  }
                >
                  {chatState.sending ? (
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
    </>
  );
}
