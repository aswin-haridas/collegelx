import { useState } from "react";
import Image from "next/image";
import { Item } from "@/types"; // Added import
import { styles } from "@/shared/styles/theme";
import Link from "next/link";
import { Edit, Trash2, Star, Heart } from "lucide-react";

interface ItemCardProps {
  item: Item;
  showControls?: boolean;
  isOwnItem?: boolean;
  isWishlistItem?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAsSold?: (id: string) => void;
  onRemoveFromWishlist?: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  showControls = false,
  isOwnItem = false,
  isWishlistItem = false,
  onEdit,
  onDelete,
  onMarkAsSold,
  onRemoveFromWishlist,
}) => {
    // Removed erroneous export default line
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    // Get the first image URL or use the legacy imageUrl property
    const displayImage = item.images?.[0] ?? "/images/placeholder.png";

    const handleAction = (
      e: React.MouseEvent,
      action: (id: string) => void,
      id: string,
    ) => {
      e.preventDefault();
      e.stopPropagation();
      action(id);
    };

    return (
      <Link href={`/buy/${item.id}`} className="block h-full">
        <div
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
          style={{ borderColor: styles.primary_dark, backgroundColor: "white" }}
        >
          <div className="relative h-48 bg-gray-100">
            {!imageError ? (
              <Image
                src={displayImage}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "cover",
                }}
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500 text-sm">
                  Image not available
                </span>
              </div>
            )}
            {item.status !== "available" && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {item.status}
              </div>
            )}

            {/* Item Controls */}
            {showControls && (
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isOwnItem && onEdit && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md"
                    onClick={(e) => handleAction(e, onEdit, item.id)}
                    style={{ color: styles.primary }}
                    title="Edit item"
                  >
                    <Edit size={16} />
                  </button>
                )}

                {isOwnItem && item.status !== "sold" && onMarkAsSold && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md"
                    onClick={(e) => handleAction(e, onMarkAsSold, item.id)}
                    style={{ color: "#16a34a" }}
                    title="Mark as sold"
                  >
                    <Star size={16} fill="#16a34a" />
                  </button>
                )}

                {isOwnItem && onDelete && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md"
                    onClick={(e) => handleAction(e, onDelete, item.id)}
                    style={{ color: "#ef4444" }}
                    title="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {isWishlistItem && onRemoveFromWishlist && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md"
                    onClick={(e) =>
                      handleAction(e, onRemoveFromWishlist, item.id)
                    }
                    style={{ color: "#ef4444" }}
                    title="Remove from wishlist"
                  >
                    <Heart size={16} fill="#ef4444" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3
              className="font-medium text-lg mb-2"
              style={{ color: styles.primary }}
            >
              {item.name}
            </h3>
            <p className="text-gray-600 mb-2 text-sm flex-grow">
              {item.description.length > 100
                ? `${item.description.substring(0, 100)}...`
                : item.description}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold" style={{ color: styles.primary }}>
                ₹{item.price.toFixed(2)}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {item.category}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  // Removed extra curly brace from erroneous line
};

export default ItemCard; // Added default export
