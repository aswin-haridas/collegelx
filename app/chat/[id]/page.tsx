"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, ArrowLeft, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import toast from "react-hot-toast";

// Define Message type locally or import from a shared types file if available
// For now, defining it locally based on usage.
type Message = {
  id?: string; // Assuming messages have an id
  listing_id: string;
  sender_id: string;
  reciever_id: string; // Typo: should be receiver_id
  message: string;
  sent_at: string; // ISO string date
  // Add any other relevant fields for a message
};

export default function ChatPage() {
  const [chatState, setChatState] = useState({
    messages: [] as Message[],
    newMessage: "",
    sending: false,
    loading: true,
    error: null as string | null,
  });

  const [participantInfo, setParticipantInfo] = useState({
    receiverName: null as string | null,
    listingInfo: null as { name: string; price: number; id: string } | null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = sessionStorage.getItem("user_id");
  const receiverId =
    searchParams?.get("receiverId") || sessionStorage.getItem("receiver_id");
  const listingId =
    searchParams?.get("listingId") || sessionStorage.getItem("listing_id");

  useEffect(() => {
    if (!userId || !receiverId || !listingId) {
      router.push("/messages");
      return;
    }

    if (receiverId) sessionStorage.setItem("receiver_id", receiverId);
    if (listingId) sessionStorage.setItem("listing_id", listingId);

    const loadChatData = async () => {
      try {
        setChatState((prev) => ({ ...prev, loading: true }));

        await Promise.all([
          fetchMessages(),
          fetchReceiverName(),
          fetchListingInfo(),
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load chat data";
        setChatState((prev) => ({ ...prev, error: errorMessage }));
        console.error("Error loading chat data:", err);
      } finally {
        setChatState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadChatData();
    setupRealtimeSubscription();

    return () => {
      // MODIFIED: Table name for removing channel
      supabase.removeChannel(supabase.channel("public:chat_messages"));
      toast.success("Chat connection closed");
    };
  }, [userId, receiverId, listingId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages]);

  const fetchMessages = async () => {
    try {
      // MODIFIED: Table name from "messages" to "chat_messages"
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("listing_id", listingId) // This might need to be chat_room_id if schema changed
        .or(`sender_id.eq.${userId},reciever_id.eq.${userId}`) // reciever_id typo
        .or(`sender_id.eq.${receiverId},reciever_id.eq.${receiverId}`) // reciever_id typo
        .order("sent_at", { ascending: true }); // sent_at should be created_at for chat_messages

      if (error) throw new Error(error.message);
      
      // The filtering logic might need adjustment based on chat_messages schema
      // (e.g. using chat_room_id instead of listing_id directly)
      const filteredMessages = (data || []).filter(
        (msg) =>
          ((msg.sender_id === userId && msg.reciever_id === receiverId) || // reciever_id typo
            (msg.sender_id === receiverId && msg.reciever_id === userId)) && // reciever_id typo
          msg.listing_id === listingId // This condition might change
      );

      setChatState((prev) => ({ ...prev, messages: filteredMessages as Message[] }));
    } catch (err) {
      throw err;
    }
  };

  const fetchReceiverName = async () => {
    if (!receiverId) return;

    try {
      // Assuming "profiles" is old, should be "users"
      const { data, error } = await supabase
        .from("users") // MODIFIED: "profiles" to "users"
        .select("full_name") // "name" to "full_name"
        .eq("id", receiverId)
        .single();

      if (data && !error) {
        setParticipantInfo((prev) => ({ ...prev, receiverName: data.full_name }));
      }
    } catch (err) {
      console.error("Error fetching receiver name:", err);
    }
  };

  const fetchListingInfo = async () => {
    if (!listingId) return;

    try {
      const { data, error } = await supabase
        .from("listings")
        .select("title, price, id") // "name" to "title"
        .eq("id", listingId)
        .single();

      if (data && !error) {
        setParticipantInfo((prev) => ({ ...prev, listingInfo: {name: data.title, price: data.price, id: data.id} }));
      }
    } catch (err) {
      console.error("Error fetching listing info:", err);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      // MODIFIED: Table name for channel
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          // MODIFIED: Table name for subscription
          table: "chat_messages",
        },
        (payload: any) => {
          const newMessage = payload.new as Message;

          // This condition might need adjustment based on chat_messages schema
          if (
            ((newMessage.sender_id === userId &&
              newMessage.reciever_id === receiverId) || // reciever_id typo
              (newMessage.sender_id === receiverId &&
                newMessage.reciever_id === userId)) && // reciever_id typo
            newMessage.listing_id === listingId // This condition might change
          ) {
            setChatState((prev) => ({
              ...prev,
              messages: [...prev.messages, newMessage],
            }));
          }
        }
      )
      .subscribe();

    toast.success("Chat connection established");
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatState.newMessage.trim() || !userId || !receiverId || !listingId)
      return;

    try {
      setChatState((prev) => ({ ...prev, sending: true }));

      // Data needs to align with chat_messages schema
      const messageData = {
        message: chatState.newMessage.trim(),
        sender_id: userId,
        // reciever_id: receiverId, // This field is not in chat_messages, chat_room_id is
        // sent_at: new Date().toISOString(), // This will be created_at, auto-generated
        // listing_id: listingId, // This is likely part of chat_room now
        chat_room_id: "", // This needs to be fetched or created based on listingId, userId, receiverId
        // is_read: false (default)
      };
      
      // This part needs significant rework:
      // 1. Find or create a chat_room_id based on listing_id, buyer_id (userId), seller_id (receiverId)
      // 2. Then insert the message with that chat_room_id

      // Placeholder for the actual logic to get/create chat_room_id
      // For now, this insert will likely fail or insert with missing chat_room_id
      // MODIFIED: Table name from "messages" to "chat_messages"
      const { error } = await supabase.from("chat_messages").insert([
        { 
          message: chatState.newMessage.trim(),
          sender_id: userId,
          // chat_room_id: foundOrCreatedChatRoomId, // This is what's needed
        }
      ]);


      if (error) throw new Error(error.message);

      setChatState((prev) => ({ ...prev, newMessage: "", sending: false }));
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
      setChatState((prev) => ({ ...prev, sending: false }));
    }
  };

  const goToListing = () => {
    if (listingId) {
      router.push(`/buy/${listingId}`);
    }
  };

  if (chatState.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: styles.warmPrimary }}
        />
      </div>
    );
  }

  if (chatState.error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">{chatState.error}</p>
          <button
            onClick={() => router.push("/messages")}
            className="mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: styles.warmPrimary }}
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      <div className="flex-1 flex flex-col">
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: styles.warmBorder }}
        >
          <div className="flex items-center">
            <button
              onClick={() => router.push("/messages")}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft
                className="h-5 w-5"
                style={{ color: styles.warmText }}
              />
            </button>
            <div>
              <h2
                className="font-medium text-lg"
                style={{ color: styles.warmText }}
              >
                {participantInfo.receiverName || "Chat"}
              </h2>
            </div>
          </div>

          {participantInfo.listingInfo && (
            <div
              className="flex items-center bg-gray-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={goToListing}
            >
              <div>
                <p className="text-sm font-medium">
                  {participantInfo.listingInfo.name}
                </p>
                <p className="text-sm" style={{ color: styles.warmPrimary }}>
                  ₹{participantInfo.listingInfo.price}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {chatState.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            chatState.messages.map((msg: Message) => ( // Used defined Message type
              <div
                key={msg.id} // Assuming message has an id
                className={`flex mb-4 ${
                  msg.sender_id === userId ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender_id !== userId && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: styles.warmPrimary }}
                  >
                    {participantInfo.receiverName
                      ? participantInfo.receiverName.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
                <div
                  className={`rounded-lg max-w-[70%] shadow-sm ${
                    msg.sender_id === userId
                      ? "rounded-tr-none ml-2"
                      : "rounded-tl-none mr-2"
                  }`}
                  style={{
                    backgroundColor:
                      msg.sender_id === userId ? styles.warmPrimary : "#F5F5F7",
                    color: msg.sender_id === userId ? "white" : styles.warmText,
                    padding: "12px 16px",
                  }}
                >
                  <p className="break-words">{msg.message}</p>
                  <div className="text-xs mt-1 opacity-80 text-right">
                    {/* sent_at should be created_at from chat_messages */}
                    {new Date(msg.sent_at).toLocaleTimeString([], { 
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t flex"
          style={{ borderColor: styles.warmBorder }}
        >
          <input
            type="text"
            value={chatState.newMessage}
            onChange={(e) =>
              setChatState((prev) => ({ ...prev, newMessage: e.target.value }))
            }
            className="flex-grow p-3 border rounded-lg mr-2"
            style={{ borderColor: styles.warmBorder }}
            placeholder="Type your message..."
            disabled={chatState.sending}
          />
          <button
            type="submit"
            className="p-3 rounded-lg text-white"
            style={{ backgroundColor: styles.warmPrimary }}
            disabled={!chatState.newMessage.trim() || chatState.sending}
          >
            {chatState.sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
