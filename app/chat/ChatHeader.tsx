import { useRouter } from "next/navigation";
import { styles } from "@/lib/styles";
import { ChatType, ProductType } from "@/types"; // Adjust if you have these types elsewhere

interface ChatHeaderProps {
  chat: ChatType | undefined;
  product: ProductType | undefined;
  setSelectedChatId: (id: string | null) => void;
}

const truncateText = (text: string, maxLength: number = 40) =>
  text.length <= maxLength ? text : text.substring(0, maxLength) + "...";

export default function ChatHeader({
  chat,
  product,
  setSelectedChatId,
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="p-4 flex items-center"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: `1px solid ${styles.primary}`,
      }}
    >
      {/* Back arrow */}
      <div
        className="mr-3 cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
        onClick={() => setSelectedChatId(null)}
        style={{ color: styles.primary_dark }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>

      {/* Product image */}
      {chat?.product_id && product && (
        <div
          className="w-10 h-10 mr-3 rounded-md bg-cover bg-center cursor-pointer"
          style={{
            backgroundImage:
              product.images && product.images.length > 0
                ? `url(${product.images[0]})`
                : "none",
            backgroundColor: styles.primary,
          }}
          onClick={() => router.push(`/buy/${chat.product_id}`)}
        />
      )}

      {/* Chat info */}
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold" style={{ color: styles.text }}>
          {/* Chat name should be passed or derived outside */}
          {chat ? "Chat" : ""}
        </h2>

        {product && (
          <div
            className="text-xs cursor-pointer"
            style={{ color: styles.primary }}
            onClick={() => router.push(`/buy/${chat?.product_id}`)}
          >
            {truncateText(product.name || "View product details")}
          </div>
        )}
      </div>
    </div>
  );
}
