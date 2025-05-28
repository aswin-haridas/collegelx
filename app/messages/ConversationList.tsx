import { styles } from "@/lib/styles";
import { Conversation } from "@/types";
import ConversationGroup from "./ConversationGroup";
import { useRouter } from "next/navigation";

interface ConversationListProps {
  loading: boolean;
  error: string | null;
  filteredConversations: Conversation[];
  searchQuery: string;
  groupedConversations: Record<string, Conversation[]>;
  handleConversationClick: (conversation: Conversation) => void;
  formatDate: (dateStr: string) => string;
  getListingname: (conversation: Conversation) => string;
}

export default function ConversationList({
  loading,
  error,
  filteredConversations,
  searchQuery,
  groupedConversations,
  handleConversationClick,
  formatDate,
  getListingname,
}: ConversationListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: styles.primary }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: styles.primary }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">
          {searchQuery ? "No matching conversations" : "No conversations found"}
        </h2>
        <p className="text-gray-500 mb-4">
          {searchQuery
            ? "Try a different search term"
            : "You don't have any messages yet"}
        </p>
        {!searchQuery && (
          <button
            onClick={() => router.push("/buy")}
            className="mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: styles.primary }}
          >
            Browse Listings
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {Object.entries(groupedConversations).map(
        ([listingId, conversationsGroup]) => (
          <ConversationGroup
            key={listingId}
            listingId={listingId}
            conversationsGroup={conversationsGroup}
            handleConversationClick={handleConversationClick}
            formatDate={formatDate}
            getListingname={getListingname}
          />
        ),
      )}
    </div>
  );
}
