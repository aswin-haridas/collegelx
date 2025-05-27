import { useState } from "react";
import { styles } from "@/lib/styles";

interface MessageInputProps {
  onSend: (message: string) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage.trim());
    setNewMessage("");
  };

  return (
    <div
      className="p-4 flex items-center"
      style={{
        backgroundColor: "#FFFFFF",
        borderTop: `1px solid ${styles.primary}`,
      }}
    >
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 p-2 rounded-l-md focus:outline-none"
        style={{
          border: `1px solid ${styles.primary}`,
          backgroundColor: styles.background,
          color: styles.text,
        }}
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        className="p-2 rounded-r-md"
        style={{
          backgroundColor: styles.primary,
          color: "#FFFFFF",
        }}
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
