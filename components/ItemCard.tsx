import { useState } from "react";
import Image from "next/image";
import { Item } from "@/lib/types";
import { styles } from "@/lib/styles";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
      style={{ borderColor: styles.warmBorder, backgroundColor: "white" }}
    >
      <div className="relative h-48 bg-gray-100">
        {!imageError ? (
          <Image
            src={item.imageUrl || "/placeholder-image.png"}
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
            ₹{item.price}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
