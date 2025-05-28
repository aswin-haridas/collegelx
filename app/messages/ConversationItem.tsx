import { Conversation } from "@/types";

interface ConversationItemProps {
  conversation: Conversation;
  onConversationClick: (conversation: Conversation) => void;
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
            {conversation.participant_name}
          </h3>
          <p className="text-gray-600 mt-1 line-clamp-1">
            {conversation.last_message}
          </p>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap ml-4">
          {formatDate(conversation.last_message_time)}
        </div>
      </div>
    </li>
  );
}
