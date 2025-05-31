import { ChatMessage } from "@/types";

interface ConversationItemProps {
  conversation: ChatMessage;
  onConversationClick: (conversation: ChatMessage) => void;
  formatDate: (dateStr: string) => string;
}

export default function ConversationItem({
  conversation,
  onConversationClick,
  formatDate,
}: ConversationItemProps) {
  return (
    <li
      key={conversation.id}
      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onConversationClick(conversation)}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-lg">
            {conversation.sender_id}
          </h3>
          <p className="text-gray-600 mt-1 line-clamp-1">
            {conversation.message}
          </p>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
            {conversation.created_at
                ? formatDate(conversation.created_at)
                : "Just now"}
        </div>
      </div>
    </li>
  );
}
