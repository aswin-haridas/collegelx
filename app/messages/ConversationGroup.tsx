import { Conversation } from "@/types";
import ConversationItem from "./ConversationItem";

interface ConversationGroupProps {
  listingId: string;
  conversationsGroup: Conversation[];
  handleConversationClick: (conversation: Conversation) => void;
  formatDate: (dateStr: string) => string;
  getListingname: (conversation: Conversation) => string;
}

export default function ConversationGroup({
  listingId,
  conversationsGroup,
  handleConversationClick,
  formatDate,
  getListingname,
}: ConversationGroupProps) {
  return (
    <div key={listingId} className="mb-4">
      <div className="bg-gray-100 p-3 font-medium text-sm sticky top-0">
        {conversationsGroup[0].listing_name ||
          getListingname(conversationsGroup[0])}
      </div>
      <ul className="divide-y divide-gray-200">
        {conversationsGroup.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onConversationClick={handleConversationClick}
            formatDate={formatDate}
          />
        ))}
      </ul>
    </div>
  );
}
