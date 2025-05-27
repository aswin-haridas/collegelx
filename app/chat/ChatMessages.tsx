import { styles } from "@/lib/styles";
import { User } from "@/types";

interface MessageType {
  id: string;
  message: string;
  created_at: string;
  seller_id: string;
  buyer_id: string;
  [key: string]: any;
}

interface ChatMessagesProps {
  messages: MessageType[];
  user: User | null;
  loading: boolean;
  error: string | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ChatMessages({
  messages,
  user,
  loading,
  error,
}: ChatMessagesProps) {
  const currentUserId = user?.id || sessionStorage.getItem("user_id");

  if (loading) return <div className="text-center">Loading messages...</div>;
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;
  if (messages.length === 0)
    return <div className="text-center">No messages yet</div>;

  return (
    <div
      className="flex-1 p-4 overflow-y-auto"
      style={{ backgroundColor: styles.background }}
    >
      {messages.map((message) => {
        const isCurrentUser = message.seller_id === currentUserId;
        return (
          <div
            key={message.id}
            className={`mb-4 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-xs p-3 rounded-lg"
              style={{
                backgroundColor: isCurrentUser ? styles.primary : "#FFFFFF",
                color: isCurrentUser ? "#FFFFFF" : styles.text,
              }}
            >
              <p>{message.message}</p>
              <span
                className="text-xs opacity-75"
                style={{
                  color: isCurrentUser ? styles.accent : styles.primary_dark,
                }}
              >
                {formatDate(message.created_at)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
