import { useEffect, useRef } from "react";
import { styles } from "@/lib/styles";
import { ChatMessageType, ChatType, ProductType, UserMap } from "@/types";

interface ChatWindowProps {
  selectedChat: ChatType | undefined;
  chatUsers: UserMap;
  messages: ChatMessageType[];
  user: any;
}

export default function ChatWindow({
  selectedChat,
  chatUsers,
  messages,
  user,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || sessionStorage.getItem("user_id");

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getUserName = (id: string) => chatUsers[id]?.name || "Unknown";

  return (
    <div className="w-2/3 h-full flex flex-col justify-between relative">
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs sm:max-w-sm break-words ${
                  isCurrentUser ? "text-white" : "text-black bg-gray-200"
                }`}
                style={{
                  backgroundColor: isCurrentUser ? styles.primary : "#f1f1f1",
                }}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
}
