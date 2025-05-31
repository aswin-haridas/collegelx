"use client";

import { useState, useEffect } from "react";
import Header from "@/shared/components/Header";
import { User } from "@/types";
import { supabase } from "@/shared/lib/supabase";
import Sidebar from "../browse/components/FilterSidebar";

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

  const [user] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");

  return (
    <>
      <Header />
      <div className="flex" style={{ height: "calc(100vh - 70px)" }}>
        <Sidebar 
          chats={chats}
          chatUsers={chatUsers}
          selectedChatId={selectedChatId}
          setSelectedChatId={setSelectedChatId}
          loading={loading}
          error={error}
          user={user}
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
