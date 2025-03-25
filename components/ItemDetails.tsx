import { Item, User } from "@/lib/types";
import { styles } from "@/lib/styles";
import { MessageCircle } from "lucide-react";

interface ItemDetailsProps {
  item: Item;
  seller: User;
  onContactSeller: () => void;
}

export function ItemDetails({
  item,
  seller,
  onContactSeller,
}: ItemDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-96">
        {item.image_url && item.image_url.length > 0 ? (
          <img
            src={item.image_url[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Item header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: styles.warmText }}
            >
              {item.title}
            </h1>
            <p
              className="text-2xl font-bold"
              style={{ color: styles.warmPrimary }}
            >
              ₹{item.price.toFixed(2)}
            </p>
          </div>

          <button
            onClick={onContactSeller}
            className="px-4 py-2 rounded-lg text-white flex items-center"
            style={{ backgroundColor: styles.warmPrimary }}
          >
            <MessageCircle className="mr-2" size={20} />
            Contact Seller
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: styles.warmText }}
          >
            Description
          </h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {item.description}
          </p>
        </div>

        {/* Seller info */}
        <div
          className="border-t pt-4"
          style={{ borderColor: styles.warmBorder }}
        >
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: styles.warmText }}
          >
            Seller Information
          </h2>
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
              {seller.profile_image ? (
                <img
                  src={seller.profile_image}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-300">
                  <span className="text-sm text-gray-500">
                    {seller.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium" style={{ color: styles.warmText }}>
                {seller.name}
              </p>
              <p className="text-sm text-gray-500">
                Member since {new Date(seller.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
