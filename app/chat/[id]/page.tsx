"use client";
import { useState, useEffect, useRef } from "react";
import { Loader2, AlertCircle, ArrowLeft, Send } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { styles } from "@/lib/styles";
import toast from "react-hot-toast";

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
      supabase.removeChannel(supabase.channel("public:messages"));
      toast.success("Chat connection closed");
    };
  }, [userId, receiverId, listingId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("listing_id", listingId)
        .or(`sender_id.eq.${userId},reciever_id.eq.${userId}`)
        .or(`sender_id.eq.${receiverId},reciever_id.eq.${receiverId}`)
        .order("sent_at", { ascending: true });

      if (error) throw new Error(error.message);

      const filteredMessages = (data || []).filter(
        (msg) =>
          ((msg.sender_id === userId && msg.reciever_id === receiverId) ||
            (msg.sender_id === receiverId && msg.reciever_id === userId)) &&
          msg.listing_id === listingId
      );

      setChatState((prev) => ({ ...prev, messages: filteredMessages }));
    } catch (err) {
      throw err;
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
        setParticipantInfo((prev) => ({ ...prev, receiverName: data.name }));
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
        .select("name, price, id")
        .eq("id", listingId)
        .single();

      if (data && !error) {
        setParticipantInfo((prev) => ({ ...prev, listingInfo: data }));
      }
    } catch (err) {
      console.error("Error fetching listing info:", err);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: any) => {
          const newMessage = payload.new as Message;

          if (
            ((newMessage.sender_id === userId &&
              newMessage.reciever_id === receiverId) ||
              (newMessage.sender_id === receiverId &&
                newMessage.reciever_id === userId)) &&
            newMessage.listing_id === listingId
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

      const messageData = {
        message: chatState.newMessage.trim(),
        sender_id: userId,
        reciever_id: receiverId,
        sent_at: new Date().toISOString(),
        listing_id: listingId,
      };

      const { error } = await supabase.from("messages").insert([messageData]);

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
            chatState.messages.map((msg: any) => (
              <div
                key={msg.id}
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
