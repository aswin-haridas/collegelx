import { styles } from "@/lib/styles";

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
        <p className="text-sm">
          Select a product and then a chat from the sidebar to start messaging
          with buyers or sellers.
        </p>
      </div>
    </div>
  );
}
