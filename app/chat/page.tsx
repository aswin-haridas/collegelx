"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, FormEvent } from "react";
import { styles } from "@/lib/styles";
import Header from "@/components/Sidebar";
import { Loader2, AlertCircle, ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useItem } from "@/lib/hooks/useItem";
import { useSeller } from "@/lib/hooks/useSeller";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  message: string;
  sent_at: string;
}

export default function ChatPage() {
  const { userId, isLoading: authLoading } = useAuth(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams?.get("listingId");
  const receiverId = searchParams?.get("receiverId");

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { item, loading: itemLoading } = useItem(listingId || "");
  const { seller, loading: sellerLoading } = useSeller(receiverId || item?.seller_id || "");

  useEffect(() => {
    if (!userId || !listingId || (!receiverId && !item?.seller_id)) return;

    const sellerId = receiverId || item?.seller_id;
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("listing_id", listingId)
          .or(
            `(sender_id.eq.${userId},receiver_id.eq.${sellerId}),(sender_id.eq.${sellerId},receiver_id.eq.${userId})`
          )
          .order("sent_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError("Failed to load messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Message;
          if (
            (newMessage.sender_id === userId || newMessage.receiver_id === userId) &&
            (newMessage.sender_id === sellerId || newMessage.receiver_id === sellerId)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, listingId, receiverId, item?.seller_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    try {
      setSending(true);
      const sellerId = receiverId || item?.seller_id;
      if (!sellerId) throw new Error("No recipient found");

      const { error } = await supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: sellerId,
        listing_id: listingId,
        message: newMessage.trim(),
        sent_at: new Date().toISOString(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!listingId || (!receiverId && !item?.seller_id)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>No conversation selected</p>
      </div>
    );
  }

  if (loading || authLoading || itemLoading || sellerLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading conversation...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
        <Sidebar />

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg ${message.sender_id === userId ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              <p>{message.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-3 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded-lg"
          placeholder="Type your message..."
          disabled={sending}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg" disabled={!newMessage.trim() || sending}>
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}