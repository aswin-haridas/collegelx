import { useState } from "react";
import Image from "next/image";
import { styles } from "@/lib/styles";
import Link from "next/link";
import { Item } from "@/lib/types";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Get the first image URL or use the legacy imageUrl property
  const displayImage = (item.images?.[0] ?? "/images/default-placeholder.png");
  
  return (
    <Link href={`/buy/${item.id}`} className="block h-full">
      <div
        className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
        style={{ borderColor: styles.warmBorder, backgroundColor: "white" }}
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
              <span className="text-gray-500 text-sm">Image not available</span>
            </div>
          )}
          {item.status !== "available" && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {item.status}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3
            className="font-medium text-lg mb-2"
            style={{ color: styles.warmText }}
          >
            {item.title}
          </h3>
          <p className="text-gray-600 mb-2 text-sm flex-grow">
            {item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold" style={{ color: styles.warmText }}>
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
};

export default ItemCard;
