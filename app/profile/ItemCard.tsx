import React, { useState } from "react";
import Image from "next/image";
import { styles } from "@/shared/lib/styles";
import Link from "next/link";
import { Item } from "@/shared/lib/types";
import { Edit, Trash2, Star, Heart } from "lucide-react";
import Modal from "@/shared/components/Modal";

interface ItemCardProps {
  item: Item;
  showControls?: boolean;
  isOwnItem?: boolean;
  isWishlistItem?: boolean;
  onEdit?: (item: Item) => void;
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
  const [imageError, setImageError] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMarkAsSoldModalOpen, setIsMarkAsSoldModalOpen] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Get the first image URL or use a placeholder
  const displayImage = item.images?.[0] ?? "/images/placeholder.png";

  // Handle action button clicks
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(item);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleMarkAsSoldClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMarkAsSoldModalOpen(true);
  };

  const handleWishlistRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromWishlist) onRemoveFromWishlist(item.id);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (onDelete) onDelete(item.id);
    setIsDeleteModalOpen(false);
  };

  // Confirm marking as sold
  const confirmMarkAsSold = () => {
    if (onMarkAsSold) onMarkAsSold(item.id);
    setIsMarkAsSoldModalOpen(false);
  };

  return (
    <>
      <Link href={`/buy/${item.id}`} className="block h-full">
        <div
          className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col group"
          style={{ borderColor: styles.Border, backgroundColor: "white" }}
        >
          <div className="relative h-48 bg-gray-100">
            {!imageError ? (
              <Image
                src={displayImage}
                alt={item.title}
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

            {/* Item Controls - Now with opacity transition on hover */}
            {showControls && (
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isOwnItem && onEdit && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    onClick={handleEditClick}
                    style={{ color: styles.Primary }}
                    title="Edit item"
                  >
                    <Edit size={16} />
                  </button>
                )}

                {isOwnItem && item.status !== "sold" && onMarkAsSold && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    onClick={handleMarkAsSoldClick}
                    style={{ color: "#16a34a" }}
                    title="Mark as sold"
                  >
                    <Star size={16} fill="#16a34a" />
                  </button>
                )}

                {isOwnItem && onDelete && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    onClick={handleDeleteClick}
                    style={{ color: "#ef4444" }}
                    title="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {isWishlistItem && onRemoveFromWishlist && (
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    onClick={handleWishlistRemoveClick}
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
              className="font-medium text-lg mb-2 line-clamp-1"
              style={{ color: styles.Text }}
            >
              {item.title}
            </h3>
            <p className="text-gray-600 mb-2 text-sm flex-grow line-clamp-2">
              {item.description}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold" style={{ color: styles.Text }}>
                ₹{item.price.toFixed(2)}
              </span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {item.category}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Confirmation Modals */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="py-4">
          <p>Are you sure you want to delete &#34;{item.title}&quot;?</p>
          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isMarkAsSoldModalOpen}
        onClose={() => setIsMarkAsSoldModalOpen(false)}
        title="Mark Item as Sold"
      >
        <div className="py-4">
          <p>Mark &#34;{item.title}&#34; as sold?</p>
          <p className="text-gray-500 text-sm mt-2">
            This will hide the item from the marketplace.
          </p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setIsMarkAsSoldModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmMarkAsSold}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Mark as Sold
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ItemCard;
