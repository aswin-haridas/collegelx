"use client";

import { useState, useEffect } from "react";
import { useChat } from "./useChat";
import Header from "@/shared/components/Header";
import { User } from "@/types";
import { supabase } from "@/shared/lib/supabase";

export default function ChatPage() {
  const {
    messages,
    chats,
    chatProducts,
    chatUsers,
    loading,
    error,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
  } = useChat();

  const [user, setUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const currentUserId = sessionStorage.getItem("user_id");
    if (currentUserId) {
      const fetchUser = async () => {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUserId)
          .single();

        if (data) setUser(data);
      };
      fetchUser();
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex" style={{ height: "calc(100vh - 70px)" }}>
        <Sidebar
          chats={chats}
          chatProducts={chatProducts}
          chatUsers={chatUsers}
          user={user}
          loading={loading}
          error={error}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
        />
        <ChatWindow
          messages={messages}
          user={user}
          chats={chats}
          chatProducts={chatProducts}
          chatUsers={chatUsers}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
        />
      </div>
    </>
  );
}
